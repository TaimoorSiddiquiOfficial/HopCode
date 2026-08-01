/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import * as cp from 'node:child_process';
import * as net from 'node:net';
import type { JsonRpcMessage, LspProcessDiagnostics } from './types.js';
declare class JsonRpcConnection {
    private readonly writer;
    private readonly disposer?;
    private buffer;
    private nextId;
    private disposed;
    private pendingRequests;
    private notificationHandlers;
    private requestHandlers;
    constructor(writer: (data: string) => void, disposer?: (() => void) | undefined);
    listen(readable: NodeJS.ReadableStream): void;
    send(message: JsonRpcMessage): void;
    onNotification(handler: (notification: JsonRpcMessage) => void): void;
    onRequest(handler: (request: JsonRpcMessage) => Promise<unknown>): void;
    initialize(params: unknown): Promise<unknown>;
    shutdown(): Promise<void>;
    request(method: string, params: unknown): Promise<unknown>;
    end(): void;
    private sendRequest;
    private handleServerRequest;
    private handleData;
    private routeMessage;
    private writeMessage;
    private disposePending;
}
interface LspConnection {
    connection: JsonRpcConnection;
    process?: cp.ChildProcess;
    processDiagnostics?: LspProcessDiagnostics;
    socket?: net.Socket;
}
interface SocketConnectionOptions {
    host?: string;
    port?: number;
    path?: string;
}
export declare class LspConnectionFactory {
    /**
     * ???? stdio ? LSP ??
     */
    static createStdioConnection(command: string, args: string[], options?: cp.SpawnOptions, timeoutMs?: number): Promise<LspConnection>;
    /**
     * ???? TCP ? LSP ??
     */
    static createTcpConnection(host: string, port: number, timeoutMs?: number): Promise<LspConnection>;
    /**
     * ???? socket ? LSP ??(?? TCP ? unix socket)
     */
    static createSocketConnection(options: SocketConnectionOptions, timeoutMs?: number): Promise<LspConnection>;
    /**
     * ?? LSP ??
     */
    static closeConnection(lspConnection: LspConnection): Promise<void>;
}
export {};
