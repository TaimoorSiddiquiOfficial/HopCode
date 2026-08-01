/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type { DaemonWorkspaceService, DaemonWorkspaceServiceDeps } from './types.js';
export type { DaemonWorkspaceService, DaemonWorkspaceServiceDeps, WorkspaceRequestContext, RestartMcpServerResult, WorkspaceTrustChangeRequest, WorkspaceTrustChangeResult, WorkspaceTrustDesiredState, WorkspacePermissionRulesUpdate, WorkspaceVoiceSettingsUpdate, WorkspaceAcpPreheatResult, WorkspaceAcpStatusResult, WorkspaceSkillToggleResult, WorkspaceSkillToggleActivation, EnvReloadResult, ReloadResponse, } from './types.js';
export { WorkspacePermissionRulesSessionRequiredError, WorkspaceSkillNotFoundError, WorkspaceSkillNotToggleableError, } from './types.js';
export declare function createDaemonWorkspaceService(deps: DaemonWorkspaceServiceDeps): DaemonWorkspaceService;
