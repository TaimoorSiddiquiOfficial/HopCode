/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */

import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { HopCodeSessionManager } from './session-manager.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROTO_PATH = join(__dirname, '..', 'proto', 'hopcode.proto');

export interface ServerOptions {
  port?: number;
  host?: string;
  /** Root directory for sandboxed sessions (defaults to process.cwd()). */
  cwd?: string;
  /** Default model when client does not specify one. */
  defaultModel?: string;
}

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const hopcodeProto = grpc.loadPackageDefinition(packageDefinition) as any;

/**
 * HopCode gRPC headless server.
 *
 * Exposes the core agent loop over a bidirectional gRPC stream,
 * enabling remote IDE integrations, microservices, and headless
 * agent workers.
 *
 * Usage:
 *   const server = new HopCodeServer({ port: 50051 });
 *   await server.start();
 *   // ...
 *   await server.stop();
 */
export class HopCodeServer {
  private server: grpc.Server;
  private sessionManager: HopCodeSessionManager;
  private port: number;
  private host: string;

  constructor(options: ServerOptions = {}) {
    this.port = options.port ?? 50051;
    this.host = options.host ?? '0.0.0.0';
    this.server = new grpc.Server();
    this.sessionManager = new HopCodeSessionManager({
      cwd: options.cwd,
      defaultModel: options.defaultModel,
    });

    this.registerServices();
  }

  private registerServices(): void {
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
  start(): Promise<number> {
    return new Promise((resolve, reject) => {
      this.server.bindAsync(
        `${this.host}:${this.port}`,
        grpc.ServerCredentials.createInsecure(),
        (err, port) => {
          if (err) {
            reject(err);
            return;
          }
          this.server.start();
          console.log(`[HopCodeServer] listening on ${this.host}:${port}`);
          resolve(port);
        },
      );
    });
  }

  stop(): Promise<void> {
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

  private handleStreamSession(
    call: grpc.ServerDuplexStream<any, any>,
  ): void {
    let sessionId: string | undefined;

    call.on('data', async (clientMessage: any) => {
      try {
        if (!sessionId) {
          // First message must establish the session
          const payload = clientMessage.payload;
          if (!payload || !payload.userPrompt) {
            call.write({
              error: {
                type: 'INVALID_FIRST_MESSAGE',
                message:
                  'First ClientMessage must contain a user_prompt to initialise the session.',
              },
            });
            call.end();
            return;
          }

          sessionId = await this.sessionManager.createStreamingSession(
            clientMessage,
            (serverMessage) => call.write(serverMessage),
          );
          return;
        }

        await this.sessionManager.handleClientMessage(sessionId, clientMessage);
      } catch (err) {
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

  private async handleCreateSession(
    call: grpc.ServerUnaryCall<any, any>,
    callback: grpc.sendUnaryData<any>,
  ): Promise<void> {
    try {
      const sessionInfo = await this.sessionManager.createSession(call.request);
      callback(null, sessionInfo);
    } catch (err) {
      callback(this.toGrpcError(err));
    }
  }

  private handleListSessions(
    _call: grpc.ServerUnaryCall<any, any>,
    callback: grpc.sendUnaryData<any>,
  ): void {
    try {
      const sessions = this.sessionManager.listSessions();
      callback(null, { sessions });
    } catch (err) {
      callback(this.toGrpcError(err));
    }
  }

  private async handleGetSessionHistory(
    call: grpc.ServerUnaryCall<any, any>,
    callback: grpc.sendUnaryData<any>,
  ): Promise<void> {
    try {
      const history = await this.sessionManager.getHistory(call.request.sessionId);
      callback(null, history);
    } catch (err) {
      callback(this.toGrpcError(err));
    }
  }

  private async handleCancelSession(
    call: grpc.ServerUnaryCall<any, any>,
    callback: grpc.sendUnaryData<any>,
  ): Promise<void> {
    try {
      await this.sessionManager.closeSession(call.request.sessionId);
      callback(null, {});
    } catch (err) {
      callback(this.toGrpcError(err));
    }
  }

  private async handleExecuteTool(
    call: grpc.ServerUnaryCall<any, any>,
    callback: grpc.sendUnaryData<any>,
  ): Promise<void> {
    try {
      const result = await this.sessionManager.executeTool(call.request);
      callback(null, result);
    } catch (err) {
      callback(this.toGrpcError(err));
    }
  }

  private toGrpcError(err: unknown): grpc.ServiceError {
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
