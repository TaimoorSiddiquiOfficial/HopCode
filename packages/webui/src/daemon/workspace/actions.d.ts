/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type { DaemonClient } from '@hoptrendy/sdk/daemon';
import type { DaemonWorkspaceActions } from './types.js';
export interface CreateDaemonWorkspaceActionsArgs {
    getClient: () => DaemonClient | undefined;
    getWorkspaceCwd: () => string | undefined;
    baseUrl: string;
    token?: string;
}
export declare function createDaemonWorkspaceActions({ getClient, getWorkspaceCwd, baseUrl, token, }: CreateDaemonWorkspaceActionsArgs): DaemonWorkspaceActions;
