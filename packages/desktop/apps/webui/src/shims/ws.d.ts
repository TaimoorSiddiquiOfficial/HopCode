/**
 * ws shim — browser uses native WebSocket.
 *
 * The WsRpcServer imports WebSocketServer from 'ws' but is never
 * instantiated in the browser. This shim satisfies the bundler.
 */
export declare class WebSocketServer {
    constructor(_opts?: any);
    on(_event: string, _fn: Function): this;
    close(): void;
    address(): null;
}
export declare const WebSocket: {
    new (url: string | URL, protocols?: string | string[]): WebSocket;
    prototype: WebSocket;
    readonly CONNECTING: 0;
    readonly OPEN: 1;
    readonly CLOSING: 2;
    readonly CLOSED: 3;
};
export type { WebSocket as default };
