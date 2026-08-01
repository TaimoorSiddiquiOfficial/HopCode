/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type { DaemonResourceOptions } from '../types.js';
export declare function useDaemonSkills(options?: DaemonResourceOptions): {
    status: import("@hoptrendy/sdk/daemon").DaemonWorkspaceSkillsStatus | undefined;
    skills: import("@hoptrendy/sdk/daemon").DaemonWorkspaceSkillStatus[];
    setEnabled: (skillName: string, enabled: boolean) => Promise<import("@hoptrendy/sdk/daemon").DaemonSkillToggleResult>;
    install: (request: import("@hoptrendy/sdk/daemon").DaemonSkillInstallRequest) => Promise<import("@hoptrendy/sdk/daemon").DaemonSkillMutationResult>;
    remove: (skillName: string, scope: import("@hoptrendy/sdk/daemon").DaemonSkillScope) => Promise<import("@hoptrendy/sdk/daemon").DaemonSkillMutationResult>;
    reload: () => Promise<import("@hoptrendy/sdk/daemon").DaemonWorkspaceSkillsStatus | undefined>;
    data: import("@hoptrendy/sdk/daemon").DaemonWorkspaceSkillsStatus | undefined;
    loading: boolean;
    error: Error | undefined;
};
