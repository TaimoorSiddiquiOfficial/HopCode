/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type { ServeWorkspaceSkillsStatus } from '@hoptrendy/acp-bridge/status';
export interface WorkspaceSkillsStatusProvider {
    (workspaceCwd: string): Promise<ServeWorkspaceSkillsStatus>;
    invalidate?(workspaceCwd: string): void;
}
export declare function createWorkspaceSkillsStatusProvider(): WorkspaceSkillsStatusProvider;
