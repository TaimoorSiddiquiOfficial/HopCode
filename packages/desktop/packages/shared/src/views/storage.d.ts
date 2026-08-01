/**
 * Views Storage
 *
 * Filesystem-based storage for workspace view configurations.
 * Views are stored at {workspaceRootPath}/views.json
 *
 * Views are dynamic, expression-based filters computed at runtime from session state.
 * They are never persisted on sessions — purely runtime-evaluated.
 */
import type { ViewConfig } from './types.ts';
/**
 * Views configuration file structure.
 */
export interface ViewsConfig {
    /** Schema version */
    version: number;
    /** Array of view definitions */
    views: ViewConfig[];
}
/**
 * Load views configuration from workspace.
 * Returns default views if no file exists or parsing fails.
 * Also handles migration from old labels/config.json smartLabels key.
 */
export declare function loadViewsConfig(workspaceRootPath: string): ViewsConfig;
/**
 * Save views configuration to disk.
 */
export declare function saveViewsConfig(workspaceRootPath: string, config: ViewsConfig): void;
/**
 * List views for a workspace.
 * Returns the views array from config (seeded with defaults if missing).
 */
export declare function listViews(workspaceRootPath: string): ViewConfig[];
/**
 * Save views to the workspace config.
 * Replaces the entire views array.
 */
export declare function saveViews(workspaceRootPath: string, views: ViewConfig[]): void;
