/**
 * Source Storage
 *
 * CRUD operations for workspace-scoped sources.
 * Sources are stored at {workspaceRootPath}/sources/{sourceSlug}/
 *
 * Note: All functions take `workspaceRootPath` (absolute path to workspace folder),
 * NOT a workspace slug. The `LoadedSource.workspaceId` is derived via basename().
 */
import type { FolderSourceConfig, SourceGuide, LoadedSource, CreateSourceInput } from './types.ts';
/**
 * Get path to a source folder within a workspace
 */
export declare function getSourcePath(workspaceRootPath: string, sourceSlug: string): string;
/**
 * Ensure sources directory exists for a workspace
 */
export declare function ensureSourcesDir(workspaceRootPath: string): void;
/**
 * Load source config.json
 */
export declare function loadSourceConfig(workspaceRootPath: string, sourceSlug: string): FolderSourceConfig | null;
/**
 * Mark a source as authenticated and connected.
 * Updates isAuthenticated, connectionStatus, and clears any connection error.
 *
 * @returns true if the source was found and updated, false otherwise
 */
export declare function markSourceAuthenticated(workspaceRootPath: string, sourceSlug: string): boolean;
/**
 * Save source config.json
 * @throws Error if config is invalid
 */
export declare function saveSourceConfig(workspaceRootPath: string, config: FolderSourceConfig): void;
/**
 * Parse guide markdown.
 * Extracts sections (Scope, Guidelines, Context, API Notes) and Cache (JSON in code block).
 */
declare function parseGuideMarkdown(raw: string): SourceGuide;
/**
 * Load and parse guide.md with frontmatter cache
 */
export declare function loadSourceGuide(workspaceRootPath: string, sourceSlug: string): SourceGuide | null;
/**
 * Extract a short tagline from guide.md content
 * Looks for the first non-empty paragraph after the title, or falls back to scope section
 * @returns Tagline string (max 100 chars) or null if not found
 */
export declare function extractTagline(guide: SourceGuide | null): string | null;
/**
 * Save guide.md
 */
export declare function saveSourceGuide(workspaceRootPath: string, sourceSlug: string, guide: SourceGuide): void;
/**
 * Find icon file for a source
 * Returns absolute path to icon file or undefined
 */
export declare function findSourceIcon(workspaceRootPath: string, sourceSlug: string): string | undefined;
/**
 * Download an icon from a URL and save it to the source directory.
 * Returns the path to the downloaded icon, or null on failure.
 */
export declare function downloadSourceIcon(workspaceRootPath: string, sourceSlug: string, iconUrl: string): Promise<string | null>;
/**
 * Check if a source needs its icon downloaded.
 * Returns true if config has a URL icon and no local icon file exists.
 */
export declare function sourceNeedsIconDownload(workspaceRootPath: string, sourceSlug: string, config: FolderSourceConfig): boolean;
export { isIconUrl } from '../utils/icon.ts';
/**
 * Load complete source with all files
 * @param workspaceRootPath - Absolute path to workspace folder (e.g., ~/.craft-agent/workspaces/xxx)
 * @param sourceSlug - Source folder name
 */
export declare function loadSource(workspaceRootPath: string, sourceSlug: string): LoadedSource | null;
/**
 * Load all sources for a workspace
 */
export declare function loadWorkspaceSources(workspaceRootPath: string): LoadedSource[];
/**
 * Get enabled sources for a workspace
 */
export declare function getEnabledSources(workspaceRootPath: string): LoadedSource[];
/**
 * Check if a source is ready for use (enabled and authenticated).
 * Sources with authType: 'none' or undefined are considered authenticated.
 *
 * Use this instead of inline `s.config.enabled && s.config.isAuthenticated` checks
 * to ensure consistent handling of no-auth sources.
 */
export declare function isSourceUsable(source: LoadedSource): boolean;
/**
 * Get sources by slugs for a workspace.
 * Includes both user-configured sources from disk and builtin sources
 * (like craft-agents-docs) that don't have filesystem folders.
 */
export declare function getSourcesBySlugs(workspaceRootPath: string, slugs: string[]): LoadedSource[];
/**
 * Load all sources for a workspace INCLUDING built-in sources.
 * Built-in sources (like craft-agents-docs) are always available and merged
 * with user-configured sources from the workspace.
 *
 * Use this when the agent needs visibility into all available sources,
 * including system-provided ones that don't live on disk.
 */
export declare function loadAllSources(workspaceRootPath: string): LoadedSource[];
/**
 * Generate URL-safe slug from name
 */
export declare function generateSourceSlug(workspaceRootPath: string, name: string): string;
/**
 * Create a new source in a workspace
 */
export declare function createSource(workspaceRootPath: string, input: CreateSourceInput): Promise<FolderSourceConfig>;
/**
 * Delete a source from a workspace
 */
export declare function deleteSource(workspaceRootPath: string, sourceSlug: string): void;
/**
 * Check if a source exists in a workspace
 */
export declare function sourceExists(workspaceRootPath: string, sourceSlug: string): boolean;
export { parseGuideMarkdown };
