/**
 * Strip UTF-8 BOM (Byte Order Mark) from a string.
 * BOM (\uFEFF) can appear when files are written by certain editors or tools
 * and causes JSON.parse() to fail with "Unexpected token" errors.
 */
export declare function stripBom(text: string): string;
/**
 * Parse a JSON string, stripping any leading UTF-8 BOM.
 * Use this instead of raw JSON.parse() for any content that may originate from a file.
 */
export declare function safeJsonParse(text: string): unknown;
/**
 * Read and parse a JSON file, handling UTF-8 BOM transparently.
 * Replaces the common JSON.parse(readFileSync(path, 'utf-8')) pattern.
 */
export declare function readJsonFileSync<T = unknown>(filePath: string): T;
/**
 * Atomically write a file by writing to a temp file then renaming.
 * This prevents partial writes from corrupting the file on crash/interrupt.
 * Uses write-to-temp-then-rename pattern which is atomic on POSIX systems.
 */
export declare function atomicWriteFileSync(filePath: string, data: string): void;
export interface FileAttachment {
    type: 'image' | 'text' | 'pdf' | 'office' | 'unknown';
    path: string;
    name: string;
    mimeType: string;
    base64?: string;
    text?: string;
    size: number;
    /** Path where file is stored in session attachments folder (set by Electron app) */
    storedPath?: string;
    /** Path to converted markdown version (for office files) */
    markdownPath?: string;
}
/**
 * Result of validating an image for agent compatibility
 */
export interface ImageValidationResult {
    valid: boolean;
    /** Hard error - image cannot be sent */
    error?: string;
    /** Error code for programmatic handling */
    errorCode?: 'dimension_exceeded' | 'size_exceeded';
    /** Warning - image will work but may have issues */
    warning?: string;
    /** Image needs resizing for optimal performance */
    needsResize?: boolean;
    /** Suggested new dimensions if resize needed */
    suggestedSize?: {
        width: number;
        height: number;
    };
}
/**
 * Validate an image for agent compatibility
 * Returns validation result with errors, warnings, and resize suggestions
 *
 * @param size - File size in bytes
 * @param width - Image width in pixels (optional, for dimension checking)
 * @param height - Image height in pixels (optional, for dimension checking)
 */
export declare function validateImageForAgent(size: number, width?: number, height?: number): ImageValidationResult;
export declare const IMAGE_LIMITS: {
    readonly MAX_SIZE: number;
    /** Max raw file size before base64 encoding (base64 inflates by 4/3, so 5MB base64 ≈ 3.75MB raw) */
    readonly MAX_RAW_SIZE: number;
    readonly MAX_DIMENSION: 8000;
    readonly OPTIMAL_EDGE: 1568;
    /** JPEG quality for photo-like images */
    readonly JPEG_QUALITY_HIGH: 90;
    /** JPEG quality for fallback compression when size still exceeds limits */
    readonly JPEG_QUALITY_FALLBACK: 75;
};
/**
 * Extract file paths from input text
 * Handles:
 * - Absolute paths (/path/to/file)
 * - Home-relative paths (~/path/to/file)
 * - Quoted paths ("path with spaces")
 * - Shell-escaped paths (/path/to/file\ with\ spaces)
 * - Paths with spaces ending in .extension
 */
export declare function extractFilePaths(input: string): string[];
/**
 * Resolve a path (handle ~ expansion)
 */
export declare function resolvePath(filePath: string): string;
/**
 * Determine the type of a file based on extension
 * Falls back to 'text' for unknown extensions (will try to read as text)
 */
export declare function getFileType(filePath: string): 'image' | 'text' | 'pdf' | 'office' | 'unknown';
/**
 * Get MIME type for a file
 */
export declare function getMimeType(filePath: string): string;
/**
 * Read a file and return attachment info
 */
export declare function readFileAttachment(filePath: string): FileAttachment | null;
/**
 * Process input text and extract any file attachments
 * Returns the cleaned text and any file attachments
 */
export declare function processInputWithFiles(input: string): {
    text: string;
    attachments: FileAttachment[];
    errors: string[];
};
/**
 * Read from clipboard (cross-platform)
 * Checks for: 1) File URLs (copied files), 2) Images
 * Returns FileAttachment[] - could be multiple files
 */
export declare function readClipboard(): FileAttachment[];
/**
 * Format a single absolute path to relative if it's within cwd
 * @param absolutePath - The absolute path to format
 * @param cwd - Current working directory (defaults to process.cwd())
 * @returns Relative path prefixed with ./ or original path if outside cwd
 */
export declare function formatSinglePathToRelative(absolutePath: string, cwd?: string): string;
/**
 * Format absolute file paths in text to relative paths from cwd
 * Converts paths like /Users/john/project/src/file.ts to ./src/file.ts
 *
 * @param text - Text containing file paths
 * @param cwd - Current working directory (defaults to process.cwd())
 * @returns Text with absolute paths converted to relative paths
 */
export declare function formatPathsToRelative(text: string, cwd?: string): string;
/**
 * Format file paths in tool input objects to relative paths
 * Handles common tool input patterns like { file_path: "..." } or { path: "..." }
 *
 * @param input - Tool input object
 * @param cwd - Current working directory (defaults to process.cwd())
 * @returns New object with paths formatted to relative
 */
export declare function formatToolInputPaths(input: Record<string, unknown> | undefined, cwd?: string): Record<string, unknown> | undefined;
