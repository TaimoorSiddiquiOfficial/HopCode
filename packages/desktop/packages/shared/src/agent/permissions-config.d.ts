/**
 * Safe Mode Configuration
 *
 * Allows customization of Safe Mode rules per workspace and per source.
 * Users can create permissions.json files to extend the default rules.
 *
 * File locations:
 * - Workspace: ~/.craft-agent/workspaces/{slug}/permissions.json
 * - Per-source: ~/.craft-agent/workspaces/{slug}/sources/{sourceSlug}/permissions.json
 *
 * Rules are additive - custom configs extend the defaults (more permissive).
 */
import { PermissionsConfigSchema, type ApiEndpointRule, type PermissionsConfigFile, type CompiledApiEndpointRule, type CompiledBashPattern, type CompiledBlockedCommandHint, type BlockedCommandHintRule, type PermissionPaths } from './mode-types.ts';
/**
 * Get the app-level permissions directory.
 * Default permissions are stored at ~/.craft-agent/permissions/
 * Reads env var dynamically so tests can override via CRAFT_CONFIG_DIR.
 */
export declare function getAppPermissionsDir(): string;
/**
 * Sync bundled default permissions to disk on launch.
 * Handles migrations when bundled version is newer:
 * - If file doesn't exist → copy from bundle
 * - If file exists but is invalid/corrupt → copy from bundle (auto-heal)
 * - If file exists and bundled is newer → merge new patterns, update version
 * - If file exists and same/older version → no-op (preserve user changes)
 *
 * User customizations in workspace/source permissions.json files
 * are never touched by this function.
 */
export declare function ensureDefaultPermissions(): void;
/**
 * Load default permissions from ~/.craft-agent/permissions/default.json
 * Returns null if file doesn't exist or is invalid.
 */
export declare function loadDefaultPermissions(): PermissionsCustomConfig | null;
export { PermissionsConfigSchema, type ApiEndpointRule, type PermissionsConfigFile, type CompiledApiEndpointRule, type CompiledBashPattern, type PermissionPaths, };
/**
 * Pattern entry with optional comment for error messages.
 * Preserves the comment from permissions.json so we can show helpful hints.
 */
export interface PatternWithComment {
    pattern: string;
    comment?: string;
}
/**
 * Parsed and normalized permissions configuration
 *
 * Note: blockedTools (Write, Edit, MultiEdit, NotebookEdit) are hardcoded in
 * SAFE_MODE_CONFIG and not configurable here - they're fundamental write
 * operations that must always be blocked in Plan mode.
 */
export interface PermissionsCustomConfig {
    /** Additional bash patterns to allow (with optional comments for error messages) */
    allowedBashPatterns: PatternWithComment[];
    /** Additional MCP patterns to allow (as regex strings) */
    allowedMcpPatterns: string[];
    /** API endpoint rules for fine-grained control */
    allowedApiEndpoints: ApiEndpointRule[];
    /** File paths to allow writes in Plan mode (glob pattern strings) */
    allowedWritePaths: string[];
    /** Command-specific hints for blocked Bash commands */
    blockedCommandHints: BlockedCommandHintRule[];
}
/**
 * Merged permissions config for runtime use
 */
export interface MergedPermissionsConfig {
    /** Blocked tools (Write, Edit, MultiEdit, NotebookEdit) - hardcoded, not configurable */
    blockedTools: Set<string>;
    /** Read-only bash patterns with metadata for helpful error messages */
    readOnlyBashPatterns: CompiledBashPattern[];
    /** Command-specific hints for blocked Bash command explanations */
    blockedCommandHints: CompiledBlockedCommandHint[];
    readOnlyMcpPatterns: RegExp[];
    /** Fine-grained API endpoint rules */
    allowedApiEndpoints: CompiledApiEndpointRule[];
    /** File paths allowed for writes in Plan mode (glob patterns) */
    allowedWritePaths: string[];
    /** Display name for error messages */
    displayName: string;
    /** Keyboard shortcut hint */
    shortcutHint: string;
    /** Paths to permission files for actionable error messages */
    permissionPaths?: PermissionPaths;
}
/**
 * Context for permissions checking (includes workspace/source/agent info)
 */
export interface PermissionsContext {
    workspaceRootPath: string;
    /** Active source slugs for source-specific rules */
    activeSourceSlugs?: string[];
}
/**
 * Parse and validate permissions.json file
 */
export declare function parsePermissionsJson(content: string): PermissionsCustomConfig;
/**
 * Validate permissions config and return errors
 */
export declare function validatePermissionsConfig(config: PermissionsConfigFile): string[];
/**
 * Get path to workspace permissions.json
 */
export declare function getWorkspacePermissionsPath(workspaceRootPath: string): string;
/**
 * Get path to source permissions.json
 */
export declare function getSourcePermissionsPath(workspaceRootPath: string, sourceSlug: string): string;
/**
 * Load workspace-level permissions config
 */
export declare function loadWorkspacePermissionsConfig(workspaceRootPath: string): PermissionsCustomConfig | null;
/**
 * Load source-level permissions config
 */
export declare function loadSourcePermissionsConfig(workspaceRootPath: string, sourceSlug: string): PermissionsCustomConfig | null;
/**
 * Load raw PermissionsConfigFile from a workspace permissions.json.
 * Returns the Zod-parsed schema object (not the normalized runtime config).
 * Returns null if the file doesn't exist.
 */
export declare function loadRawWorkspacePermissions(workspaceRootPath: string): PermissionsConfigFile | null;
/**
 * Load raw PermissionsConfigFile from a source permissions.json.
 * Returns null if the file doesn't exist.
 */
export declare function loadRawSourcePermissions(workspaceRootPath: string, sourceSlug: string): PermissionsConfigFile | null;
/**
 * Save a PermissionsConfigFile to the workspace permissions.json.
 */
export declare function saveWorkspacePermissions(workspaceRootPath: string, config: PermissionsConfigFile): void;
/**
 * Save a PermissionsConfigFile to a source permissions.json.
 */
export declare function saveSourcePermissions(workspaceRootPath: string, sourceSlug: string, config: PermissionsConfigFile): void;
/**
 * Check if an API call is allowed by endpoint rules
 */
export declare function isApiEndpointAllowed(method: string, path: string, config: MergedPermissionsConfig): boolean;
/**
 * In-memory cache for parsed permissions configs
 * Invalidated on file changes via ConfigWatcher
 */
declare class PermissionsConfigCache {
    private workspaceConfigs;
    private sourceConfigs;
    private mergedConfigs;
    private defaultConfig;
    /**
     * Get or load app-level default permissions
     * These come from ~/.craft-agent/permissions/default.json
     */
    private getDefaultConfig;
    /**
     * Get or load workspace config
     */
    getWorkspaceConfig(workspaceRootPath: string): PermissionsCustomConfig | null;
    /**
     * Get or load source config
     */
    getSourceConfig(workspaceRootPath: string, sourceSlug: string): PermissionsCustomConfig | null;
    /**
     * Invalidate app-level default permissions (called by ConfigWatcher)
     * This clears all merged configs since defaults affect everything
     */
    invalidateDefaults(): void;
    /**
     * Invalidate workspace config (called by ConfigWatcher)
     */
    invalidateWorkspace(workspaceRootPath: string): void;
    /**
     * Invalidate source config (called by ConfigWatcher)
     */
    invalidateSource(workspaceRootPath: string, sourceSlug: string): void;
    /**
     * Get merged config for a context (workspace + active sources)
     * Uses additive merging: custom configs extend defaults
     */
    getMergedConfig(context: PermissionsContext): MergedPermissionsConfig;
    private buildMergedConfig;
    /**
     * Apply app-level default config (from default.json)
     * This adds bash/MCP patterns from the JSON config. Blocked tools are hardcoded
     * in SAFE_MODE_CONFIG and not loaded from JSON.
     */
    private applyDefaultConfig;
    private applyCustomConfig;
    /**
     * Apply source-specific config with auto-scoped MCP patterns.
     * MCP patterns in a source's permissions.json are automatically prefixed with
     * mcp__<sourceSlug>__ so they only apply to that source's tools.
     * This prevents cross-source leakage when using simple patterns like "list".
     */
    private applySourceConfig;
    private buildCacheKey;
    /**
     * Clear all cached configs
     */
    clear(): void;
}
export declare const permissionsConfigCache: PermissionsConfigCache;
