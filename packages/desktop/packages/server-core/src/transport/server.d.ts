/**
 * WsRpcServer — WebSocket-based RPC server.
 *
 * Owns ALL transport concerns: connection lifecycle, handshake, heartbeat,
 * optional auth, request dispatching, and push routing.
 *
 * Same class used locally (127.0.0.1, no auth) and remotely (0.0.0.0, auth).
 */
import { type PushTarget } from '@craft-agent/shared/protocol';
import type { RpcServer, HandlerFn } from './types';
export interface WsRpcTlsOptions {
    /** PEM-encoded certificate (or Buffer). */
    cert: string | Buffer;
    /** PEM-encoded private key (or Buffer). */
    key: string | Buffer;
    /** Optional PEM-encoded CA chain for client certificate verification. */
    ca?: string | Buffer;
    /** Optional passphrase for encrypted private keys. */
    passphrase?: string;
}
export interface WsRpcServerOptions {
    /** Host to bind to. Default: '127.0.0.1' */
    host?: string;
    /** Port to bind to. 0 = random available port. Default: 0 */
    port?: number;
    /** Whether to require a bearer token on handshake. Default: false */
    requireAuth?: boolean;
    /** Token validator. Called when requireAuth is true. */
    validateToken?: (token: string) => Promise<boolean>;
    /**
     * Optional cookie-based session validator (for web UI auth).
     * Called with the Cookie header from the HTTP upgrade request.
     * If provided, a valid session cookie is accepted as an alternative to a bearer token.
     */
    validateSessionCookie?: (cookieHeader: string | null) => Promise<boolean>;
    /** Server identity stamp on outgoing events. Default: 'local' */
    serverId?: string;
    /** TLS configuration. When provided, the server listens on wss:// instead of ws://. */
    tls?: WsRpcTlsOptions;
    /** App version string, included in handshake_ack for client compatibility checks. */
    serverVersion?: string;
    /** Maximum concurrent clients. 0 = unlimited. Default: 50 */
    maxClients?: number;
    /** Called when a client completes handshake. */
    onClientConnected?: (info: {
        clientId: string;
        webContentsId: number | null;
        workspaceId: string | null;
    }) => void;
    /** Called when a client disconnects. */
    onClientDisconnected?: (clientId: string) => void;
    /**
     * Optional HTTP request handler for non-WebSocket requests.
     * When provided, regular HTTP requests to the server's port are
     * routed here instead of being rejected. This enables serving the
     * WebUI from the same port as the WebSocket server.
     * Must use Node.js HTTP callback signature (IncomingMessage, ServerResponse).
     */
    httpHandler?: (req: import('node:http').IncomingMessage, res: import('node:http').ServerResponse) => void;
}
export declare class WsRpcServer implements RpcServer {
    private wss;
    private httpServer;
    private httpsServer;
    private clients;
    private handlers;
    private pendingInvokes;
    private heartbeatTimer;
    private _port;
    private _protocol;
    /** Recently disconnected clients retained for reconnect replay. */
    private disconnectedClients;
    private readonly host;
    private readonly requestedPort;
    private readonly requireAuth;
    private readonly validateToken;
    private readonly validateSessionCookie;
    private readonly serverId;
    private readonly tlsOptions;
    private readonly serverVersion;
    private readonly maxClients;
    private readonly onClientConnected;
    private readonly onClientDisconnected;
    private readonly httpHandler;
    constructor(opts?: WsRpcServerOptions);
    /** The actual port the server is listening on (available after listen()). */
    get port(): number;
    /** The protocol the server is using: 'wss' when TLS is configured, 'ws' otherwise. */
    get protocol(): 'ws' | 'wss';
    /** Number of currently connected (handshake-completed) clients. */
    getConnectedClientCount(): number;
    handle(channel: string, handler: HandlerFn): void;
    push(channel: string, target: PushTarget, ...args: any[]): void;
    invokeClient(clientId: string, channel: string, ...args: any[]): Promise<any>;
    listen(): Promise<void>;
    close(): void;
    private onConnection;
    /** Server-side timeout for RPC handler execution (ms). */
    private static readonly HANDLER_TIMEOUT_MS;
    private onRequest;
    private startHeartbeat;
    /** Wire up close + pong handlers for a WebSocket ↔ ClientConnection pair. */
    private setupClientHandlers;
    /** Assign a per-client seq, retain the event for replay, and optionally send it immediately. */
    private bufferAndMaybeSendEvent;
    /** Evict stale/oversized entries from a client's event buffer via batch splice. */
    private evictBuffer;
    private matchesTarget;
    /** Update a client's workspaceId (called after SWITCH_WORKSPACE so push routing stays correct). */
    updateClientWorkspace(clientId: string, workspaceId: string): void;
    private findClientByWs;
    /** Handler/request errors — sent as type:'response' with error field. */
    private sendResponseError;
    /** Protocol-level errors only (handshake rejection, version mismatch). May close connection. */
    private sendError;
    private onClientResponse;
    private rejectPendingInvokesForClient;
    private safeSend;
}
