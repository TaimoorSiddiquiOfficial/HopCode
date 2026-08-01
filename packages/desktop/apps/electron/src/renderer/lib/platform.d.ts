/**
 * Platform Detection Utilities
 *
 * Centralized platform detection for the renderer process.
 * Use these instead of accessing navigator.platform directly.
 *
 * @example
 * import { isMac, isWindows, PATH_SEP, getPathBasename } from '@/lib/platform'
 *
 * // Platform checks
 * const modifier = isMac ? '⌘' : 'Ctrl'
 *
 * // Path handling
 * const folderName = getPathBasename('/Users/alice/projects') // 'projects'
 */
/** True if running on macOS */
export declare const isMac: boolean;
/** True if running on Windows */
export declare const isWindows: boolean;
/** True if running on Linux */
export declare const isLinux: boolean;
/**
 * Get the platform-specific file manager name.
 * macOS → "Finder", Windows → "Explorer", Linux → "File Manager"
 */
export declare function getFileManagerName(): string;
/** Native path separator for current OS */
export declare const PATH_SEP: string;
/**
 * Get the last segment of a path (folder/file name).
 * Handles both Unix (/) and Windows (\) separators based on current OS.
 */
export declare function getPathBasename(path: string): string;
