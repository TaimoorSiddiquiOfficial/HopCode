/**
 * TelegramAdapter — in-process adapter using grammY.
 *
 * Phase 1: polling mode, text-only, DM-only.
 */
import { type Context } from 'grammy';
import type { PlatformAdapter, PlatformConfig, AdapterCapabilities, IncomingMessage, SentMessage, InlineButton, ButtonPress } from '../../types';
/**
 * DM-only guard for Phase 1. Groups/supergroups/channels are ignored because
 * the current trust model treats `channelId` as the authorization boundary —
 * in a DM, the chat IS the authorized party. Opening to groups requires
 * per-sender authorization keyed by `(channelId, senderId)` everywhere
 * (bind, /pair consume, permission/plan callbacks), which doesn't exist yet.
 */
export declare function isPrivateChat(ctx: Context): boolean;
export declare class TelegramAdapter implements PlatformAdapter {
    readonly platform: "telegram";
    readonly capabilities: AdapterCapabilities;
    /** Fetch bot profile (username, display name). Used for UI hints. */
    getBotInfo(): Promise<{
        id: number;
        username?: string;
        firstName?: string;
    } | null>;
    private bot;
    private messageHandler;
    private buttonHandler;
    private connected;
    private log;
    /**
     * Emit one structured log line per dropped non-private update. Deliberately
     * `info` (not `debug`) so a user who notices "bot isn't responding in my
     * group" can confirm via logs without toggling levels.
     */
    private logNonPrivateDropped;
    initialize(config: PlatformConfig): Promise<void>;
    /**
     * Download a Telegram file to a temp path and invoke the message handler
     * with the resulting IncomingMessage. Centralised here so the five
     * `bot.on(...)` handlers only need to pick the right source fields.
     *
     * Failures (oversize, 404, network) are reported back to the sender via
     * `ctx.reply()` and logged. The message is NOT forwarded in that case —
     * the session should not be woken for an attachment we couldn't deliver.
     */
    private emitAttachmentMessage;
    /**
     * Resolve a Telegram `file_id` to a local path by calling `getFile()` to
     * obtain the remote path, then fetching the blob from the Bot API file
     * host and writing it to the OS temp dir. Enforces `MAX_ATTACHMENT_BYTES`
     * against the actual downloaded size in case `getFile` reported no size.
     */
    private downloadToTemp;
    destroy(): Promise<void>;
    isConnected(): boolean;
    onMessage(handler: (msg: IncomingMessage) => Promise<void>): void;
    onButtonPress(handler: (press: ButtonPress) => Promise<void>): void;
    sendText(channelId: string, text: string): Promise<SentMessage>;
    editMessage(channelId: string, messageId: string, text: string): Promise<void>;
    sendButtons(channelId: string, text: string, buttons: InlineButton[]): Promise<SentMessage>;
    sendTyping(channelId: string): Promise<void>;
    sendFile(channelId: string, file: Buffer, filename: string, caption?: string): Promise<SentMessage>;
    clearButtons(channelId: string, messageId: string): Promise<void>;
}
