/**
 * Bundle File Utilities
 *
 * Shared helpers for serializing directory trees into portable JSON bundles.
 * Used by both session bundles and resource bundles.
 *
 * BundleFile.relativePath is always forward-slash separated for cross-platform portability.
 */
/**
 * Maximum bundle size in bytes (~100MB).
 */
export declare const MAX_BUNDLE_SIZE_BYTES: number;
/**
 * A file entry in a bundle.
 * Contains a portable relative path and base64-encoded content.
 */
export interface BundleFile {
    /** Portable relative path within the directory (always forward-slash separated) */
    relativePath: string;
    /** Base64-encoded file content */
    contentBase64: string;
    /** Original file size in bytes (for validation) */
    size: number;
}
/**
 * Normalize an OS-native relative path to portable forward-slash form.
 */
export declare function toPortableRelPath(relPath: string): string;
/**
 * Convert a portable forward-slash path to OS-native form for filesystem writes.
 */
export declare function fromPortableRelPath(portablePath: string): string;
/**
 * Validate a single BundleFile entry for safety and integrity.
 * Returns an error message string, or null if valid.
 */
export declare function validateBundleFile(file: BundleFile): string | null;
export interface CollectOptions {
    /** File names to skip (exact match, e.g., 'config.json') */
    skipFiles?: Set<string>;
    /** Directory names to skip (exact match, e.g., 'tmp') */
    skipDirs?: Set<string>;
}
/**
 * Collect all non-hidden regular files recursively from a directory.
 * Returns BundleFile entries sorted by relativePath for deterministic ordering.
 *
 * Skips:
 * - Hidden files and directories (starting with '.')
 * - Files/dirs matching skipFiles/skipDirs options
 * - Unreadable files (logged and skipped)
 */
export declare function collectDirectoryFiles(dir: string, options?: CollectOptions): BundleFile[];
/**
 * Restore BundleFile entries to a target directory.
 * Creates subdirectories as needed. Validates each file before writing.
 *
 * @throws Error if any file fails path validation (path traversal, absolute path, etc.)
 */
export declare function restoreFiles(targetDir: string, files: BundleFile[]): void;
