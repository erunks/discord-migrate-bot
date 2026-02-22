import { Message } from '@fluxerjs/core';
import Command from './Command';
import { commandsCommand, pingCommand } from './common';

import join from 'lodash/join.js';
import map from 'lodash/map.js';
import sortBy from 'lodash/sortBy.js';

class CommandManager {
  public commands: Command[] = [];

  constructor() {
    this.importCommands();
  }

  public async handleMessage(message: Message): Promise<void> {
    for (const command of this.commands) {
      if (command.respondsTo(message.content)) {
        await command.respond(message);
        return; // Stop checking other commands after the first match
      }
    }
  }

  private importCommands(): void {
    this.commands.push(pingCommand);

    commandsCommand.execute = async () => {
      const commandList = map(
        sortBy(this.commands, (o) => o.name),
        (command) => command.toString(),
      );

      return 'Here is a list of commands:\n' + join(commandList, '\n');
    };
    this.commands.push(commandsCommand);
  }
}

export default CommandManager;
