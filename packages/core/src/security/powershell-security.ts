/**
 * @license
 * Copyright 2025 Google LLC
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
export const DEFAULT_POWERSHELL_CONFIG: PowerShellSecurityConfig = {
  enabled: false,
  mode: 'ask',
  allowlist: [],
  blocklist: [],
};

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
 * Match a command string against a list of glob patterns.
 *
 * Supports `*` as a wildcard that matches any sequence of characters.
 * Matching is case-insensitive.
 */
function matchesPattern(command: string, pattern: string): boolean {
  const trimmedCommand = command.trim();
  // Convert glob pattern to regex:
  // - Escape regex special chars except *
  // - Replace * with .*
  // - Anchor to match the full command
  const escaped = pattern
    .replace(/[.+?^${}()|[\]\\]/g, '\\$&')
    .replace(/\*/g, '.*');
  const regex = new RegExp(`^${escaped}$`, 'i');
  return regex.test(trimmedCommand);
}

/**
 * Evaluate a PowerShell command against the security policy.
 *
 * @param command - The raw PowerShell command string
 * @param config - The PowerShell security configuration
 * @returns Evaluation result indicating whether the command is allowed
 */
export function evaluatePowerShellCommand(
  command: string,
  config: PowerShellSecurityConfig = DEFAULT_POWERSHELL_CONFIG,
): PowerShellEvaluationResult {
  // Step 1: Master switch — if disabled, block everything
  if (!config.enabled) {
    return {
      allowed: false,
      reason:
        'PowerShell execution is disabled. Enable it in settings under security.powershell.enabled.',
      requiresConfirmation: false,
      isHardDenial: true,
    };
  }

  // Step 2: Check blocklist first (hard deny)
  for (const pattern of config.blocklist) {
    if (matchesPattern(command, pattern)) {
      return {
        allowed: false,
        reason: `PowerShell command blocked by security policy (matches blocklist pattern: "${pattern}").`,
        requiresConfirmation: false,
        isHardDenial: true,
      };
    }
  }

  // Step 3: Check allowlist (auto-allow)
  for (const pattern of config.allowlist) {
    if (matchesPattern(command, pattern)) {
      return {
        allowed: true,
        requiresConfirmation: false,
        isHardDenial: false,
      };
    }
  }

  // Step 4: Apply mode
  switch (config.mode) {
    case 'allow':
      return {
        allowed: true,
        requiresConfirmation: false,
        isHardDenial: false,
      };
    case 'deny':
      return {
        allowed: false,
        reason:
          'PowerShell command blocked by security policy (mode is set to "deny").',
        requiresConfirmation: false,
        isHardDenial: true,
      };
    case 'ask':
    default:
      return {
        allowed: true,
        reason:
          'PowerShell command requires confirmation (mode is set to "ask").',
        requiresConfirmation: true,
        isHardDenial: false,
      };
  }
}

/**
 * Merge user-provided partial config with defaults.
 *
 * Used when settings only contain some of the PowerShell config fields.
 */
export function resolvePowerShellConfig(
  partial?: Partial<PowerShellSecurityConfig>,
): PowerShellSecurityConfig {
  return {
    enabled: partial?.enabled ?? DEFAULT_POWERSHELL_CONFIG.enabled,
    mode: partial?.mode ?? DEFAULT_POWERSHELL_CONFIG.mode,
    allowlist: partial?.allowlist ?? DEFAULT_POWERSHELL_CONFIG.allowlist,
    blocklist: partial?.blocklist ?? DEFAULT_POWERSHELL_CONFIG.blocklist,
  };
}
