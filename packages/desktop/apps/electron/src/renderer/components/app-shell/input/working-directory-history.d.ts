export declare const MAX_RECENT_WORKING_DIRS = 25;
/**
 * Add a directory path to recent history.
 * - Deduplicates existing entries
 * - Inserts at top
 * - Caps list length
 */
export declare function addPathToRecentWorkingDirs(recentDirs: string[], path: string, maxEntries?: number): string[];
/** Remove a directory path from recent history. */
export declare function removePathFromRecentWorkingDirs(recentDirs: string[], path: string): string[];
/**
 * Normalize a directory history list:
 * - Trims entries
 * - Drops empty values
 * - Deduplicates while preserving first-seen order
 * - Caps length
 */
export declare function normalizeRecentWorkingDirs(paths: string[], maxEntries?: number): string[];
/** Read recent working directories from local storage (workspace-scoped when workspaceId provided). */
export declare function getRecentWorkingDirs(workspaceId?: string): string[];
/** Persist a full recent working directory list. */
export declare function setRecentWorkingDirs(paths: string[], workspaceId?: string): string[];
/** Add one path to recent working directory history and persist. */
export declare function addRecentWorkingDir(path: string, workspaceId?: string): string[];
/** Remove one path from recent working directory history and persist. */
export declare function removeRecentWorkingDir(path: string, workspaceId?: string): string[];
