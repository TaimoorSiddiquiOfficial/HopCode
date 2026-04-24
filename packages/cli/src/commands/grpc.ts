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
 */

/* eslint-disable no-console -- CLI server command, console output is intentional */

// By default the server runs **in-process**: AgentInteractive is instantiated
// directly in the server process, sharing the fully-initialized Config (auth,
// tools, model config). Use --subprocess for isolated per-session processes.
//
// Usage:
//   hopcode grpc [--port 50051] [--host 0.0.0.0] [--subprocess]
//
// Proto file:
//   packages/server/proto/hopcode.proto

import type { CommandModule, Argv } from 'yargs';
import { loadCliConfig, parseArguments } from '../config/config.js';
import { loadSettings } from '../config/settings.js';
import type { Config } from '@hoptrendy/hopcode-core';

interface GrpcArgs {
  port: number;
  host: string;
  subprocess: boolean;
}

async function buildConfig(): Promise<Config | undefined> {
  try {
    const argv = await parseArguments();
    const settings = loadSettings();
    return await loadCliConfig(settings.merged, argv, process.cwd());
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn(
      `[grpc] Could not build in-process config (${msg}); falling back to subprocess mode.`,
    );
    return undefined;
  }
}

async function startGrpcServer(
  port: number,
  host: string,
  useSubprocess: boolean,
): Promise<void> {
  try {
    // Build runtime config for in-process mode unless --subprocess is set
    const runtimeConfig = useSubprocess ? undefined : await buildConfig();

    // Dynamic import so the server package is only loaded when this command runs.
    const serverModule = (await import('@hoptrendy/hopcode-server')) as {
      HopCodeServer: new (opts: {
        port: number;
        host: string;
        runtimeConfig?: Config;
      }) => {
        start(): Promise<number>;
        stop(): Promise<void>;
      };
    };

    const server = new serverModule.HopCodeServer({
      port,
      host,
      runtimeConfig,
    });
    const boundPort = await server.start();

    const mode = runtimeConfig ? 'in-process' : 'subprocess';
    console.log(
      `🐇  HopCode gRPC server running on ${host}:${boundPort} [${mode} mode]`,
    );
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
      })
      .option('subprocess', {
        type: 'boolean',
        default: false,
        description:
          'Use subprocess-per-session mode instead of in-process AgentInteractive (for isolation)',
      });
  },
  async handler(args) {
    await startGrpcServer(args.port, args.host, args.subprocess);
  },
};
