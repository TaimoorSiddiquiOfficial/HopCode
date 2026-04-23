/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 *
 * `hopcode grpc` — starts HopCode as a headless gRPC server.
 *
 * Provides bidirectional streaming agent sessions over gRPC,
 * enabling remote IDE integrations, microservices, and
 * language-agnostic clients.
 *
 * Usage:
 *   hopcode grpc [--port 50051] [--host 0.0.0.0]
 *
 * Proto file:
 *   packages/server/proto/hopcode.proto
 */

import type { CommandModule, Argv } from 'yargs';

interface GrpcArgs {
  port: number;
  host: string;
}

async function startGrpcServer(port: number, host: string): Promise<void> {
  try {
    // Dynamic import so the server package is only loaded when this command runs.
    // @ts-expect-error — package may not be built yet in dev; resolved at runtime.
    const serverModule = (await import('@hoptrendy/hopcode-server')) as {
      HopCodeServer: new (opts: { port: number; host: string }) => {
        start(): Promise<number>;
        stop(): Promise<void>;
      };
    };
    const server = new serverModule.HopCodeServer({ port, host });
    const boundPort = await server.start();

    console.log(`🐇  HopCode gRPC server running on ${host}:${boundPort}`);
    console.log(`    Proto: packages/server/proto/hopcode.proto`);

    const shutdown = async () => {
      console.log('\n[grpc] Shutting down server...');
      await server.stop();
      process.exit(0);
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`❌  Failed to start gRPC server: ${message}`);
    process.exit(1);
  }
}

export const grpcCommand: CommandModule<unknown, GrpcArgs> = {
  command: 'grpc',
  describe: 'Start the HopCode gRPC headless server',
  builder(yargs: Argv) {
    return yargs
      .option('port', {
        type: 'number',
        default: 50051,
        description: 'Port to listen on',
      })
      .option('host', {
        type: 'string',
        default: '0.0.0.0',
        description: 'Host to bind to',
      });
  },
  async handler(args) {
    await startGrpcServer(args.port, args.host);
  },
};
