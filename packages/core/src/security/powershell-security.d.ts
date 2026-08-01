/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * PowerShell security policy layer.
 *
 * Gives the PC owner control over when the AI agent can execute PowerShell
 * commands. This sits in front of the existing PermissionManager rules and
 * provides a dedicated master-switch + mode + allowlist/blocklist system.
 *
 * ## Policy evaluation order
 *
 * 1. **Master switch** (`enabled: false`) → hard block everything
 * 2. **Blocklist** → hard deny matching commands
 * 3. **Allowlist** → auto-allow matching commands
 * 4. **Mode** → 'allow' (auto-approve), 'ask' (confirmation required), 'deny' (block)
 */
/**
 * User-configurable PowerShell security policy.
 *
 * Stored under `settings.security.powershell` and loaded by the CLI
 * config layer, passed through to Config.getPowerShellConfig().
 */
export interface PowerShellSecurityConfig {
    /**
     * Master switch. When `false`, ALL PowerShell commands are blocked
     * regardless of other settings.
     *
     * @default false
     */
    enabled: boolean;
    /**
     * Default behavior for PowerShell commands that are not matched by
     * the allowlist or blocklist.
     *
     * - `'allow'`: Execute without confirmation
     * - `'ask'`: Require user confirmation before execution
     * - `'deny'`: Block execution
     *
     * @default 'ask'
     */
    mode: 'allow' | 'ask' | 'deny';
    /**
     * Command patterns that are automatically allowed (bypass mode).
     * Supports `*` wildcard matching against the full command string.
     *
     * Examples:
     * - `"get-*"` — allows all `Get-*` cmdlets
     * - `"dir"` — allows exactly `dir`
     * - `"npm *"` — allows npm with any arguments
     *
     * @default []
     */
    allowlist: string[];
    /**
     * Command patterns that are always blocked, regardless of mode.
     * Supports `*` wildcard matching against the full command string.
     *
     * Examples:
     * - `"rm -rf *"` — blocks recursive force remove
     * - `"del /f /s *"` — blocks force recursive delete
     * - `"Stop-Process *"` — blocks process termination
     *
     * @default []
     */
    blocklist: string[];
}
/**
 * Default PowerShell security configuration.
 *
 * PowerShell is disabled by default for safety. The PC owner must
 * explicitly enable it and configure the desired policy.
 */
export declare const DEFAULT_POWERSHELL_CONFIG: PowerShellSecurityConfig;
/**
 * Result of evaluating a PowerShell command against the security policy.
 */
export interface PowerShellEvaluationResult {
    /** Whether the command is allowed to execute. */
    allowed: boolean;
    /** Human-readable reason if blocke  or requires confirmation. */
    reason?: string;
    /** Whether user confirmation is required before execution. */
    requiresConfirmation: boolean;
    /** Whether this is a hard denial (blocked by master switch or blocklist). */
    isHardDenial: boolean;
}
/**
 * Evaluate a PowerShell command against the security policy.
 *
 * @param command - The raw PowerShell command string
 * @param config - The PowerShell security configuration
 * @returns Evaluation result indicating whether the command is allowed
 */
export declare function evaluatePowerShellCommand(command: string, config?: PowerShellSecurityConfig): PowerShellEvaluationResult;
/**
 * Merge user-provided partial config with defaults.
 *
 * Used when settings only contain some of the PowerShell config fields.
 */
export declare function resolvePowerShellConfig(partial?: Partial<PowerShellSecurityConfig>): PowerShellSecurityConfig;
