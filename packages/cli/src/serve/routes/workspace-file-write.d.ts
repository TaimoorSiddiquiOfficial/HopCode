/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type { Application, Request, RequestHandler, Response } from 'express';
import type { AcpSessionBridge } from '../acp-session-bridge.js';
import type { WorkspaceRegistry } from '../workspace-registry.js';
interface RegisterDeps {
    bridge: AcpSessionBridge;
    mutate: (opts?: {
        strict?: boolean;
    }) => RequestHandler;
    parseClientId: (req: Request, res: Response) => string | undefined | null;
    safeBody: (req: Request) => Record<string, unknown>;
}
export declare function registerWorkspaceFileWriteRoutes(app: Application, deps: RegisterDeps): void;
export declare function registerWorkspaceQualifiedFileWriteRoutes(app: Application, deps: RegisterDeps & {
    workspaceRegistry: WorkspaceRegistry;
}): void;
export {};
