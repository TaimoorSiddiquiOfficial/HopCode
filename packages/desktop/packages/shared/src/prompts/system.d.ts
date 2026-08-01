/**
 * Find a project context file (AGENTS.md) in the directory.
 * Just checks if file exists, doesn't read content.
 * Returns the actual filename if found, null otherwise.
 */
export declare function findProjectContextFile(directory: string): string | null;
/** Invalidate the cached context file list for a directory (or all directories). */
export declare function invalidateContextFileCache(directory?: string): void;
/**
 * Find all project context files (AGENTS.md) recursively in a directory.
 * Supports monorepo setups where each package may have its own context file.
 * Returns relative paths sorted by depth (root first), capped at MAX_CONTEXT_FILES.
 *
 * Results are cached per directory. Call invalidateContextFileCache() on working
 * directory changes. A 5-minute TTL acts as a safety net for cache staleness.
 */
export declare function findAllProjectContextFiles(directory: string): string[];
/**
 * Read the project context file (AGENTS.md) from a directory.
 * Matching is case-insensitive to support any casing (AGENTS.md, agents.md, Agents.md, etc.).
 * Returns the content if found, null otherwise.
 */
export declare function readProjectContextFile(directory: string): {
    filename: string;
    content: string;
} | null;
/**
 * Get the working directory context string for injection into user messages.
 * Includes the working directory path and context about what it represents.
 * Returns empty string if no working directory is set.
 *
 * Note: Project context files (AGENTS.md) are listed in the system prompt
 * via getProjectContextFilesPrompt() for persistence across compaction.
 *
 * @param workingDirectory - The effective working directory path (where user wants to work)
 * @param isSessionRoot - If true, this is the session folder (not a user-specified project)
 * @param bashCwd - The actual bash shell cwd (may differ if working directory changed mid-session)
 */
export declare function getWorkingDirectoryContext(workingDirectory?: string, isSessionRoot?: boolean, bashCwd?: string): string;
/**
 * Get the current date/time context string
 */
export declare function getDateTimeContext(): string;
/** Debug mode configuration for system prompt */
export interface DebugModeConfig {
    enabled: boolean;
    logFilePath?: string;
}
/**
 * Get the project context files prompt section for the system prompt.
 * Lists all discovered context files (AGENTS.md) in the working directory.
 * For monorepos, this includes nested package context files.
 * Returns empty string if no working directory or no context files found.
 */
export declare function getProjectContextFilesPrompt(workingDirectory?: string): string;
/** Options for getSystemPrompt */
export interface SystemPromptOptions {
    pinnedPreferencesPrompt?: string;
    debugMode?: DebugModeConfig;
    workspaceRootPath?: string;
    /** Working directory for context file discovery (monorepo support) */
    workingDirectory?: string;
    /** Backend name for "powered by X" text (default: BRAND.selfReferName) */
    backendName?: string;
}
/**
 * System prompt preset types for different agent contexts.
 * - 'default': Full system prompt
 * - 'mini': Focused prompt for quick configuration edits
 */
export type SystemPromptPreset = 'default' | 'mini';
/**
 * Get a focused system prompt for mini agents (quick edit tasks).
 * Optimized for configuration edits with minimal context.
 *
 * @param workspaceRootPath - Root path of the workspace for config file locations
 */
export declare function getMiniAgentSystemPrompt(workspaceRootPath?: string): string;
/**
 * Get the full system prompt with current date/time and user preferences
 *
 * Note: Safe Mode context is injected via user messages instead of system prompt
 * to preserve prompt caching.
 *
 * @param pinnedPreferencesPrompt - Pre-formatted preferences (for session consistency)
 * @param debugMode - Debug mode configuration
 * @param workspaceRootPath - Root path of the workspace
 * @param workingDirectory - Working directory for context file discovery
 * @param preset - System prompt preset ('default' | 'mini' | custom string)
 * @param backendName - Backend name for "powered by X" text (default: BRAND.selfReferName)
 */
export declare function getSystemPrompt(pinnedPreferencesPrompt?: string, debugMode?: DebugModeConfig, workspaceRootPath?: string, workingDirectory?: string, preset?: SystemPromptPreset | string, backendName?: string, includeCoAuthoredBy?: boolean): string;
