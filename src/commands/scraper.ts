import type { CommandInteraction, Role } from 'discord.js';
import { Discord, Slash } from 'discordx';

@Discord()
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class Scraper {
  @Slash({ name: 'scrape', description: 'Scrape data from the source' })
  async scrape(interaction: CommandInteraction): Promise<void> {
    await interaction.reply('Scraping data...');
    const serverRoles: Array<Role> = [];
    await interaction.guild?.roles.fetch().then((roles) => {
      console.log(`Roles in the guild:`); // eslint-disable-line no-console
      roles.map((role) => {
        serverRoles.push(role);
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
    // Implement your scraping logic here
    // For example, you can call an external API or perform web scraping
    // Once the scraping is done, you can send a follow-up message with the results
    await interaction.followUp('Data scraped successfully!');
  }
}
