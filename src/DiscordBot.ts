import { Client } from 'discordx';
import { dirname, importx } from '@discordx/importer';
import {
  Events,
  IntentsBitField,
  type Interaction,
  type Message,
} from 'discord.js';
import split from 'lodash/split.js';

export class DiscordBot {
  private static _client: Client;

  static get Client(): Client {
    return this._client;
  }

  static async start(): Promise<void> {
    this._client = new Client({
      intents: [
        IntentsBitField.Flags.DirectMessages,
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildIntegrations,
        IntentsBitField.Flags.GuildMessageReactions,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildModeration,
      ],
      botGuilds: [
        (client) => client.guilds.cache.map((guild) => guild.id),
        ...split(process.env.DISCORD_GUILD_IDS, ','),
      ],
      silent: false,
    });

    this._client.once(Events.ClientReady, () => {
      // this._client.clearApplicationCommands(
      //   ...this._client.guilds.cache.map((guild) => guild.id),
      // );

      this._client.initApplicationCommands();
      this._client.initEvents();

      console.log('Bot started'); // eslint-disable-line no-console
    });

    this._client.on(Events.InteractionCreate, (interaction: Interaction) => {
      this._client.executeInteraction(interaction);
    });

    this._client.on(Events.MessageCreate, (message: Message) => {
      this._client.executeCommand(message);
    });

    this._client.on(Events.Error, (error) => {
      console.error('An error occurred:', error); // eslint-disable-line no-console
    });

    await importx(`${dirname(import.meta.url)}/commands/discord/**/*.{js,ts}`);

    if (process.env.DISCORD_BOT_TOKEN) {
      await this._client.login(process.env.DISCORD_BOT_TOKEN);
    } else {
      throw new Error(
        'DISCORD_BOT_TOKEN is not defined in the environment variables.',
      );
    }
  }
}

DiscordBot.start();
