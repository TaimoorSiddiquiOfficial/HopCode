/**
 * RoutedClient — client-side channel router.
 *
 * Wraps two WsRpcClient instances: localClient (always the embedded Electron
 * server) and workspaceClient (whichever server owns the active workspace).
 *
 * - LOCAL_ONLY channels always route to localClient
 * - Everything else routes to workspaceClient
 * - On workspace switch, workspaceClient is swapped and REMOTE_ELIGIBLE
 *   listeners are re-subscribed transparently (make-before-break)
 */
import type { WsRpcClient, TransportConnectionState } from './client';
import type { RpcClient } from '@craft-agent/server-core/transport';
import type { RemoteServerConfig } from '@craft-agent/core/types';
/** Returned by the enhanced SWITCH_WORKSPACE handler. */
export interface WorkspaceSwitchResult {
    workspaceId: string;
    remoteServer?: RemoteServerConfig | null;
}
/** Factory to create a new WsRpcClient for a remote workspace. */
export type WorkspaceClientFactory = (remoteServer: RemoteServerConfig) => WsRpcClient;
export declare class RoutedClient implements RpcClient {
    private readonly localClient;
    private workspaceClient;
    /** REMOTE_ELIGIBLE listener registry — survives workspace switches. */
    private remoteListeners;
    /** Capability handlers — re-registered on workspace switch. */
    private capabilities;
    /** Connection state listeners (delegates to workspaceClient). */
    private connectionStateListeners;
    private connectionStateUnsub;
    /** Factory for creating remote workspace clients on switch. */
    private clientFactory;
    /**
     * Workspace ID mapping — translates local workspace IDs to remote ones.
     * When set, REMOTE_ELIGIBLE invoke() calls replace the local ID in
     * arguments with the remote ID so the server can resolve the workspace.
     */
    private workspaceIdMapping;
    constructor(localClient: WsRpcClient, initialWorkspaceClient: WsRpcClient);
    /** Set factory for creating remote workspace clients. */
    setClientFactory(factory: WorkspaceClientFactory): void;
    /**
     * Set workspace ID mapping for remote workspaces.
     * When a remote workspace is active, RPC calls pass the local workspace ID
     * as arguments, but the remote server only knows its own workspace IDs.
     * This mapping translates local → remote in invoke() arguments.
     */
    setWorkspaceMapping(localId: string, remoteId: string): void;
    /** Clear workspace ID mapping (when switching to a local workspace). */
    clearWorkspaceMapping(): void;
    invoke(channel: string, ...args: any[]): Promise<any>;
    on(channel: string, callback: (...args: any[]) => void): () => void;
    handleCapability(channel: string, handler: (...args: any[]) => Promise<any> | any): void;
    isChannelAvailable(channel: string): boolean;
    getConnectionState(): TransportConnectionState;
    onConnectionStateChanged(callback: (state: TransportConnectionState) => void): () => void;
    reconnectNow(): void;
    private handleWorkspaceSwitch;
    private swapWorkspaceClient;
    private bindConnectionState;
}
