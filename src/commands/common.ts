import { type CommandInteraction } from 'discord.js';
import { Client, Discord, Slash } from 'discordx';
import get from 'lodash/get';
import join from 'lodash/join';
import map from 'lodash/map';
import sortBy from 'lodash/sortBy';

@Discord()
export class Common {
  @Slash({ name: 'ping', description: 'Ping the bot. Responds with `pong!`' })
  async ping(interaction: CommandInteraction): Promise<void> {
    await interaction.reply('pong!');
  }

  @Slash({ name: 'commands', description: 'List all commands' })
  async commands(interaction: CommandInteraction): Promise<void> {
    const commandList = map(
      sortBy(Client.applicationCommands, (o) => o.name),
      (command) => {
        const name = get(command, 'name');
        const description = get(command, 'description', 'No description available.');

        return `> ${name} - ${description}`;
      }
    );

    await interaction.reply(
      "Here is a list of commands:\n" + join(commandList, '\n')
    );
  }
}

export default Common;
