/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
export interface SessionManagerOptions {
    cwd?: string;
    defaultModel?: string;
    /** Path to the hopcode CLI executable. Defaults to "hopcode" in PATH. */
    cliPath?: string;
}
/**
 * Manages active agent sessions for the gRPC server.
 *
 * Each session spawns a `hopcode --input-format stream-json
 * --output-format stream-json` child process.  JSONL events from
 * the CLI's stdout are translated into gRPC ServerMessages, and
 * gRPC ClientMessages are serialized into JSONL lines written to
 * the CLI's stdin.
 */
export declare class HopCodeSessionManager {
    private sessions;
    private options;
    constructor(options?: SessionManagerOptions);
    createSession(request: Record<string, any>): Promise<Record<string, any>>;
    createStreamingSession(request: Record<string, any>, write: (msg: Record<string, unknown>) => void): Promise<string>;
    handleClientMessage(sessionId: string, clientMessage: Record<string, any>): Promise<void>;
    private spawnAgent;
    private writeToAgent;
    private translateAndEmit;
    private handleUserPrompt;
    private handleToolApproval;
    private handleToolDenial;
    private handleCancelRound;
    private handleShutdown;
    listSessions(): Array<Record<string, any>>;
    getHistory(sessionId: string): Promise<Record<string, any>>;
    closeSession(sessionId: string): Promise<void>;
    executeTool(request: Record<string, any>): Promise<Record<string, any>>;
}
