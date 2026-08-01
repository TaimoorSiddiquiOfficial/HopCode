/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type { SkillConfig } from '@hoptrendy/hopcode-core';
import type { ServeWorkspaceSkillStatus } from '@hoptrendy/acp-bridge/status';
/**
 * Maps a `SkillConfig` (as `SkillManager.listSkills()` returns) to the
 * `/workspace/skills` wire status. Shared by the ACP child's
 * `buildWorkspaceSkillsStatus` and the daemon-local
 * `workspace-skills-status` provider so the two skill listings can never
 * drift in shape.
 */
export declare function mapSkillConfigToStatus(skill: SkillConfig, disabledSkillNames?: ReadonlySet<string>, opts?: {
    disabled?: boolean;
}): ServeWorkspaceSkillStatus;
