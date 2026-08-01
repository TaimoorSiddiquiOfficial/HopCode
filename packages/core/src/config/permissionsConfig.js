/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { ToolNames } from '../tools/tool-names.js';
const DEFAULT_BARE_CORE_TOOLS = [
    ToolNames.READ_FILE,
    ToolNames.EDIT,
    ToolNames.NOTEBOOK_EDIT,
    ToolNames.SHELL,
];
/**
 * Permission and tool-access configuration extracted from the monolithic
 * Config class. Owns the merge logic for allow/ask/deny rules, core-tool
 * selection (including bare-mode fallback), and slash-command denylist.
 *
 * This delegate is stateless — all inputs are provided at construction time.
 */
export class PermissionsConfig {
    coreTools;
    allowedTools;
    excludeTools;
    disabledSlashCommands;
    permissionsAllow;
    permissionsAsk;
    permissionsDeny;
    toolDiscoveryCommand;
    toolCallCommand;
    bareMode;
    constructor(params) {
        this.bareMode = params.bareMode;
        this.coreTools = params.coreTools;
        this.allowedTools = params.allowedTools;
        this.excludeTools = params.excludeTools;
        this.disabledSlashCommands = Object.freeze([
            ...(params.disabledSlashCommands ?? []),
        ]);
        this.permissionsAllow = params.permissionsAllow;
        this.permissionsAsk = params.permissionsAsk;
        this.permissionsDeny = params.permissionsDeny;
        this.toolDiscoveryCommand = params.toolDiscoveryCommand;
        this.toolCallCommand = params.toolCallCommand;
    }
    getCoreTools() {
        if (this.bareMode) {
            return DEFAULT_BARE_CORE_TOOLS;
        }
        return this.coreTools;
    }
    /**
     * Returns the merged allow-rules for PermissionManager.
     *
     * This merges all sources so that PermissionManager receives a single,
     * authoritative list:
     *   - settings.permissions.allow  (persistent rules from all scopes)
     *   - allowedTools param  (SDK / argv auto-approve list)
     *
     * Note: coreTools is intentionally excluded here — it has whitelist semantics
     * (only listed tools are registered), not auto-approve semantics. It is
     * handled separately via PermissionManager.coreToolsAllowList.
     */
    getPermissionsAllow() {
        const base = this.permissionsAllow ?? [];
        const sdkAllow = [...(this.allowedTools ?? [])];
        if (sdkAllow.length === 0)
            return base.length > 0 ? base : [];
        const merged = [...base];
        for (const t of sdkAllow) {
            if (t && !merged.includes(t))
                merged.push(t);
        }
        return merged;
    }
    getPermissionsAsk() {
        return this.permissionsAsk;
    }
    /**
     * Returns the merged deny-rules for PermissionManager.
     *
     * Merges:
     *   - settings.permissions.deny  (persistent rules from all scopes)
     *   - excludeTools param  (SDK / argv blocklist)
     */
    getPermissionsDeny() {
        const base = this.permissionsDeny ?? [];
        const sdkDeny = this.excludeTools ?? [];
        if (sdkDeny.length === 0)
            return base.length > 0 ? base : [];
        const merged = [...base];
        for (const t of sdkDeny) {
            if (t && !merged.includes(t))
                merged.push(t);
        }
        return merged;
    }
    getToolDiscoveryCommand() {
        return this.toolDiscoveryCommand;
    }
    /**
     * Returns the pre-merged list of slash command names that should be hidden
     * from the CLI surface. Callers should treat this as a case-insensitive
     * denylist; `CommandService.create` handles the normalization.
     */
    getDisabledSlashCommands() {
        return this.disabledSlashCommands;
    }
    getToolCallCommand() {
        return this.toolCallCommand;
    }
}
//# sourceMappingURL=permissionsConfig.js.map