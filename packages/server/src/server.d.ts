/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type { Config } from '@hoptrendy/hopcode-core';
import { HopCodeSessionManager } from './session-manager.js';
export interface ServerOptions {
    port?: number;
    host?: string;
    /** Root directory for sandboxed sessions (defaults to process.cwd()). */
    cwd?: string;
    /** Default model when client does not specify one. */
    defaultModel?: string;
    /**
     * When provided, sessions are run **in-process** using AgentInteractive
     * directly (no subprocess spawn).  The Config carries auth credentials,
     * tool permissions, and model settings from the hosting CLI process.
     *
     * When omitted, sessions are backed by a subprocess `hopcode …` invocation.
     */
    runtimeConfig?: Config;
}
/**
 * HopCode gRPC headless server.
 *
 * Exposes the core agent loop over a bidirectional gRPC stream,
 * enabling remote IDE integrations, microservices, and headless
 * agent workers.
 *
 * When `runtimeConfig` is provided in ServerOptions, sessions use
 * AgentInteractive directly in-process (no subprocess spawning).
 * Otherwise, each session spawns a `hopcode` child process.
 *
 * Usage:
 *   const server = new HopCodeServer({ port: 50051, runtimeConfig });
 *   await server.start();
 *   // ...
 *   await server.stop();
 */
export declare class HopCodeServer {
    private server;
    private sessionManager;
    private port;
    private host;
    constructor(options?: ServerOptions);
    private registerServices;
    /**
     * Start listening. Returns the bound port (useful when port=0).
     */
    start(): Promise<number>;
    stop(): Promise<void>;
    private handleStreamSession;
    private handleCreateSession;
    private handleListSessions;
    private handleGetSessionHistory;
    private handleCancelSession;
    private handleExecuteTool;
    private toGrpcError;
}
export { HopCodeSessionManager };
