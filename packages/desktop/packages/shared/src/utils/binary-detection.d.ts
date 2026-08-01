/**
 * Binary Detection & File Saving Utilities
 *
 * Shared binary content detection used by guardLargeResult() to handle
 * binary data across all tool result paths (API tools, MCP tools, backend adapters).
 *
 * Extracted from api-tools.ts for centralized use.
 */
/** Maximum file size for binary downloads (500MB) — prevents OOM */
export declare const MAX_DOWNLOAD_SIZE: number;
/**
 * MIME type to file extension mapping for binary downloads.
 */
export declare const MIME_TO_EXT: Record<string, string>;
/**
 * Inspect buffer contents to detect binary data.
 * Checks for null bytes and high ratio of non-printable characters.
 *
 * UTF-8 handling: We skip ALL bytes >= 0x80 (multibyte sequences) to avoid
 * misclassifying international text (accented chars, emojis, CJK) as binary.
 * Only ASCII bytes (0x00-0x7F) are analyzed for printability.
 */
export declare function looksLikeBinary(buffer: Buffer): boolean;
/**
 * Detect file extension from magic bytes (file signature).
 * Inspects first bytes of buffer to identify common file formats.
 * Returns extension with dot (e.g., '.pdf') or empty string if unknown.
 */
export declare function detectExtensionFromMagic(buffer: Buffer): string;
/**
 * Get file extension from MIME type, with optional magic byte fallback.
 */
export declare function getMimeExtension(mimeType: string | null, buffer?: Buffer): string;
/**
 * Result of extracting base64-encoded binary from a string.
 */
export interface Base64ExtractionResult {
    buffer: Buffer;
    mimeType: string | null;
    /** File extension (with dot) derived from MIME or magic bytes */
    ext: string;
    source: 'data-url' | 'raw-base64';
}
/**
 * Try to extract base64-encoded binary content from a text string.
 *
 * Handles two forms:
 * 1. Data URLs: `data:<mime>;base64,<payload>`
 * 2. Raw base64 blobs: long strings of base64 characters
 *
 * Two-step verification to minimize false positives:
 * - Charset + structure check (is it plausibly base64?)
 * - Decode + binary verification (are the decoded bytes actually binary?)
 *
 * Returns null if the string doesn't contain extractable base64 binary.
 */
export declare function extractBase64Binary(text: string): Base64ExtractionResult | null;
/** Format bytes to human-readable string. */
export declare function formatBytes(bytes: number): string;
/** Sanitize filename by removing unsafe characters. */
export declare function sanitizeFilename(filename: string): string;
/**
 * Binary download result returned to the agent.
 */
export interface BinaryDownloadResult {
    type: 'file_download';
    path: string;
    filename: string;
    mimeType: string | null;
    size: number;
    sizeHuman: string;
}
/**
 * Error result returned when binary save fails.
 */
export interface BinaryDownloadError {
    type: 'file_download_error';
    error: string;
}
/**
 * Save binary response to session's downloads folder.
 * Uses atomic file creation (O_EXCL) to prevent TOCTOU race conditions.
 */
export declare function saveBinaryResponse(sessionPath: string, filename: string, buffer: Buffer, mimeType: string | null): BinaryDownloadResult | BinaryDownloadError;
