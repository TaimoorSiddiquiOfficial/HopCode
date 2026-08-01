/**
 * Icon Constants
 *
 * Pure constants and functions for icon handling.
 * NO Node.js dependencies - safe for browser/renderer import.
 *
 * These are extracted from icon.ts so renderer code can import them
 * without pulling in fs/path dependencies.
 */
/**
 * Comprehensive emoji detection regex.
 * Matches single emoji, emoji sequences, and multi-codepoint emoji (e.g., 👨‍💻).
 */
export declare const EMOJI_REGEX: RegExp;
/**
 * Supported icon file extensions in priority order.
 */
export declare const ICON_EXTENSIONS: string[];
/**
 * Check if a string is an emoji (single or multi-codepoint).
 * Examples: "🔧", "👨‍💻", "🎉"
 */
export declare function isEmoji(str: string | undefined): boolean;
/**
 * Check if a string is a valid icon URL (http or https).
 */
export declare function isIconUrl(str: string): boolean;
/**
 * Check if an icon value is invalid (inline SVG or relative path).
 * These are explicitly not supported to keep configs clean.
 */
export declare function isInvalidIconValue(str: string): boolean;
