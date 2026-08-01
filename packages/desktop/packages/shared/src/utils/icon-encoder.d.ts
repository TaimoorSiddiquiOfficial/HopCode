/**
 * Icon Encoder Utility
 *
 * Converts icon file paths to base64 data URLs for embedding in session storage.
 * This allows the session viewer (web) to display icons without filesystem access.
 */
export interface EncodeIconOptions {
    /** Resize raster icons to 32x32. Takes (buffer, targetSize), returns PNG buffer. */
    resize?: (buffer: Buffer, targetSize: number) => Buffer | undefined;
}
export interface EncodeIconOptionsAsync {
    /** Async resize raster icons to 32x32. Takes (buffer, targetSize), returns PNG buffer. */
    resize?: (buffer: Buffer, targetSize: number) => Promise<Buffer | undefined>;
}
/**
 * Encode an icon file to a base64 data URL.
 *
 * When a `resize` callback is provided (via options), raster images are resized
 * to 32x32 and cached as `{name}.thumb.png` next to the original. SVGs are
 * always encoded directly (vector = resolution-independent).
 *
 * @param iconPath - Absolute path to the icon file
 * @param options - Optional resize callback for raster images
 * @returns Base64 data URL (e.g., "data:image/png;base64,...") or undefined if encoding fails
 */
export declare function encodeIconToDataUrl(iconPath: string | undefined, options?: EncodeIconOptions): string | undefined;
/**
 * Async variant of encodeIconToDataUrl that supports async resize callbacks (e.g. sharp).
 * Same thumbnail caching behavior as the sync version.
 */
export declare function encodeIconToDataUrlAsync(iconPath: string | undefined, options?: EncodeIconOptionsAsync): Promise<string | undefined>;
/**
 * Get the emoji value if the input is an emoji, otherwise undefined.
 * Used for ToolDisplayMeta where we might want to display emoji as icon.
 */
export declare function getEmojiIcon(value: string | undefined): string | undefined;
