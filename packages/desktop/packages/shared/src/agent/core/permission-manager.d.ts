/**
 * PermissionManager - Centralized Tool Permission Evaluation
 *
 * Provides a unified interface for checking tool permissions that both
 * Backend agents can use. Delegates to the existing mode-manager
 * implementation to ensure consistent behavior.
 *
 * Key responsibilities:
 * - Evaluate tool calls against permission mode (explore/ask/execute)
 * - Check bash commands against read-only patterns
 * - Validate API endpoints against allowlists
 * - Provide detailed rejection reasons for blocked operations
 */
import { type ToolCheckResult } from '../mode-manager.ts';
import { type PermissionsContext } from '../permissions-config.ts';
import type { PermissionMode } from '../mode-types.ts';
import type { PermissionManagerConfig, ToolPermissionResult } from './types.ts';
export type { ToolCheckResult, PermissionMode };
/**
 * PermissionManager provides centralized permission checking for agent backends.
 *
 * Usage:
 * ```typescript
 * const permManager = new PermissionManager({
 *   workspaceId: workspace.id,
 *   sessionId: session.id,
 *   workingDirectory: session.workingDirectory,
 *   plansFolderPath: getSessionPlansPath(workspace, session.id),
 * });
 *
 * // Check if a tool call is allowed
 * const result = permManager.evaluateToolCall('Bash', { command: 'git status' });
 * if (!result.allowed) {
 *   // Block with reason
 * }
 * ```
 */
export declare class PermissionManager {
    private config;
    private permissionsContext;
    private alwaysAllowedCommands;
    private alwaysAllowedDomains;
    constructor(config: PermissionManagerConfig);
    /**
     * Get the current permission mode for this session.
     */
    getPermissionMode(): PermissionMode;
    /**
     * Set the permission mode for this session.
     */
    setPermissionMode(mode: PermissionMode): void;
    /**
     * Cycle to the next permission mode (explore → ask → execute → explore).
     * Returns the new mode.
     */
    cyclePermissionMode(enabledModes?: PermissionMode[]): PermissionMode;
    /**
     * Evaluate whether a tool call is allowed under the current permission mode.
     *
     * This is the main entry point for permission checking. It considers:
     * - Current permission mode (explore/ask/execute)
     * - Tool type (Bash, Write, MCP, API, etc.)
     * - Tool input parameters
     * - Custom permission rules from permissions.json
     *
     * @param toolName - Name of the tool being called
     * @param toolInput - Input parameters for the tool
     * @returns ToolPermissionResult with allowed status and reason if blocked
     */
    evaluateToolCall(toolName: string, toolInput: Record<string, unknown>): ToolPermissionResult;
    /**
     * Check if a bash command is allowed in the current mode.
     * Returns detailed rejection reason if blocked.
     *
     * @param command - The bash command to check
     * @returns null if allowed, or rejection reason string if blocked
     */
    checkBashCommand(command: string): string | null;
    /**
     * Check if a bash command requires user permission in 'ask' mode.
     * Dangerous commands always require permission.
     *
     * @param command - The bash command to check
     * @returns true if permission should be requested
     */
    requiresBashPermission(command: string): boolean;
    /**
     * Check if an API endpoint is allowed based on method and path.
     * GET requests are always allowed. Other methods check against allowlist.
     *
     * @param method - HTTP method (GET, POST, etc.)
     * @param path - API endpoint path
     * @returns true if the endpoint is allowed
     */
    isApiEndpointAllowed(method: string, path?: string): boolean;
    /**
     * Extract the base command (first word) from a bash command string.
     * Handles pipes, redirects, and other shell constructs.
     *
     * @param command - Full bash command
     * @returns Base command name
     */
    getBaseCommand(command: string): string;
    /**
     * Check if a command is in the dangerous commands list.
     *
     * @param baseCommand - Base command name (from getBaseCommand)
     * @returns true if command is dangerous
     */
    isDangerousCommand(baseCommand: string): boolean;
    /**
     * Extract domain from network commands (curl, wget, ssh, etc.)
     * Used for domain whitelisting checks.
     *
     * @param command - Full bash command
     * @returns Domain if found, null otherwise
     */
    extractDomainFromNetworkCommand(command: string): string | null;
    /**
     * Update the working directory (used for permission context).
     */
    updateWorkingDirectory(path: string): void;
    /**
     * Update the plans folder path.
     */
    updatePlansFolderPath(path: string): void;
    /**
     * Get the current session ID.
     */
    getSessionId(): string;
    /**
     * Get the permissions context for external use.
     */
    getPermissionsContext(): PermissionsContext;
    /**
     * Check if a base command has been whitelisted for this session.
     */
    isCommandWhitelisted(baseCommand: string): boolean;
    /**
     * Whitelist a command for the remainder of the session.
     * Called when user clicks "Always Allow" for a command.
     */
    whitelistCommand(baseCommand: string): void;
    /**
     * Check if a domain has been whitelisted for network commands.
     */
    isDomainWhitelisted(domain: string): boolean;
    /**
     * Whitelist a domain for network commands.
     * Called when user clicks "Always Allow" for curl/wget to a domain.
     */
    whitelistDomain(domain: string): void;
    /**
     * Clear all session-scoped whitelists.
     * Called on session clear or dispose.
     */
    clearWhitelists(): void;
    /**
     * Get the set of whitelisted commands (for debugging).
     */
    getWhitelistedCommands(): Set<string>;
    /**
     * Get the set of whitelisted domains (for debugging).
     */
    getWhitelistedDomains(): Set<string>;
}
