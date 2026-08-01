/**
 * Unified Icon Utilities
 *
 * Shared icon handling for skills, sources, and statuses.
 * All three systems use the same icon format and behavior:
 *
 * Supported formats:
 * - Emoji: "🔧" - rendered as text in UI
 * - URL: "https://..." - auto-downloaded to icon.{ext} file
 * - File: icon.svg, icon.png, etc. - auto-discovered in directory
 *
 * Priority: Config value (emoji/URL) > Local file (auto-discovered)
 * Config is the source of truth. Local files are only used when config.icon is undefined.
 *
 * NOT supported (rejected):
 * - Inline SVG: "<svg>...</svg>"
 * - Relative paths: "./icon.svg", "/path/to/icon"
 */
export { EMOJI_REGEX, ICON_EXTENSIONS, isEmoji, isIconUrl, isInvalidIconValue, } from './icon-constants.ts';
/**
 * Validate and normalize an icon value.
 * Returns the value if valid (emoji or URL), undefined if invalid.
 *
 * @param icon - The icon value to validate
 * @param context - Context for debug logging (e.g., "Skills", "Sources", "Statuses")
 */
export declare function validateIconValue(icon: unknown, context?: string): string | undefined;
/**
 * Find icon file in a directory.
 * Returns first matching icon.{svg,png,jpg,jpeg} or undefined.
 */
export declare function findIconFile(dir: string): string | undefined;
/**
 * Download an icon from a URL and save it to a directory.
 * Returns the path to the downloaded icon, or null on failure.
 *
 * @param targetDir - Directory to save the icon to
 * @param iconUrl - URL to download the icon from
 * @param context - Context for debug logging
 * @param filenameBase - Custom filename base (default: 'icon'). Saved as {filenameBase}.{ext}
 */
export declare function downloadIcon(targetDir: string, iconUrl: string, context?: string, filenameBase?: string): Promise<string | null>;
/**
 * Check if an icon needs to be downloaded.
 * Returns true if icon is a URL and no local icon file exists.
 */
export declare function needsIconDownload(iconValue: string | undefined, localIconPath: string | undefined): boolean;
/**
 * Result of resolving an icon for rendering.
 */
export interface ResolvedIcon {
    type: 'file' | 'emoji' | 'url' | 'none';
    /** For file: absolute path. For emoji: the emoji string. For url: the URL. */
    value?: string;
}
/**
 * Resolve an icon for rendering.
 * Config value is the source of truth. Local files are fallback for auto-discovery.
 *
 * Priority:
 * 1. Emoji in config → emoji
 * 2. URL in config → url (caller handles download/display)
 * 3. Local file (auto-discovered) → file
 * 4. None
 *
 * @param iconValue - The icon value from config (emoji or URL)
 * @param localIconPath - Path to local icon file if it exists (auto-discovered)
 */
export declare function resolveIcon(iconValue: string | undefined, localIconPath: string | undefined): ResolvedIcon;
