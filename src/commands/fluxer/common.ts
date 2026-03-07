import Command from './Command';

export const pingCommand = new Command({
  name: '!ping',
  description: 'Replies with Pong!',
  response: 'Pong!',
});

export const commandsCommand = new Command({
  name: '!commands',
  description: 'Lists all available commands',
});

const commonCommands: Command[] = [pingCommand, commandsCommand];

export default commonCommands;
