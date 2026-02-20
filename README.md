# Discord Migration Bot
The purpose of this bot is to scrape the setup information related to a Discord server, and eventually setup a new server in [Fluxer](https://fluxer.app/).

## Setup
- Install the correct `npm` and then `pnpm` versions, through `nvm`
- Run `pnpm install`
- Setup your `.env` file:
  - If you're using SQLite, the `DATABASE_URL` should be a `file:<path>` to your SQLite DB
  - Setup a discord application/bot using their [guides](https://docs.discord.com/developers/quick-start/getting-started) and set the corresponding `DISCORD_BOT_TOKEN`
  - Grab the `GUILD_IDS` of servers you want to scrape data from. This is best done using via the web app. (i.e. `https://discord.com/channels/<GUILD_ID>/<CHANNEL_ID>`)
- Setup the database with `pnpm prisma migrate <DB_NAME>`
- Validate that the models are setup correctly by looking at Prisma's studio tool using `pnpm studio`

## Scraping the data from Discord
- Run the bot `pnpm dev`
- Invite the bot into one of the server(s) which is set under the `GUILD_IDS` env var
- Run the `/scrape` command

## Populating the data in Fluxer
TBD
