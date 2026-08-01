/**
 * Language utilities for code syntax highlighting.
 * Maps file extensions to language identifiers.
 */
/**
 * Map of file extensions to language IDs for syntax highlighting.
 */
export declare const LANGUAGE_MAP: Record<string, string>;
/**
 * Get language ID from a file path.
 * @param filePath - The file path to detect language from
 * @param explicit - Optional explicit language override
 * @returns Language ID (defaults to 'text')
 */
export declare function getLanguageFromPath(filePath: string, explicit?: string): string;
/**
 * Format file path for display, replacing home directory with ~.
 * @param filePath - The file path to format
 * @returns Formatted path (e.g., /Users/john/code/file.ts → ~/code/file.ts)
 */
export declare function formatFilePath(filePath: string): string;
/**
 * Truncate a file path for display, keeping the filename visible.
 * Truncation priority: middle > start > end
 *
 * @param filePath - The file path to truncate
 * @param maxLength - Maximum character length (default: 60)
 * @returns Truncated path with ellipsis in middle if needed
 *
 * Examples:
 * - ~/very/long/path/to/some/file.ts → ~/very/…/some/file.ts
 * - /extremely/long/path/file.ts → …/long/path/file.ts
 */
export declare function truncateFilePath(filePath: string, maxLength?: number): string;
