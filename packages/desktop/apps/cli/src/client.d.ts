/**
 * CliRpcClient — Minimal WebSocket RPC client for CLI usage.
 *
 * Stripped-down version of WsRpcClient: no auto-reconnect, no capabilities,
 * no connection state listeners. Connect, work, exit.
 */
export interface CliClientOptions {
    token?: string;
    workspaceId?: string;
    requestTimeout?: number;
    connectTimeout?: number;
}
export declare class CliRpcClient {
    private ws;
    private pending;
    private listeners;
    private _clientId;
    private _connected;
    private _destroyed;
    private readonly url;
    private readonly token;
    private readonly workspaceId;
    private readonly requestTimeout;
    private readonly connectTimeout;
    constructor(url: string, opts?: CliClientOptions);
    /** Connect to the server and complete the handshake. Returns the assigned clientId. */
    connect(): Promise<string>;
    /** Send an RPC request and await the response. */
    invoke(channel: string, ...args: unknown[]): Promise<unknown>;
    /** Subscribe to push events on a channel. Returns an unsubscribe function. */
    on(channel: string, callback: (...args: unknown[]) => void): () => void;
    /** Close the connection and reject all pending requests. */
    destroy(): void;
    get isConnected(): boolean;
    get clientId(): string | null;
    private onMessage;
}
