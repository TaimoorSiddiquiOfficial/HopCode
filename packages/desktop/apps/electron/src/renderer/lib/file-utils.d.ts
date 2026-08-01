/**
 * File utilities for language detection and path formatting.
 * Shared across code preview, diff preview, and multi-file diff components.
 */
/**
 * Map of file extensions to Monaco editor language IDs.
 */
export declare const LANGUAGE_MAP: Record<string, string>;
/**
 * Get Monaco language ID from a file path.
 * @param filePath - The file path to detect language from
 * @param explicit - Optional explicit language override
 * @returns Monaco language ID (defaults to 'plaintext')
 */
export declare function getLanguageFromPath(filePath: string, explicit?: string): string;
/**
 * Format file path for display, replacing home directory with ~.
 * @param filePath - The file path to format
 * @returns Formatted path (e.g., /Users/john/code/file.ts → ~/code/file.ts)
 */
export declare function formatFilePath(filePath: string): string;
