/**
 * Router — routes inbound messages from platform adapters to sessions.
 *
 * Looks up the ChannelBinding for (platform, channelId).
 * If found → resolves any `IncomingAttachment.localPath` entries to
 * `FileAttachment`s via `readFileAttachment()`, then forwards to
 * SessionManager.
 * If not found → delegates to Commands for /bind, /new, etc.
 */
import type { ISessionManager } from '@craft-agent/server-core/handlers';
import type { BindingStore } from './binding-store';
import type { Commands } from './commands';
import type { IncomingMessage, MessagingLogger, PlatformAdapter } from './types';
export declare class Router {
    private readonly sessionManager;
    private readonly bindingStore;
    private readonly commands;
    private readonly log;
    constructor(sessionManager: ISessionManager, bindingStore: BindingStore, commands: Commands, log?: MessagingLogger);
    route(adapter: PlatformAdapter, msg: IncomingMessage): Promise<void>;
    /**
     * Convert adapter-emitted `IncomingAttachment[]` into the session's
     * `FileAttachment[]` shape. Adapters that download the blob to disk
     * populate `localPath`; we wrap it with `readFileAttachment()` which
     * handles image→base64 / pdf→base64 / text→utf-8 encoding.
     *
     * Attachments without a `localPath`, or whose file can't be read, are
     * silently skipped — the upstream adapter already logged/notified on
     * download failure, so re-surfacing here would double up.
     */
    private resolveAttachments;
}
