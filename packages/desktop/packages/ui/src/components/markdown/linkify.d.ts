interface DetectedLink {
    type: 'url' | 'email' | 'file';
    text: string;
    url: string;
    start: number;
    end: number;
}
/**
 * Detect all links (URLs, emails, file paths) in text
 */
export declare function detectLinks(text: string): DetectedLink[];
/**
 * Check if a URL looks like a placeholder/fabricated URL.
 * Returns true for URLs containing path segments like `/...`
 */
export declare function isPlaceholderUrl(url: string): boolean;
/**
 * Preprocess text to convert raw URLs and file paths into markdown links
 * Skips code blocks and already-linked content
 */
export declare function preprocessLinks(text: string): string;
/**
 * Test if text contains any detectable links
 * Useful for optimization - skip preprocessing if no links present
 */
export declare function hasLinks(text: string): boolean;
/**
 * Check whether a markdown anchor target should be treated as a local file path.
 * Used by click handlers to route local paths to onFileClick instead of onUrlClick.
 */
export declare function isFilePathTarget(target: string): boolean;
export {};
