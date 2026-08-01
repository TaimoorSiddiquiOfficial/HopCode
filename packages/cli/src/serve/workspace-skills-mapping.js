/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Maps a `SkillConfig` (as `SkillManager.listSkills()` returns) to the
 * `/workspace/skills` wire status. Shared by the ACP child's
 * `buildWorkspaceSkillsStatus` and the daemon-local
 * `workspace-skills-status` provider so the two skill listings can never
 * drift in shape.
 */
export function mapSkillConfigToStatus(skill, disabledSkillNames = new Set(), opts = {}) {
    const userDisabled = disabledSkillNames.has(skill.name.toLowerCase());
    const modelInvocable = skill.disableModelInvocation !== true;
    return {
        kind: 'skill',
        status: opts.disabled || userDisabled ? 'disabled' : 'ok',
        name: skill.name,
        description: skill.description,
        level: skill.level,
        modelInvocable,
        ...(skill.userInvocable === false ? { userInvocable: false } : {}),
        installedPath: skill.filePath,
        ...(skill.argumentHint ? { argumentHint: skill.argumentHint } : {}),
        ...(skill.model ? { model: skill.model } : {}),
        ...(skill.extensionName ? { extensionName: skill.extensionName } : {}),
    };
}
//# sourceMappingURL=workspace-skills-mapping.js.map