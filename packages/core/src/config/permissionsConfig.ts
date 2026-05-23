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
export class PermissionsConfig {
  private readonly coreTools: string[] | undefined;
  private readonly allowedTools: string[] | undefined;
  private readonly excludeTools: string[] | undefined;
  private readonly disabledSlashCommands: readonly string[];
  private readonly permissionsAllow: string[];
  private readonly permissionsAsk: string[];
  private readonly permissionsDeny: string[];
  private readonly toolDiscoveryCommand: string | undefined;
  private readonly toolCallCommand: string | undefined;
  private readonly bareMode: boolean;

  constructor(params: PermissionsConfigParams) {
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

  getCoreTools(): string[] | undefined {
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
  getPermissionsAllow(): string[] {
    const base = this.permissionsAllow ?? [];
    const sdkAllow = [...(this.allowedTools ?? [])];
    if (sdkAllow.length === 0) return base.length > 0 ? base : [];
    const merged = [...base];
    for (const t of sdkAllow) {
      if (t && !merged.includes(t)) merged.push(t);
    }
    return merged;
  }

  getPermissionsAsk(): string[] {
    return this.permissionsAsk;
  }

  /**
   * Returns the merged deny-rules for PermissionManager.
   *
   * Merges:
   *   - settings.permissions.deny  (persistent rules from all scopes)
   *   - excludeTools param  (SDK / argv blocklist)
   */
  getPermissionsDeny(): string[] {
    const base = this.permissionsDeny ?? [];
    const sdkDeny = this.excludeTools ?? [];
    if (sdkDeny.length === 0) return base.length > 0 ? base : [];
    const merged = [...base];
    for (const t of sdkDeny) {
      if (t && !merged.includes(t)) merged.push(t);
    }
    return merged;
  }

  getToolDiscoveryCommand(): string | undefined {
    return this.toolDiscoveryCommand;
  }

  /**
   * Returns the pre-merged list of slash command names that should be hidden
   * from the CLI surface. Callers should treat this as a case-insensitive
   * denylist; `CommandService.create` handles the normalization.
   */
  getDisabledSlashCommands(): readonly string[] {
    return this.disabledSlashCommands;
  }

  getToolCallCommand(): string | undefined {
    return this.toolCallCommand;
  }
}
