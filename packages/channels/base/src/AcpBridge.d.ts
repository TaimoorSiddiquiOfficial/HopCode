import { EventEmitter } from 'node:events';
import type { RequestPermissionResponse } from '@agentclientprotocol/sdk';
import type { AvailableCommand, ChannelLoopToolHandler, ChannelAgentBridge } from './ChannelAgentBridge.js';
export type { AvailableCommand, ToolCallEvent } from './ChannelAgentBridge.js';
export interface AcpBridgeOptions {
    cliEntryPath: string;
    cwd: string;
    model?: string;
}
export declare const ACP_EVENT_LOOP_STALL_RESTART_MS: number;
export declare const ACP_PERMISSION_RESPONSE_TIMEOUT_MS: number;
/**
 * Read a command's aliases off a raw wire `available_commands_update` entry. ACP
 * carries them in `_meta` (its only extension point); a top-level `altNames` is
 * also accepted for forward-compat. Returns undefined when absent so the field
 * stays optional and entries without aliases are left byte-identical.
 */
export declare function readAvailableCommandAltNames(raw: unknown): string[] | undefined;
export declare class AcpBridge extends EventEmitter implements ChannelAgentBridge {
    private child;
    private connection;
    private options;
    private _availableCommands;
    private channelLoopMcpServer;
    private readonly channelLoopToolHandlers;
    private channelLoopMcpRegistered;
    private channelLoopMcpRegistration;
    private readonly pendingPermissions;
    constructor(options: AcpBridgeOptions);
    get availableCommands(): AvailableCommand[];
    start(): Promise<void>;
    registerChannelLoopToolHandler(handler: ChannelLoopToolHandler): void;
    newSession(cwd: string): Promise<string>;
    loadSession(sessionId: string, cwd: string): Promise<string>;
    prompt(sessionId: string, text: string, options?: {
        imageBase64?: string;
        imageMimeType?: string;
    }): Promise<string>;
    cancelSession(sessionId: string): Promise<void>;
    respondToPermission(requestId: string, response: RequestPermissionResponse): Promise<boolean>;
    stop(): void;
    get isConnected(): boolean;
    private handleSessionUpdate;
    private ensureConnection;
    private requestPermission;
    private emitResponseBoundary;
    private resolvePendingPermissions;
    private maybeKillOnEventLoopStall;
    private registerChannelLoopMcpServer;
    private handleExtMethod;
    private handleClientMcpMessage;
    private resolveChannelLoopToolHandler;
}
