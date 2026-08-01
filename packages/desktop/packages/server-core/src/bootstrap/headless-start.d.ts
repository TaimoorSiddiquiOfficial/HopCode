import { OAuthFlowStore } from '@craft-agent/shared/auth';
import { WsRpcServer, type WsRpcTlsOptions } from '../transport/server';
import type { EventSink, RpcServer } from '../transport/types';
import type { PlatformServices } from '../runtime/platform';
interface ModelRefreshServiceLike {
    startAll(): void;
    stopAll?(): void;
}
export interface ServerBootstrapOptions<TSessionManager, THandlerDeps> {
    serverToken?: string;
    rpcHost?: string;
    rpcPort?: number;
    bundledAssetsRoot?: string;
    platformFactory?: () => PlatformServices;
    applyPlatformToSubsystems?: (platform: PlatformServices) => void;
    createSessionManager: () => TSessionManager;
    createHandlerDeps: (ctx: {
        sessionManager: TSessionManager;
        platform: PlatformServices;
        oauthFlowStore: OAuthFlowStore;
    }) => THandlerDeps;
    registerAllRpcHandlers: (server: RpcServer, deps: THandlerDeps, serverCtx: ServerHandlerContext) => void;
    initializeSessionManager: (sessionManager: TSessionManager) => Promise<void>;
    setSessionEventSink: (sessionManager: TSessionManager, sink: EventSink) => void;
    initModelRefreshService: () => ModelRefreshServiceLike;
    cleanupSessionManager?: (sessionManager: TSessionManager) => Promise<void> | void;
    cleanupClientResources?: (clientId: string) => void;
    onClientConnected?: (info: {
        clientId: string;
        webContentsId: number | null;
        workspaceId: string | null;
    }) => void;
    serverId?: string;
    /** App version string, included in handshake_ack for client compatibility checks. */
    serverVersion?: string;
    /** TLS configuration. When provided, the server listens on wss:// instead of ws://. */
    tls?: WsRpcTlsOptions;
    /** Cookie-based session validator for web UI auth on WebSocket upgrade. */
    validateSessionCookie?: (cookieHeader: string | null) => Promise<boolean>;
    /**
     * Optional HTTP request handler for non-WebSocket requests on the RPC port.
     * When provided, the WsRpcServer serves HTTP (e.g. WebUI) on the same port.
     */
    httpHandler?: (req: import('node:http').IncomingMessage, res: import('node:http').ServerResponse) => void;
}
export interface ServerHandlerContext {
    getConnectedClientCount: () => number;
    serverId: string;
    startedAt: number;
}
export interface ServerInstance<TSessionManager> {
    platform: PlatformServices;
    sessionManager: TSessionManager;
    wsServer: WsRpcServer;
    oauthFlowStore: OAuthFlowStore;
    host: string;
    port: number;
    protocol: 'ws' | 'wss';
    token: string;
    /** Context for server-level RPC handlers (status, health, active sessions). */
    serverHandlerContext: ServerHandlerContext;
    stop: () => Promise<void>;
}
/**
 * Generate a cryptographically random token suitable for server auth.
 * Returns a 48-character hex string (192 bits of entropy).
 */
export declare function generateServerToken(): string;
export declare function parseServerPort(name: string, value: string | number | undefined, defaultPort: number): number;
/**
 * Remove the lock file if it belongs to the current process.
 * Exported so consumers (e.g. the Electron before-quit handler) can call it
 * directly without going through `instance.stop()`.
 */
export declare function releaseServerLock(): void;
export declare function bootstrapServer<TSessionManager, THandlerDeps>(options: ServerBootstrapOptions<TSessionManager, THandlerDeps>): Promise<ServerInstance<TSessionManager>>;
export interface HealthHttpServerOptions {
    port: number;
    deps: {
        sessionManager: {
            getWorkspaces(): unknown[];
        };
    };
    wsServer: WsRpcServer;
    platform: PlatformServices;
}
/**
 * Start a minimal HTTP server for health/status probes.
 * Only starts if port > 0. Returns a cleanup function.
 */
export declare function startHealthHttpServer(options: HealthHttpServerOptions): Promise<{
    stop: () => void;
} | null>;
export {};
