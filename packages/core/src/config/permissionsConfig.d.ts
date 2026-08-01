/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
export interface PermissionsConfigParams {
    bareMode: boolean;
    coreTools?: string[];
    allowedTools?: string[];
    excludeTools?: string[];
    disabledSlashCommands?: string[];
    permissionsAllow: string[];
    permissionsAsk: string[];
    permissionsDeny: string[];
    toolDiscoveryCommand?: string;
    toolCallCommand?: string;
}
/**
 * Permission and tool-access configuration extracted from the monolithic
 * Config class. Owns the merge logic for allow/ask/deny rules, core-tool
 * selection (including bare-mode fallback), and slash-command denylist.
 *
 * This delegate is stateless — all inputs are provided at construction time.
 */
export declare class PermissionsConfig {
    private readonly coreTools;
    private readonly allowedTools;
    private readonly excludeTools;
    private readonly disabledSlashCommands;
    private readonly permissionsAllow;
    private readonly permissionsAsk;
    private readonly permissionsDeny;
    private readonly toolDiscoveryCommand;
    private readonly toolCallCommand;
    private readonly bareMode;
    constructor(params: PermissionsConfigParams);
    getCoreTools(): string[] | undefined;
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
    getPermissionsAllow(): string[];
    getPermissionsAsk(): string[];
    /**
     * Returns the merged deny-rules for PermissionManager.
     *
     * Merges:
     *   - settings.permissions.deny  (persistent rules from all scopes)
     *   - excludeTools param  (SDK / argv blocklist)
     */
    getPermissionsDeny(): string[];
    getToolDiscoveryCommand(): string | undefined;
    /**
     * Returns the pre-merged list of slash command names that should be hidden
     * from the CLI surface. Callers should treat this as a case-insensitive
     * denylist; `CommandService.create` handles the normalization.
     */
    getDisabledSlashCommands(): readonly string[];
    getToolCallCommand(): string | undefined;
}
