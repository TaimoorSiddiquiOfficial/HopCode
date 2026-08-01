/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type { Application, Request, Response } from 'express';
import { SettingScope } from '../../config/settings.js';
import type { WorkspaceRegistry } from '../workspace-registry.js';
export interface WorkspaceSettingsRouteDeps {
    boundWorkspace: string;
    mutate: (opts?: {
        strict?: boolean;
    }) => import('express').RequestHandler;
    safeBody: (req: Request) => Record<string, unknown>;
    persistSetting: (workspace: string, scope: SettingScope, key: string, value: unknown) => Promise<void>;
    broadcastSettingsChanged: (key: string, value: unknown, scope: string, clientId: string | undefined) => void;
    parseAndValidateClientId: (req: Request, res: Response) => string | undefined | null;
}
export declare function registerWorkspaceSettingsRoutes(app: Application, deps: WorkspaceSettingsRouteDeps): void;
export declare function registerWorkspaceQualifiedSettingsRoutes(app: Application, deps: Pick<WorkspaceSettingsRouteDeps, 'mutate' | 'safeBody' | 'persistSetting'> & {
    workspaceRegistry: WorkspaceRegistry;
    invalidateServeFeaturesCache: () => void;
}): void;
