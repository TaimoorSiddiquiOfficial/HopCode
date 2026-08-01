/**
 * WhatsAppAdapter — out-of-process adapter that spawns the
 * `@craft-agent/messaging-whatsapp-worker` subprocess.
 *
 * WhatsApp has no official bot API usable by us. Baileys reimplements the
 * WA multi-device protocol — it runs in a child process so that:
 *   (a) a Baileys crash/segfault can't take down the Electron main process,
 *   (b) Baileys can run under Node even when the host runtime is Bun,
 *   (c) memory isolation: auth state, signal ratchets, etc.
 *
 * The worker contract is defined in @craft-agent/messaging-whatsapp-worker.
 * This adapter owns the process lifecycle + translates events to the
 * PlatformAdapter interface.
 *
 * Unofficial API disclaimer: Baileys is not endorsed by WhatsApp/Meta and
 * may stop working at any time. Account bans are possible.
 */
import { Buffer } from 'node:buffer';
import type { PlatformAdapter, PlatformConfig, AdapterCapabilities, IncomingMessage, SentMessage, InlineButton, ButtonPress } from '../../types';
export interface WhatsAppConfig extends PlatformConfig {
    /** Directory Baileys persists multi-file auth state into. Required. */
    authStateDir: string;
    /** Absolute path to the worker entry script. Required. */
    workerEntry: string;
    /** Node binary path. Defaults to 'node'. */
    nodeBin?: string;
    /** Pairing flow: 'qr' (default) or 'code' (phone-number based 8-char code). */
    pairingMode?: 'qr' | 'code';
    /**
     * Accept messages sent from this account's other devices (phone/WA
     * Desktop/WA Web) in the self-chat. Agent echoes are filtered by
     * sent-ID tracking + the response prefix. See `WorkerCommand.StartCommand`
     * for mechanics.
     */
    selfChatMode?: boolean;
    /** Prefix tagged onto outbound self-chat messages. Defaults to 🤖. */
    responsePrefix?: string;
    /**
     * Override the default per-send timeout (30s). Used by tests; not
     * exposed through the registry or UI. Shorter values help surface
     * worker deadlocks faster but risk rejecting legitimate sends on
     * slow networks.
     */
    sendTimeoutMs?: number;
}
export type WhatsAppEvent = {
    type: 'qr';
    qr: string;
} | {
    type: 'pairing_code';
    code: string;
} | {
    type: 'connected';
    jid?: string;
    name?: string;
} | {
    type: 'disconnected';
    loggedOut: boolean;
    reason?: string;
} | {
    type: 'unavailable';
    reason: string;
    message: string;
} | {
    type: 'error';
    message: string;
};
type EventHandler = (event: WhatsAppEvent) => void;
export declare class WhatsAppAdapter implements PlatformAdapter {
    readonly platform: "whatsapp";
    readonly capabilities: AdapterCapabilities;
    private proc;
    private stdoutBuffer;
    private connected;
    private started;
    private log;
    private messageHandler;
    private buttonHandler;
    private eventHandlers;
    private pending;
    private nextCmdId;
    private sendTimeoutMs;
    initialize(config: PlatformConfig): Promise<void>;
    destroy(): Promise<void>;
    isConnected(): boolean;
    onMessage(handler: (msg: IncomingMessage) => Promise<void>): void;
    onButtonPress(handler: (press: ButtonPress) => Promise<void>): void;
    /** Subscribe to adapter-level events (QR, pairing code, unavailable, errors). */
    onEvent(handler: EventHandler): () => void;
    /** Submit a phone number to obtain an 8-char pairing code (pairingMode=code). */
    requestPairingCode(phoneNumber: string): Promise<void>;
    sendText(channelId: string, text: string): Promise<SentMessage>;
    editMessage(_channelId: string, _messageId: string, _text: string): Promise<void>;
    sendButtons(channelId: string, text: string, buttons: InlineButton[]): Promise<SentMessage>;
    sendTyping(_channelId: string): Promise<void>;
    sendFile(channelId: string, file: Buffer, filename: string, caption?: string): Promise<SentMessage>;
    private sendCommand;
    private sendWithResult;
    /**
     * Resolve all pending sends with a failure. Called from `proc.on('exit')`
     * (worker crashed/quit) and from `destroy()` (orderly shutdown) so callers
     * never hang waiting for a worker that will never respond.
     */
    private drainPending;
    private fireEvent;
    private onWorkerEvent;
}
export {};
