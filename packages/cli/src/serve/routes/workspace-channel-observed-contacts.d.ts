/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type { Application } from 'express';
import type { WorkspaceRegistry } from '../workspace-registry.js';
interface RegisterWorkspaceChannelObservedContactRoutesDeps {
    primaryWorkspace: string;
    workspaceRegistry: WorkspaceRegistry;
}
export declare function registerWorkspaceChannelObservedContactRoutes(app: Application, deps: RegisterWorkspaceChannelObservedContactRoutesDeps): void;
export {};
