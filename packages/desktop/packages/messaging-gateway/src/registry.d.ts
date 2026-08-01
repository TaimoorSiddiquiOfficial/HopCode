/**
 * MessagingGatewayRegistry — owns per-workspace MessagingGateway instances.
 *
 * Responsibilities:
 *   - Satisfies IMessagingGatewayRegistry for the RPC handlers in server-core.
 *   - Acts as a single EventSink consumer fanning session events to the right gateway.
 *   - Owns the in-memory pairing code manager (shared across workspaces; codes are workspace-scoped).
 *   - Owns per-workspace MessagingConfig (messaging/config.json).
 *   - Owns platform adapter lifecycle (initialize/swap/destroy) via CredentialManager.
 *
 * The registry is constructed once, wired into HandlerDeps, then populated with
 * gateways via initializeWorkspace() for every workspace that has messaging enabled.
 */
import type { PushTarget } from '@craft-agent/shared/protocol';
import type { CredentialManager } from '@craft-agent/shared/credentials';
import type { ISessionManager, IMessagingGatewayRegistry, MessagingBindingInfo, MessagingConfigInfo } from '@craft-agent/server-core/handlers';
import type { EventSinkFn } from './event-fanout';
import type { MessagingLogger } from './types';
export interface MessagingGatewayRegistryOptions {
    sessionManager: ISessionManager;
    credentialManager: CredentialManager;
    /** Absolute path to the messaging storage directory for the given workspace. */
    getMessagingDir: (workspaceId: string) => string;
    /** Optional legacy messaging dir (pre-relocation) for one-shot migration. */
    getLegacyMessagingDir?: (workspaceId: string) => string | undefined;
    /** Broadcasts an RPC push event to UI clients. No-op if undefined. */
    publishEvent?: (channel: string, target: PushTarget, ...args: unknown[]) => void;
    /** Optional WhatsApp worker config — required to enable the WhatsApp adapter. */
    whatsapp?: {
        /** Absolute path to the worker entry (packaged/unpacked from @craft-agent/messaging-whatsapp-worker). */
        workerEntry: string;
        /** Node binary override (defaults to process.execPath with ELECTRON_RUN_AS_NODE). */
        nodeBin?: string;
        /** Pairing flow: 'qr' or 'code'. Defaults to 'code' (phone-number based). */
        pairingMode?: 'qr' | 'code';
    };
    /** Optional logger — shared with the gateway and adapters. */
    logger?: MessagingLogger;
}
export declare class MessagingGatewayRegistry implements IMessagingGatewayRegistry {
    private readonly opts;
    private readonly workspaces;
    private readonly pairing;
    private readonly log;
    constructor(opts: MessagingGatewayRegistryOptions);
    initializeWorkspace(workspaceId: string): Promise<void>;
    removeWorkspace(workspaceId: string): Promise<void>;
    stopAll(): Promise<void>;
    get size(): number;
    getConfig(workspaceId: string): MessagingConfigInfo | null;
    updateConfig(workspaceId: string, partial: Partial<MessagingConfigInfo>): Promise<void>;
    getBindings(workspaceId: string): MessagingBindingInfo[];
    unbindSession(workspaceId: string, sessionId: string, platform?: string): void;
    unbindBinding(workspaceId: string, bindingId: string): boolean;
    generatePairingCode(workspaceId: string, sessionId: string, platform: string): {
        code: string;
        expiresAt: number;
        botUsername?: string;
    };
    testTelegramToken(token: string): Promise<{
        success: boolean;
        botName?: string;
        botUsername?: string;
        error?: string;
    }>;
    saveTelegramToken(workspaceId: string, token: string): Promise<void>;
    disconnectPlatform(workspaceId: string, platform: string): Promise<void>;
    forgetPlatform(workspaceId: string, platform: string): Promise<void>;
    startWhatsAppConnect(workspaceId: string): Promise<void>;
    submitWhatsAppPhone(workspaceId: string, phoneNumber: string): Promise<void>;
    private startWhatsAppAdapter;
    private onWhatsAppEvent;
    onSessionEvent: EventSinkFn;
    private bootstrapWorkspace;
    private tryConnectTelegram;
    private setPlatformRuntime;
    private emitBindingChanged;
    private emitPlatformStatus;
    private hasWhatsAppAuthState;
    private getWhatsAppAuthStateDir;
}
