import type { CommandInteraction, Role } from 'discord.js';
import { Discord, Slash } from 'discordx';
import { prisma } from '../lib/prisma';

@Discord()
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class Scraper {
  @Slash({ name: 'scrape', description: 'Scrape data from the source' })
  async scrape(interaction: CommandInteraction): Promise<void> {
    try {
      if (!interaction.guildId) {
        await interaction.followUp('This command can only be used in a guild.');
        return;
      }

      await interaction.reply('Scraping data...');

      let guildRecord = await prisma.guild.findUnique({
        where: { externalId: interaction.guildId },
      });

      if (!guildRecord) {
        guildRecord = await prisma.guild.create({
          data: {
            externalId: interaction.guildId,
            name: interaction.guild?.name || 'Unknown Guild',
          },
        });
      }

      const serverRoles: Array<Role> = [];
      await interaction.guild?.roles.fetch().then((roles) => {
        console.log(`Roles in the guild:`); // eslint-disable-line no-console
        roles.map(async (role) => {
          serverRoles.push(role);

          const roleRecord = await prisma.role.findUnique({
            where: { externalId: role.id },
          });

          if (!roleRecord) {
            await prisma.role.create({
              data: {
                externalId: role.id,
                name: role.name,
                guildId: guildRecord!.id,
                permissions: role.permissions.toJSON()
              },
            });
          }

          console.log(`- ${role.name}`); // eslint-disable-line no-console
          console.log(`  Permissions: ${role.permissions.toArray().join(', ')}`); // eslint-disable-line no-console
        });
      });

      await interaction.guild?.channels.fetch().then((channels) => {
        console.log(`Channels in the guild:`); // eslint-disable-line no-console
        channels.map((channel) => {
          if (!channel) {
            return;
          }

          const channelType = channel.type || -1;
          const channelName = channel.name || 'Unknown';

          console.log(`- ${channelName} (${channelType})`); // eslint-disable-line no-console
          serverRoles.forEach((role) => {
            // eslint-disable-next-line no-console
            console.log(
              `  Permissions for ${role.name}: ${channel.permissionsFor(role)?.toArray().join(', ')}`,
            );
          });
          console.log(`  Flags: ${channel.flags.toArray().join(', ')}`); // eslint-disable-line no-console
        });
      });

      await interaction.followUp('Data scraped successfully!');

    } catch (error) {
      console.error('Error during scraping:', error); // eslint-disable-line no-console
    } finally {
      await prisma.$disconnect();
    }
  }
}
