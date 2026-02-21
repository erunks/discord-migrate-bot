import type { CommandInteraction, Role } from 'discord.js';
import { Discord, Slash } from 'discordx';
import { prisma } from '../../lib/prisma';
import type { ChannelUncheckedCreateInput } from '../../prisma/generated/prisma/models/Channel';
import type { ChannelRoleFindUniqueArgs } from '../../prisma/generated/prisma/models/ChannelRole';
import type { RoleUncheckedCreateInput } from '../../prisma/generated/prisma/models/Role';

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
                colors: role.colors,
                flags: role.flags.toJSON(),
                hoist: role.hoist,
                mentionable: role.mentionable,
                position: role.position,
                permissions: role.permissions.serialize(true),
              } as RoleUncheckedCreateInput,
            });
          }
        });
      });

      await interaction.guild?.channels.fetch().then((channels) => {
        channels.map(async (channel) => {
          if (!channel) {
            return;
          }

          let channelRecord = await prisma.channel.findUnique({
            where: { externalId: channel.id },
          });

          if (!channelRecord) {
            channelRecord = await prisma.channel.create({
              data: {
                externalId: channel.id,
                externalParentId: channel.parentId,
                name: channel.name || 'Unknown Channel',
                type: channel.type.toString(),
                guildId: guildRecord!.id,
                flags: channel.flags.toJSON(),
                position: channel.position,
              } as ChannelUncheckedCreateInput,
            });
          }

          serverRoles.forEach(async (role) => {
            const roleRecord = await prisma.role.findUniqueOrThrow({
              where: { externalId: role.id },
            });

            const channelRoleRecord = await prisma.channelRole.findUnique({
              where: {
                channelId: channelRecord.id,
                roleId: roleRecord.id,
              }
            } as ChannelRoleFindUniqueArgs);
            
            if (!channelRoleRecord) {
              await prisma.channelRole.create({
                data: {
                  channelId: channelRecord!.id,
                  roleId: roleRecord.id,
                  permissions: channel.permissionsFor(role)?.serialize(true) || [],
                },
              });
            }
          });
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
