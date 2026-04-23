import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { randomUUID } from 'node:crypto';
import type {
  Message,
  TextChannel,
  DMChannel,
  NewsChannel,
  ThreadChannel,
  VoiceChannel,
  StageChannel} from 'discord.js';
import {
  Client,
  GatewayIntentBits,
  Partials,
  type Attachment as DiscordAttachment,
} from 'discord.js';
import { ChannelBase } from '@hoptrendy/channel-base';
import type {
  ChannelConfig,
  ChannelBaseOptions,
  Envelope,
  Attachment,
  AcpBridge,
} from '@hoptrendy/channel-base';

const DISCORD_MAX_LENGTH = 2000;

/** Split a long text into ≤2000-character chunks at newline boundaries. */
function splitMessage(text: string): string[] {
  if (text.length <= DISCORD_MAX_LENGTH) return [text];

  const chunks: string[] = [];
  let remaining = text;
  while (remaining.length > 0) {
    if (remaining.length <= DISCORD_MAX_LENGTH) {
      chunks.push(remaining);
      break;
    }
    // Try to split at a newline within the limit
    const slice = remaining.slice(0, DISCORD_MAX_LENGTH);
    const lastNl = slice.lastIndexOf('\n');
    const splitAt = lastNl > 0 ? lastNl + 1 : DISCORD_MAX_LENGTH;
    chunks.push(remaining.slice(0, splitAt).trimEnd());
    remaining = remaining.slice(splitAt);
  }
  return chunks.filter((c) => c.length > 0);
}

/** Download a Discord attachment to a temp file. Returns the file path. */
async function downloadAttachment(att: DiscordAttachment): Promise<string> {
  const resp = await fetch(att.url);
  if (!resp.ok) throw new Error(`HTTP ${resp.status} downloading ${att.url}`);
  const buf = Buffer.from(await resp.arrayBuffer());
  const dir = join(tmpdir(), 'channel-files', randomUUID());
  mkdirSync(dir, { recursive: true });
  const fileName = att.name ?? `file_${Date.now()}`;
  const filePath = join(dir, fileName);
  writeFileSync(filePath, buf);
  return filePath;
}

type Sendable =
  | TextChannel
  | DMChannel
  | NewsChannel
  | ThreadChannel
  | VoiceChannel
  | StageChannel;

export class DiscordChannel extends ChannelBase {
  private client: Client;
  private botId: string = '';

  constructor(
    name: string,
    config: ChannelConfig,
    bridge: AcpBridge,
    options?: ChannelBaseOptions,
  ) {
    super(name, config, bridge, options);

    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageTyping,
      ],
      partials: [Partials.Channel, Partials.Message],
    });
  }

  async connect(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.client.once('ready', (readyClient) => {
        this.botId = readyClient.user.id;
        process.stderr.write(
          `[Discord:${this.name}] Logged in as ${readyClient.user.tag}\n`,
        );
        resolve();
      });

      this.client.on('messageCreate', (msg: Message) => {
        // Ignore own messages and other bots
        if (msg.author.bot) return;

        this.handleMessage(msg).catch((err) => {
          process.stderr.write(
            `[Discord:${this.name}] Error handling message: ${err}\n`,
          );
        });
      });

      this.client.on('error', (err) => {
        process.stderr.write(`[Discord:${this.name}] Client error: ${err}\n`);
      });

      this.client.login(this.config.token).catch(reject);
    });
  }

  private async handleMessage(msg: Message): Promise<void> {
    const isGroup = msg.guildId !== null;
    const isMentioned =
      msg.mentions.users.has(this.botId) ||
      msg.mentions.roles.some((role) =>
        msg.guild?.members.me?.roles.cache.has(role.id),
      );

    const isReplyToBot =
      msg.reference !== null &&
      msg.reference.messageId !== undefined &&
      (await this.isReplyToOwnMessage(msg));

    // Extract referenced/quoted message text
    let referencedText: string | undefined;
    if (msg.reference?.messageId) {
      try {
        const ref = await msg.channel.messages.fetch(msg.reference.messageId);
        if (ref.author.id === this.botId) {
          referencedText = ref.content || undefined;
        }
      } catch {
        // best-effort
      }
    }

    // Build the envelope text (strip bot mention prefix)
    let text = msg.content;
    if (isMentioned) {
      text = text
        .replace(new RegExp(`<@!?${this.botId}>`, 'g'), '')
        .replace(new RegExp(`<@&\\d+>`, 'g'), '')
        .trim();
    }
    if (!text && msg.attachments.size === 0) return; // empty message

    const envelope: Envelope = {
      channelName: this.name,
      senderId: msg.author.id,
      senderName: msg.member?.displayName ?? msg.author.displayName,
      chatId: msg.channelId,
      text: text || '(attachment)',
      threadId:
        msg.thread?.id ?? (msg.channel.isThread() ? msg.channelId : undefined),
      messageId: msg.id,
      isGroup,
      isMentioned,
      isReplyToBot,
      referencedText,
    };

    // Process attachments
    if (msg.attachments.size > 0) {
      const attachments: Attachment[] = [];
      let imageBase64: string | undefined;
      let imageMimeType: string | undefined;

      for (const [, att] of msg.attachments) {
        const mime = att.contentType ?? 'application/octet-stream';

        if (mime.startsWith('image/') && !imageBase64) {
          // First image: inline as base64
          try {
            const resp = await fetch(att.url);
            if (resp.ok) {
              const buf = Buffer.from(await resp.arrayBuffer());
              imageBase64 = buf.toString('base64');
              imageMimeType = mime;
            }
          } catch {
            // fall through to file attachment
          }
        } else {
          // Non-image or additional images: save to temp
          try {
            const filePath = await downloadAttachment(att);
            const type = mime.startsWith('image/')
              ? 'image'
              : mime.startsWith('audio/')
                ? 'audio'
                : mime.startsWith('video/')
                  ? 'video'
                  : 'file';
            attachments.push({
              type,
              filePath,
              mimeType: mime,
              fileName: att.name ?? undefined,
            });
          } catch (err) {
            process.stderr.write(
              `[Discord:${this.name}] Failed to download attachment: ${err}\n`,
            );
          }
        }
      }

      if (imageBase64) {
        envelope.imageBase64 = imageBase64;
        envelope.imageMimeType = imageMimeType;
      }
      if (attachments.length > 0) {
        envelope.attachments = attachments;
      }
    }

    this.handleInbound(envelope).catch((err) => {
      process.stderr.write(
        `[Discord:${this.name}] handleInbound error: ${err}\n`,
      );
    });
  }

  private async isReplyToOwnMessage(msg: Message): Promise<boolean> {
    if (!msg.reference?.messageId) return false;
    try {
      const ref = await msg.channel.messages.fetch(msg.reference.messageId);
      return ref.author.id === this.botId;
    } catch {
      return false;
    }
  }

  /** Per-channel typing interval — Discord typing expires after ~10s. */
  private typingIntervals = new Map<string, ReturnType<typeof setInterval>>();

  protected override onPromptStart(chatId: string): void {
    const existing = this.typingIntervals.get(chatId);
    if (existing) clearInterval(existing);

    const sendTyping = async () => {
      try {
        const ch = await this.client.channels.fetch(chatId);
        if (ch && 'sendTyping' in ch) {
          await (ch as TextChannel).sendTyping();
        }
      } catch {
        // best-effort
      }
    };

    sendTyping();
    this.typingIntervals.set(chatId, setInterval(sendTyping, 8000));
  }

  protected override onPromptEnd(chatId: string): void {
    const interval = this.typingIntervals.get(chatId);
    if (interval) {
      clearInterval(interval);
      this.typingIntervals.delete(chatId);
    }
  }

  async sendMessage(chatId: string, text: string): Promise<void> {
    let channel: Sendable;
    try {
      const fetched = await this.client.channels.fetch(chatId);
      if (!fetched || !('send' in fetched)) {
        process.stderr.write(
          `[Discord:${this.name}] Channel ${chatId} is not sendable\n`,
        );
        return;
      }
      channel = fetched as Sendable;
    } catch (err) {
      process.stderr.write(
        `[Discord:${this.name}] Failed to fetch channel ${chatId}: ${err}\n`,
      );
      return;
    }

    const chunks = splitMessage(text);
    for (const chunk of chunks) {
      try {
        await (channel as TextChannel).send(chunk);
      } catch (err) {
        process.stderr.write(
          `[Discord:${this.name}] Failed to send message: ${err}\n`,
        );
      }
    }
  }

  disconnect(): void {
    for (const interval of this.typingIntervals.values()) {
      clearInterval(interval);
    }
    this.typingIntervals.clear();
    this.client.destroy();
  }
}
