/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Default PowerShell security configuration.
 *
 * PowerShell is disabled by default for safety. The PC owner must
 * explicitly enable it and configure the desired policy.
 */
export const DEFAULT_POWERSHELL_CONFIG = {
    enabled: false,
    mode: 'ask',
    allowlist: [],
    blocklist: [],
};
/**
 * Match a command string against a list of glob patterns.
 *
 * Supports `*` as a wildcard that matches any sequence of characters.
 * Matching is case-insensitive.
 */
function matchesPattern(command, pattern) {
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
export function evaluatePowerShellCommand(command, config = DEFAULT_POWERSHELL_CONFIG) {
    // Step 1: Master switch — if disabled, block everything
    if (!config.enabled) {
        return {
            allowed: false,
            reason: 'PowerShell execution is disabled. Enable it in settings under security.powershell.enabled.',
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
                reason: 'PowerShell command blocked by security policy (mode is set to "deny").',
                requiresConfirmation: false,
                isHardDenial: true,
            };
        case 'ask':
        default:
            return {
                allowed: true,
                reason: 'PowerShell command requires confirmation (mode is set to "ask").',
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
export function resolvePowerShellConfig(partial) {
    return {
        enabled: partial?.enabled ?? DEFAULT_POWERSHELL_CONFIG.enabled,
        mode: partial?.mode ?? DEFAULT_POWERSHELL_CONFIG.mode,
        allowlist: partial?.allowlist ?? DEFAULT_POWERSHELL_CONFIG.allowlist,
        blocklist: partial?.blocklist ?? DEFAULT_POWERSHELL_CONFIG.blocklist,
    };
}
//# sourceMappingURL=powershell-security.js.map