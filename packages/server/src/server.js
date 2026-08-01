/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
/* eslint-disable no-console -- server lifecycle logging */
/* eslint-disable @typescript-eslint/no-explicit-any -- gRPC proto-typed messages */
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { HopCodeSessionManager } from './session-manager.js';
import { InProcessSessionManager } from './in-process-session-manager.js';
const __dirname = dirname(fileURLToPath(import.meta.url));
const PROTO_PATH = join(__dirname, '..', 'proto', 'hopcode.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});
const hopcodeProto = grpc.loadPackageDefinition(packageDefinition);
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
export class HopCodeServer {
    server;
    sessionManager;
    port;
    host;
    constructor(options = {}) {
        this.port = options.port ?? 50051;
        this.host = options.host ?? '0.0.0.0';
        this.server = new grpc.Server();
        // Use in-process manager when a runtimeConfig is supplied (preferred),
        // otherwise fall back to the subprocess-based manager.
        if (options.runtimeConfig) {
            this.sessionManager = new InProcessSessionManager({
                runtimeConfig: options.runtimeConfig,
                cwd: options.cwd,
                defaultModel: options.defaultModel,
            });
        }
        else {
            this.sessionManager = new HopCodeSessionManager({
                cwd: options.cwd,
                defaultModel: options.defaultModel,
            });
        }
        this.registerServices();
    }
    registerServices() {
        const service = hopcodeProto.hopcode.HopCodeAgent.service;
        this.server.addService(service, {
            streamSession: this.handleStreamSession.bind(this),
            createSession: this.handleCreateSession.bind(this),
            listSessions: this.handleListSessions.bind(this),
            getSessionHistory: this.handleGetSessionHistory.bind(this),
            cancelSession: this.handleCancelSession.bind(this),
            executeTool: this.handleExecuteTool.bind(this),
        });
    }
    /**
     * Start listening. Returns the bound port (useful when port=0).
     */
    start() {
        return new Promise((resolve, reject) => {
            this.server.bindAsync(`${this.host}:${this.port}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
                if (err) {
                    reject(err);
                    return;
                }
                this.server.start();
                console.log(`[HopCodeServer] listening on ${this.host}:${port}`);
                resolve(port);
            });
        });
    }
    stop() {
        return new Promise((resolve) => {
            this.server.tryShutdown(() => {
                console.log('[HopCodeServer] shut down');
                resolve();
            });
        });
    }
    // ---------------------------------------------------------------------------
    // RPC Handlers
    // ---------------------------------------------------------------------------
    handleStreamSession(call) {
        let sessionId;
        call.on('data', async (clientMessage) => {
            try {
                if (!sessionId) {
                    // First message must establish the session.
                    // The in-process manager accepts user_prompt (snake_case); the
                    // subprocess manager accepts userPrompt (camelCase). Normalize here.
                    const payload = clientMessage.payload ?? clientMessage;
                    const hasPrompt = payload?.user_prompt || payload?.userPrompt;
                    if (!hasPrompt) {
                        call.write({
                            error: {
                                type: 'INVALID_FIRST_MESSAGE',
                                message: 'First ClientMessage must contain a user_prompt to initialise the session.',
                            },
                        });
                        call.end();
                        return;
                    }
                    sessionId = await this.sessionManager.createStreamingSession(clientMessage, (serverMessage) => call.write(serverMessage));
                    return;
                }
                await this.sessionManager.handleClientMessage(sessionId, clientMessage);
            }
            catch (err) {
                const message = err instanceof Error ? err.message : String(err);
                call.write({
                    error: {
                        type: 'STREAM_ERROR',
                        message,
                    },
                });
            }
        });
        call.on('end', () => {
            if (sessionId) {
                this.sessionManager.closeSession(sessionId);
            }
            call.end();
        });
        call.on('error', (err) => {
            console.error('[HopCodeServer] stream error:', err);
            if (sessionId) {
                this.sessionManager.closeSession(sessionId);
            }
        });
    }
    async handleCreateSession(call, callback) {
        try {
            const sessionInfo = await this.sessionManager.createSession(call.request);
            callback(null, sessionInfo);
        }
        catch (err) {
            callback(this.toGrpcError(err));
        }
    }
    handleListSessions(_call, callback) {
        try {
            const sessions = this.sessionManager.listSessions();
            callback(null, { sessions });
        }
        catch (err) {
            callback(this.toGrpcError(err));
        }
    }
    async handleGetSessionHistory(call, callback) {
        try {
            const history = await this.sessionManager.getHistory(call.request.session_id ?? call.request.sessionId);
            callback(null, history);
        }
        catch (err) {
            callback(this.toGrpcError(err));
        }
    }
    async handleCancelSession(call, callback) {
        try {
            await this.sessionManager.closeSession(call.request.session_id ?? call.request.sessionId);
            callback(null, {});
        }
        catch (err) {
            callback(this.toGrpcError(err));
        }
    }
    async handleExecuteTool(call, callback) {
        try {
            const result = await this.sessionManager.executeTool(call.request);
            callback(null, result);
        }
        catch (err) {
            callback(this.toGrpcError(err));
        }
    }
    toGrpcError(err) {
        const message = err instanceof Error ? err.message : String(err);
        return {
            code: grpc.status.INTERNAL,
            message,
            name: 'ServiceError',
            details: message,
            metadata: new grpc.Metadata(),
        };
    }
}
export { HopCodeSessionManager };
//# sourceMappingURL=server.js.map