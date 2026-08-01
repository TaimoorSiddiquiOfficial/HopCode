/**
 * Commands — handles chat commands from unbound or bound channels.
 *
 * /new [name]    — create session + bind
 * /bind          — list recent sessions (or by id / index)
 * /pair <code>   — finish a session-initiated pairing flow
 * /unbind        — disconnect channel
 * /help          — show available commands
 * /status        — show current binding
 * /stop          — abort the current agent run
 */
import type { ISessionManager } from '@craft-agent/server-core/handlers';
import type { BindingStore } from './binding-store';
import type { IncomingMessage, MessagingLogger, PlatformAdapter, PlatformType } from './types';
/**
 * Supplied by the registry. The gateway passes the consumer down to Commands so
 * /pair can redeem codes issued via the app UI. Only codes belonging to the
 * gateway's own workspace are honored.
 */
export interface PairingCodeConsumer {
    /**
     * Returns whether this sender may still attempt a /pair consume this minute.
     * Defence-in-depth against brute-forcing the 6-digit code. Counted on entry,
     * not after validation, so wrong guesses consume budget too.
     */
    canConsume(platform: PlatformType, senderId: string): boolean;
    /** Returns the pending pairing (workspace + session) if the code is valid, or null. */
    consume(platform: PlatformType, code: string): {
        workspaceId: string;
        sessionId: string;
    } | null;
}
export declare class Commands {
    private readonly sessionManager;
    private readonly bindingStore;
    private readonly workspaceId;
    private readonly pairingConsumer?;
    private readonly log;
    constructor(sessionManager: ISessionManager, bindingStore: BindingStore, workspaceId: string, pairingConsumer?: PairingCodeConsumer | undefined, logger?: MessagingLogger);
    handle(adapter: PlatformAdapter, msg: IncomingMessage): Promise<void>;
    handleCommand(adapter: PlatformAdapter, msg: IncomingMessage): Promise<boolean>;
    private handleNew;
    private handleBind;
    private handlePair;
    private handleUnbind;
    private handleStatus;
    private handleStop;
    private handleHelp;
    private getRecentSessions;
    private resolveBindTarget;
}
