import type {
  CommandInteraction,
  Emoji,
  NonThreadGuildBasedChannel,
  Role,
} from 'discord.js';
import { Discord, Slash } from 'discordx';
import { prisma } from '../../lib/prisma';
import type { ChannelUncheckedCreateInput } from '../../prisma/generated/prisma/models/Channel';
import type { ChannelRoleFindUniqueArgs } from '../../prisma/generated/prisma/models/ChannelRole';
import type {
  Channel,
  Role as PrismaRole,
} from '../../prisma/generated/prisma/client';
import { EmojiUncheckedCreateInput, EmojiWhereUniqueInput } from '../../prisma/generated/prisma/models';

type findOrCreateChannelRoleOptions = {
  channel: NonThreadGuildBasedChannel;
  channelRecord: Channel;
  role: Role;
  roleRecord: PrismaRole;
};

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

      const guildRecord = await this.findOrCreateGuild(interaction);

      const serverRoles: Array<Role> = [];
      await interaction.guild?.roles.fetch().then((roles) => {
        roles.forEach(async (role) => {
          serverRoles.push(role);

          await this.findOrCreateRole(role, guildRecord.id);
        });
      });

      await interaction.guild?.channels.fetch().then((channels) => {
        channels.forEach(async (channel) => {
          if (!channel) {
            return;
          }

          const channelRecord = await this.findOrCreateChannel(
            channel,
            guildRecord.id,
          );

          serverRoles.forEach(async (role) => {
            const roleRecord = await prisma.role.findUniqueOrThrow({
              where: { externalId: role.id },
            });

            await this.findOrCreateChannelRole({
              channel,
              channelRecord,
              role,
              roleRecord,
            });
          });
        });
      });

      await interaction.guild?.emojis.fetch().then((emojis) => {
        emojis.forEach(async (emoji) => {
          await this.findOrCreateEmoji(emoji, guildRecord.id);
        });
      });

      await interaction.followUp('Data scraped successfully!');
    } catch (error) {
      console.error('Error during scraping:', error); // eslint-disable-line no-console
    } finally {
      await prisma.$disconnect();
    }
  }

  private async findOrCreateGuild(interaction: CommandInteraction) {
    if (!interaction.guildId) {
      throw new Error(
        'No guild ID found in the interaction. This command can only be used within a guild.',
      );
    }

    let record = await prisma.guild.findUnique({
      where: { externalId: interaction.guildId },
    });

    if (!record) {
      record = await prisma.guild.create({
        data: {
          externalId: interaction.guildId,
          name: interaction.guild?.name || 'Unknown Guild',
        },
      });
    }

    return record;
  }

  private async findOrCreateRole(role: Role, guildId: number) {
    let record = await prisma.role.findUnique({
      where: { externalId: role.id },
    });

    if (!record) {
      record = await prisma.role.create({
        data: {
          externalId: role.id,
          name: role.name,
          guildId,
          colors: { ...role.colors },
          flags: role.flags.toJSON(),
          hoist: role.hoist,
          mentionable: role.mentionable,
          position: role.position,
          permissions: role.permissions.serialize(true),
        },
      });
    }

    return record;
  }

  private async findOrCreateChannel(
    channel: NonThreadGuildBasedChannel,
    guildId: number,
  ) {
    let record = await prisma.channel.findUnique({
      where: { externalId: channel.id },
    });

    if (!record) {
      record = await prisma.channel.create({
        data: {
          externalId: channel.id,
          externalParentId: channel.parentId,
          name: channel.name || 'Unknown Channel',
          type: channel.type.toString(),
          guildId,
          flags: channel.flags.toJSON(),
          position: channel.position,
        } as ChannelUncheckedCreateInput,
      });
    }

    return record;
  }

  private async findOrCreateChannelRole({
    channel,
    channelRecord,
    role,
    roleRecord,
  }: findOrCreateChannelRoleOptions) {
    let record = await prisma.channelRole.findUnique({
      where: {
        channelId: channelRecord!.id,
        roleId: roleRecord!.id,
      },
    } as ChannelRoleFindUniqueArgs);

    if (!record) {
      record = await prisma.channelRole.create({
        data: {
          channelId: channelRecord!.id,
          roleId: roleRecord!.id,
          permissions: channel.permissionsFor(role)?.serialize(true) || [],
        },
      });
    }

    return record;
  }

  private async getBase64FromUrl(url: string|null): Promise<string> {
    if (!url) {
      return '';
    }

    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    return Buffer.from(buffer).toString('base64');
  }

  private async findOrCreateEmoji(emoji: Emoji, guildId: number) {
    let record = await prisma.emoji.findUnique({
      where: { externalId: emoji!.id } as EmojiWhereUniqueInput,
    });

    if (!record) {
      const base64Data = await this.getBase64FromUrl(emoji!.url);
      record = await prisma.emoji.create({
        data: {
          externalId: emoji!.id,
          name: emoji!.name,
          animated: emoji!.animated,
          guildId,
          base64Data,
        } as EmojiUncheckedCreateInput,
      });
    }

    return record;
  }
}
