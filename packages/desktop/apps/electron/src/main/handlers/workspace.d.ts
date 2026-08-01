import type { RpcServer } from '@craft-agent/server-core/transport';
import type { HandlerDeps } from './handler-deps';
export declare const GUI_HANDLED_CHANNELS: readonly [any, any, any, any, any, any, any];
/**
 * Connect to a remote server and wait for handshake.
 * When workspaceId is provided, the handshake is scoped to that workspace so
 * workspace-context RPC handlers (for example sessions:export) can resolve it.
 * Returns the connected client or null + error message.
 */
export declare function connectToRemote(url: string, token: string, workspaceId?: string): Promise<{
    client: null;
    error: any;
} | {
    client: any;
    error: null;
}>;
export declare function registerWorkspaceGuiHandlers(server: RpcServer, deps: HandlerDeps): void;
