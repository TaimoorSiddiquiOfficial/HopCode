/**
 * PromptBuilder - System Prompt and Context Building
 *
 * Provides utilities for building system prompts and context blocks that both
 * Backend agents can use. Handles workspace capabilities, recovery
 * context, and user preferences formatting.
 *
 * Key responsibilities:
 * - Build workspace capabilities context
 * - Format recovery context for session resume failures
 * - Build session state context blocks
 * - Format user preferences for prompt injection
 */
import type { PromptBuilderConfig, ContextBlockOptions, RecoveryMessage } from './types.ts';
/**
 * PromptBuilder provides utilities for building prompts and context blocks.
 *
 * Usage:
 * ```typescript
 * const promptBuilder = new PromptBuilder({
 *   workspace,
 *   session,
 *   debugMode: { enabled: true },
 * });
 *
 * // Build context blocks for a user message
 * const contextParts = promptBuilder.buildContextParts({
 *   permissionMode: 'explore',
 *   plansFolderPath: '/path/to/plans',
 * });
 * ```
 */
export declare class PromptBuilder {
    private config;
    private workspaceRootPath;
    private pinnedPreferencesPrompt;
    constructor(config: PromptBuilderConfig);
    /**
     * Build all context parts for a user message.
     * Returns an array of strings that should be prepended to the user message.
     *
     * @param options - Context building options
     * @param sourceStateBlock - Pre-formatted source state (from SourceManager)
     * @returns Array of context strings
     */
    buildContextParts(options: ContextBlockOptions, sourceStateBlock?: string): string[];
    /**
     * Format workspace capabilities for prompt injection.
     * Informs the agent about what features are available in this workspace.
     */
    formatWorkspaceCapabilities(): string;
    /**
     * Get working directory context for prompt injection.
     */
    getWorkingDirectoryContext(): string | null;
    /**
     * Build recovery context from previous messages when SDK resume fails.
     * Called when we detect an empty response during resume.
     *
     * @param messages - Previous messages to include in recovery context
     * @returns Formatted recovery context string, or null if no messages
     */
    buildRecoveryContext(messages?: RecoveryMessage[]): string | null;
    /**
     * Format user preferences for prompt injection.
     * Preferences are pinned on first call to ensure consistency within a session.
     *
     * @param forceRefresh - Force refresh of cached preferences
     * @returns Formatted preferences string
     */
    formatPreferences(forceRefresh?: boolean): string;
    /**
     * Clear pinned preferences (called on session clear).
     */
    clearPinnedPreferences(): void;
    /**
     * Update the workspace configuration.
     */
    setWorkspace(workspace: PromptBuilderConfig['workspace']): void;
    /**
     * Update the session configuration.
     */
    setSession(session: PromptBuilderConfig['session']): void;
    /**
     * Get the workspace root path.
     */
    getWorkspaceRootPath(): string;
    /**
     * Check if debug mode is enabled.
     */
    isDebugMode(): boolean;
    /**
     * Get the system prompt preset.
     */
    getSystemPromptPreset(): string;
}
