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
import type { CommandModule } from 'yargs';
interface GrpcArgs {
    port: number;
    host: string;
    subprocess: boolean;
}
export declare const grpcCommand: CommandModule<unknown, GrpcArgs>;
export {};
