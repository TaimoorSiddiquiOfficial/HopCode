/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type { Application, Request, Response } from 'express';
import type { DaemonWorkspaceService } from '../workspace-service/types.js';
import type { WorkspaceRegistry } from '../workspace-registry.js';
export interface WorkspaceTrustRouteDeps {
    boundWorkspace: string;
    workspace: DaemonWorkspaceService;
    mutate: (opts?: {
        strict?: boolean;
    }) => import('express').RequestHandler;
    safeBody: (req: Request) => Record<string, unknown>;
    parseAndValidateClientId: (req: Request, res: Response) => string | undefined | null;
}
export declare function registerWorkspaceTrustRoutes(app: Application, deps: WorkspaceTrustRouteDeps): void;
export declare function registerWorkspaceQualifiedTrustRoutes(app: Application, deps: Pick<WorkspaceTrustRouteDeps, 'mutate' | 'safeBody'> & {
    workspaceRegistry: WorkspaceRegistry;
}): void;
