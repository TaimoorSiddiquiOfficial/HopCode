/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type { Application, RequestHandler } from 'express';
import type { AcpSessionBridge } from '../acp-session-bridge.js';
import type { SendBridgeError } from '../server/error-response.js';
import type { safeBody as safeBodyType } from '../server/request-helpers.js';
import type { WorkspaceRegistry } from '../workspace-registry.js';
import type { DaemonWorkspaceService } from '../workspace-service/index.js';
type SafeBody = typeof safeBodyType;
interface RegisterWorkspaceExtensionRoutesDeps {
    boundWorkspace: string;
    bridge: AcpSessionBridge;
    workspace: DaemonWorkspaceService;
    mutate: (opts?: {
        strict?: boolean;
    }) => RequestHandler;
    safeBody: SafeBody;
    sendBridgeError: SendBridgeError;
    maxExtensionOperationHistory?: number;
    workspaceRegistry?: WorkspaceRegistry;
}
export declare function registerWorkspaceExtensionRoutes(app: Application, deps: RegisterWorkspaceExtensionRoutesDeps): void;
export {};
