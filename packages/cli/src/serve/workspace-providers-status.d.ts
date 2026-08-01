/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type { ServeWorkspaceProvidersStatus } from '@hoptrendy/acp-bridge/status';
import type { CliGenerationConfigInputs } from '../utils/modelConfigUtils.js';
export type WorkspaceProvidersStatusProvider = (workspaceCwd: string, acpChannelLive: boolean) => Promise<ServeWorkspaceProvidersStatus>;
export interface WorkspaceProvidersStatusProviderOptions {
    argv?: Partial<CliGenerationConfigInputs['argv']>;
    env?: Record<string, string | undefined>;
}
export declare function createWorkspaceProvidersStatusProvider(options?: WorkspaceProvidersStatusProviderOptions): WorkspaceProvidersStatusProvider;
