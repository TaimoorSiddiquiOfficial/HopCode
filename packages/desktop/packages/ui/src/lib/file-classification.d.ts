/**
 * File type classification for the link interceptor.
 *
 * Classifies file paths by extension to determine whether the app can show
 * an in-app preview overlay, and if so, which type of preview to use.
 * Used by useLinkInterceptor to decide between in-app preview vs. opening externally.
 */
/** Preview types that map to specific overlay components */
export type FilePreviewType = 'image' | 'code' | 'markdown' | 'json' | 'text' | 'pdf';
export interface FileClassification {
    /** The preview type, or null if no in-app preview is available */
    type: FilePreviewType | null;
    /** Whether the file can be previewed in-app */
    canPreview: boolean;
}
/**
 * Classify a file path by extension to determine preview capability.
 *
 * Priority order when an extension matches multiple sets (e.g. svg):
 * image > code > markdown > json > text > pdf
 */
export declare function classifyFile(filePath: string): FileClassification;
/**
 * Regex alternation of all known file extensions (e.g. "ts|tsx|js|...").
 * Derived from the classification sets above so link detection stays in sync
 * with preview support automatically.
 */
export declare const FILE_EXTENSIONS_PATTERN: string;
