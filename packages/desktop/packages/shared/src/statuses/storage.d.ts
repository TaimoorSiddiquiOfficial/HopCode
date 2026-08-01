/**
 * Status Storage
 *
 * Filesystem-based storage for workspace status configurations.
 * Statuses are stored at {workspaceRootPath}/statuses/config.json
 *
 * Icon handling:
 * - Local files: statuses/icons/{id}.svg (auto-discovered)
 * - Emoji: Rendered as text in UI
 * - URL: Auto-downloaded to statuses/icons/{id}.{ext}
 */
import type { WorkspaceStatusConfig, StatusConfig, StatusCategory } from './types.ts';
/**
 * Get default status configuration (matches current hardcoded behavior)
 * Note: icon field is omitted - uses auto-discovered files in statuses/icons/{id}.svg
 */
export declare function getDefaultStatusConfig(): WorkspaceStatusConfig;
/**
 * Ensure default icon files exist in statuses/icons/
 * Creates missing icon files from embedded SVG strings
 */
export declare function ensureDefaultIconFiles(workspaceRootPath: string): void;
/**
 * Load workspace status configuration
 * Returns defaults if no config exists or validation fails.
 * Ensures icon files exist.
 * Auto-migrates old Tailwind color format to EntityColor on first load.
 */
export declare function loadStatusConfig(workspaceRootPath: string): WorkspaceStatusConfig;
/**
 * Save workspace status configuration to disk
 */
export declare function saveStatusConfig(workspaceRootPath: string, config: WorkspaceStatusConfig): void;
/**
 * Get a single status by ID
 * Returns null if not found
 */
export declare function getStatus(workspaceRootPath: string, statusId: string): StatusConfig | null;
/**
 * Get all statuses sorted by order
 */
export declare function listStatuses(workspaceRootPath: string): StatusConfig[];
/**
 * Check if a status ID is valid for this workspace
 */
export declare function isValidStatusId(workspaceRootPath: string, statusId: string): boolean;
/**
 * Get category for a status ID
 * Returns null if status not found
 */
export declare function getStatusCategory(workspaceRootPath: string, statusId: string): StatusCategory | null;
/**
 * Find icon file for a status
 * Looks for statuses/icons/{statusId}.{svg,png,jpg,jpeg}
 * Returns absolute path to icon file or undefined
 */
export declare function findStatusIcon(workspaceRootPath: string, statusId: string): string | undefined;
/**
 * Download an icon from a URL and save it to the status icons directory.
 * Saves as statuses/icons/{statusId}.{ext}
 * Returns the path to the downloaded icon, or null on failure.
 */
export declare function downloadStatusIcon(workspaceRootPath: string, statusId: string, iconUrl: string): Promise<string | null>;
/**
 * Check if a status needs its icon downloaded.
 * Returns true if config has a URL icon and no local icon file exists.
 */
export declare function statusNeedsIconDownload(workspaceRootPath: string, status: StatusConfig): boolean;
export { isIconUrl } from '../utils/icon.ts';
