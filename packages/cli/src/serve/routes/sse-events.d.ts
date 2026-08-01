/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type { Application } from 'express';
import type { AcpSessionBridge } from '../acp-session-bridge.js';
import type { DaemonLogger } from '../daemon-logger.js';
import { type SendBridgeError } from '../server/error-response.js';
import type { WorkspaceRegistry } from '../workspace-registry.js';
export declare function getActiveSseCount(): number;
interface RegisterSseEventsRoutesDeps {
    bridge: AcpSessionBridge;
    workspaceRegistry: WorkspaceRegistry;
    daemonLog?: DaemonLogger;
    writerIdleTimeoutMs?: number;
    sendBridgeError: SendBridgeError;
}
export declare function registerSseEventsRoutes(app: Application, deps: RegisterSseEventsRoutesDeps): void;
export {};
