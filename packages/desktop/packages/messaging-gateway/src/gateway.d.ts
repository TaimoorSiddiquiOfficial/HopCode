/**
 * MessagingGateway — orchestrator for messaging platform adapters.
 *
 * Runs in-process alongside SessionManager. Wires adapters, router,
 * renderer, and binding store together. One instance per workspace.
 */
import type { ISessionManager } from '@craft-agent/server-core/handlers';
import type { PushTarget } from '@craft-agent/shared/protocol';
import { BindingStore } from './binding-store';
import { type PairingCodeConsumer } from './commands';
import type { PlatformAdapter, PlatformType, MessagingLogger } from './types';
export interface GatewayOptions {
    sessionManager: ISessionManager;
    workspaceId: string;
    /** Absolute path to the messaging storage directory. */
    storageDir: string;
    /** Optional legacy directory for one-shot migration of bindings.json. */
    legacyStorageDir?: string;
    /** Optional consumer that resolves /pair codes issued elsewhere. */
    pairingConsumer?: PairingCodeConsumer;
    /** Fired after any binding mutation (bind/unbind). */
    onBindingChanged?: () => void;
    /** Optional logger — defaults to console. Pass a structured host logger in Electron. */
    logger?: MessagingLogger;
}
export declare class MessagingGateway {
    private readonly sessionManager;
    private readonly workspaceId;
    private readonly bindingStore;
    private readonly router;
    private readonly commands;
    private readonly renderer;
    private readonly planTokens;
    private readonly planMessages;
    private readonly pendingCompactAccepts;
    private readonly adapters;
    private readonly log;
    private started;
    constructor(opts: GatewayOptions);
    registerAdapter(adapter: PlatformAdapter): void;
    unregisterAdapter(platform: PlatformType): Promise<void>;
    getAdapter(platform: PlatformType): PlatformAdapter | undefined;
    hasConnectedAdapter(platform: PlatformType): boolean;
    start(): Promise<void>;
    stop(): Promise<void>;
    private wireAdapter;
    onSessionEvent(channel: string, _target: PushTarget, ...args: any[]): void;
    private handleButtonPress;
    private handlePlanButton;
    private finishPendingCompactAccept;
    getBindingStore(): BindingStore;
    isStarted(): boolean;
}
