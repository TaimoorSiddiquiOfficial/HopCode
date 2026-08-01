/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { type Config } from '@hoptrendy/hopcode-core';
/** Write function passed by server.ts for streaming gRPC responses. */
type WriteCallback = (msg: Record<string, unknown>) => void;
export interface InProcessSessionManagerOptions {
    /** The fully-initialized HopCode runtime config (from CLI). */
    runtimeConfig: Config;
    /** Root cwd when client does not specify one. */
    cwd?: string;
    /** Default model when client does not specify one. */
    defaultModel?: string;
}
/**
 * In-process gRPC session manager.
 *
 * Each session wraps an AgentInteractive instance whose AgentEventEmitter
 * events are translated into gRPC ServerMessage proto objects and streamed
 * to the client.
 */
export declare class InProcessSessionManager {
    private readonly sessions;
    private readonly options;
    constructor(options: InProcessSessionManagerOptions);
    createSession(request: Record<string, any>): Promise<Record<string, any>>;
    createStreamingSession(request: Record<string, any>, write: WriteCallback): Promise<string>;
    handleClientMessage(sessionId: string, clientMessage: Record<string, any>): Promise<void>;
    listSessions(): Array<Record<string, any>>;
    getHistory(sessionId: string): Promise<Record<string, any>>;
    closeSession(sessionId: string): Promise<void>;
    executeTool(request: Record<string, any>): Promise<Record<string, any>>;
    private wireEvents;
    private handleToolApproval;
    private handleToolDenial;
}
export {};
