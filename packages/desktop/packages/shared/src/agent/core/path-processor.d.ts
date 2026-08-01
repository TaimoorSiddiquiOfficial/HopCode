/**
 * PathProcessor - Path Expansion and Normalization
 *
 * Provides path utilities for backend agents.
 * Wraps the existing path utilities with a consistent interface for agent
 * tool processing.
 *
 * Key responsibilities:
 * - Expand ~ and $HOME to absolute paths
 * - Normalize paths for cross-platform comparison
 * - Detect config file paths that need validation
 */
import { expandPath, normalizePath, pathStartsWith, toPortablePath } from '../../utils/paths.ts';
import type { PathProcessorConfig } from './types.ts';
export { expandPath, normalizePath, pathStartsWith, toPortablePath };
/**
 * PathProcessor provides path utilities for agent tool processing.
 *
 * Usage:
 * ```typescript
 * const pathProcessor = new PathProcessor();
 *
 * // Expand user paths in tool inputs
 * const expandedPath = pathProcessor.expandPath('~/Documents/file.txt');
 *
 * // Check if a file needs config validation
 * if (pathProcessor.isConfigFile(filePath)) {
 *   // Validate before writing
 * }
 * ```
 */
export declare class PathProcessor {
    private homeDir;
    constructor(config?: PathProcessorConfig);
    /**
     * Expand ~ and $HOME variables to absolute paths.
     *
     * @param path - Path that may contain ~ or $HOME
     * @param basePath - Base path for relative resolution (defaults to cwd)
     * @returns Absolute expanded path
     */
    expandPath(path: string, basePath?: string): string;
    /**
     * Expand ~ to home directory (simple version for SDK inputs).
     * Only handles ~ prefix, not $HOME variables.
     *
     * @param path - Path that may start with ~
     * @returns Expanded path
     */
    expandTilde(path: string): string;
    /**
     * Normalize a path to use forward slashes for cross-platform comparison.
     *
     * @param path - Path to normalize
     * @returns Normalized path with forward slashes
     */
    normalize(path: string): string;
    /**
     * Normalize a path for comparison.
     * Resolves to absolute, normalizes separators, and lowercases on Windows.
     */
    normalizeForComparison(path: string): string;
    /**
     * Convert an absolute path to portable form (~ prefix if in home).
     *
     * @param absolutePath - Absolute path to convert
     * @returns Portable path
     */
    toPortable(absolutePath: string): string;
    /**
     * Check if a file path is within a directory.
     *
     * @param filePath - File path to check
     * @param dirPath - Directory to check against
     * @returns true if file is within directory
     */
    isWithinDirectory(filePath: string, dirPath: string): boolean;
    /**
     * Check if a path points to a configuration file that needs validation.
     * These files have specific formats that can break applications if malformed.
     *
     * @param filePath - Path to check
     * @returns true if this is a config file
     */
    isConfigFile(filePath: string): boolean;
    /**
     * Get the list of config file patterns (for debugging/logging).
     */
    getConfigPatterns(): RegExp[];
    /**
     * Detect the type of config file based on extension.
     *
     * @param filePath - Path to check
     * @returns Config type or null if not a config file
     */
    getConfigType(filePath: string): 'json' | 'toml' | 'yaml' | 'env' | 'md' | null;
    /**
     * Get the home directory.
     */
    getHomeDir(): string;
    /**
     * Get the file name from a path.
     */
    getBasename(path: string): string;
    /**
     * Get the directory from a path.
     */
    getDirname(path: string): string;
    /**
     * Check if a path is absolute.
     */
    isAbsolute(path: string): boolean;
    /**
     * Resolve a path against a base directory.
     */
    resolve(basePath: string, ...paths: string[]): string;
}
