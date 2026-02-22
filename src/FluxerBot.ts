import { Client, Events, Message } from '@fluxerjs/core';
import type { APIApplicationCommandInteraction } from '@fluxerjs/types';

export class FluxerBot {
  private static _client: Client;

  static get Client(): Client {
    return this._client;
  }

  static async start(): Promise<void> {
    this._client = new Client({
      intents: 0, // always 0 for now see docs for more info: https://fluxerjs.blstmo.com/v/latest/docs/typedefs/ClientOptions
    });

    this._client.once(Events.Ready, () => {
      console.log('Bot started'); // eslint-disable-line no-console
    });

    this._client.on(
      Events.InteractionCreate,
      (interaction: APIApplicationCommandInteraction) => {
        if (interaction.channel_id) {
          this._client.sendToChannel(
            interaction?.channel_id,
            `Received interaction: ${interaction.id}`,
          );
        } else {
          console.warn('Received interaction without channel_id:', interaction); // eslint-disable-line no-console
        }
      },
    );

    this._client.on(Events.MessageCreate, async (message: Message) => {
      if (message.content === '!ping') {
        await message.reply('Pong!');
      }
    });

    if (process.env.FLUXER_BOT_TOKEN) {
      await this._client.login(process.env.FLUXER_BOT_TOKEN);
    } else {
      throw new Error(
        'FLUXER_BOT_TOKEN is not set in the environment variables.',
      );
    }
  }
}

FluxerBot.start();
