/**
 * WsRpcClient — WebSocket-based RPC client.
 *
 * Used in both renderer (browser WebSocket) and Node.js contexts.
 * Handles handshake, request/response correlation, event subscriptions,
 * and automatic reconnection with exponential backoff.
 *
 * Extracted to server-core so any package (subprocesses, services, bridges)
 * can act as an RPC client without depending on the Electron app layer.
 */
import type { RpcClient } from './types';
export type TransportMode = 'local' | 'remote';
export type TransportConnectionStatus = 'idle' | 'connecting' | 'connected' | 'reconnecting' | 'disconnected' | 'failed';
export type TransportConnectionErrorKind = 'auth' | 'protocol' | 'timeout' | 'network' | 'server' | 'unknown';
export interface TransportConnectionError {
    kind: TransportConnectionErrorKind;
    message: string;
    code?: string;
}
export interface TransportCloseInfo {
    code?: number;
    reason?: string;
    wasClean?: boolean;
}
export interface TransportConnectionState {
    mode: TransportMode;
    status: TransportConnectionStatus;
    url: string;
    attempt: number;
    nextRetryInMs?: number;
    lastError?: TransportConnectionError;
    lastClose?: TransportCloseInfo;
    updatedAt: number;
}
export interface WsRpcClientOptions {
    /** Workspace ID sent on handshake. */
    workspaceId?: string;
    /** Electron webContents.id, sent on handshake for local clients. */
    webContentsId?: number;
    /** Bearer token for remote auth. */
    token?: string;
    /** Request timeout in ms. Default: 30_000 */
    requestTimeout?: number;
    /** Max reconnection backoff in ms. Default: 30_000 */
    maxReconnectDelay?: number;
    /** Whether to auto-reconnect on disconnect. Default: true */
    autoReconnect?: boolean;
    /** Handshake/connect timeout in ms. Default: 10_000 */
    connectTimeout?: number;
    /** Capabilities to advertise on handshake. Handlers must be registered via handleCapability(). */
    clientCapabilities?: string[];
    /** Runtime mode — local embedded or remote thin-client connection. */
    mode?: TransportMode;
    /** Accept self-signed TLS certificates for wss:// connections. Default: false. Only works in Node.js (main process). */
    tlsRejectUnauthorized?: boolean;
}
export declare class WsRpcClient implements RpcClient {
    private ws;
    private pending;
    private listeners;
    private capabilityHandlers;
    private connectionStateListeners;
    private anyEventListeners;
    private clientId;
    private _serverVersion;
    private connected;
    private reconnectAttempt;
    private lastSeenSeq;
    private ackTimer;
    private pendingReconnect;
    private currentHandshakeWasReconnect;
    private manualReconnectRequested;
    private reconnectTimer;
    private connectTimer;
    private backoffResetTimer;
    private destroyed;
    /** Set when server sends shuttingDown — prevents reconnection attempts. */
    private permanentlyClosed;
    private connectStarted;
    private connectError;
    private readyPromise;
    private resolveReady;
    private rejectReady;
    private connectionState;
    private serverChannels;
    private readonly url;
    private readonly workspaceId;
    private readonly webContentsId;
    private readonly token;
    private readonly clientCapabilities;
    private readonly requestTimeout;
    private readonly maxReconnectDelay;
    private readonly autoReconnect;
    private readonly connectTimeout;
    private readonly mode;
    private readonly tlsRejectUnauthorized;
    constructor(url: string, opts?: WsRpcClientOptions);
    invoke(channel: string, ...args: any[]): Promise<any>;
    on(channel: string, callback: (...args: any[]) => void): () => void;
    handleCapability(channel: string, handler: (...args: any[]) => Promise<any> | any): void;
    /**
     * Check whether the server registered a handler for a given channel.
     * Returns true if the server advertised the channel in handshake_ack,
     * or if the server didn't advertise channels at all (backwards compat).
     */
    isChannelAvailable(channel: string): boolean;
    /** Server version from handshake_ack (null if server didn't send one / not yet connected). */
    getServerVersion(): string | null;
    getConnectionState(): TransportConnectionState;
    onConnectionStateChanged(callback: (state: TransportConnectionState) => void): () => void;
    /** Subscribe to all push events regardless of channel. Used by RemoteClientBridge for event forwarding. */
    onAnyEvent(callback: (channel: string, ...args: any[]) => void): () => void;
    /** Emit a synthetic __transport:reconnected event. Used by RoutedClient after workspace swap to trigger stale recovery. */
    emitReconnected(isStale: boolean): void;
    reconnectNow(): void;
    /**
     * Create a WebSocket instance. In Node.js (main process), uses the `ws` library
     * to support TLS options (e.g. rejectUnauthorized for self-signed certs).
     * In the renderer (browser), falls back to the global WebSocket.
     */
    private createWebSocket;
    connect(): void;
    destroy(): void;
    get isConnected(): boolean;
    private onMessage;
    private onServerRequest;
    private onDisconnect;
    private scheduleReconnect;
    private scheduleBackoffReset;
    /** Best-effort send that skips closing/closed sockets and swallows send races. */
    private trySendEnvelope;
    /** Periodically send sequence_ack so server can evict acknowledged events. */
    private startAckTimer;
    private createReadyPromise;
    private failReady;
    private ensureConnected;
    private inferMode;
    private setConnectionState;
    private createConnectionError;
    private toErrorState;
    private classifyErrorKindFromCode;
    private classifyErrorKindFromCloseCode;
}
