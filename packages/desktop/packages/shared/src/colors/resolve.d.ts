/**
 * Entity Color Resolution
 *
 * Resolves EntityColor values to CSS color strings for inline style application.
 * All entity colors are rendered via inline `style={{ color }}` — no Tailwind
 * color classes, since JIT won't generate classes for runtime-loaded config values.
 *
 * System colors → CSS variable references (auto light/dark via theme)
 * System colors with opacity → color-mix with transparent (works in Chromium)
 * Custom colors → explicit CSS color values based on current theme mode
 */
import { type EntityColor, type SystemColor, type SystemColorName } from './types.ts';
/**
 * Resolve an EntityColor to a CSS color string for inline style application.
 *
 * @param color - The EntityColor value from config
 * @param isDark - Whether the current theme is dark mode
 * @returns CSS color string (e.g., "var(--accent)", "color-mix(...)", "#EF4444")
 *
 * @example
 * // System color (auto light/dark)
 * resolveEntityColor('accent', false) // → "var(--accent)"
 *
 * // System color with opacity
 * resolveEntityColor('foreground/50', false) // → "color-mix(in oklch, var(--foreground) 50%, transparent)"
 *
 * // Custom color
 * resolveEntityColor({ light: '#EF4444', dark: '#F87171' }, true) // → "#F87171"
 */
export declare function resolveEntityColor(color: EntityColor, isDark: boolean): string;
/** Parsed system color: name + optional opacity */
export interface ParsedSystemColor {
    name: SystemColorName;
    opacity?: number;
}
/**
 * Parse a system color string into its components.
 * Returns null if the string is not a valid system color.
 *
 * @example
 * parseSystemColor('accent')        // → { name: 'accent' }
 * parseSystemColor('foreground/50') // → { name: 'foreground', opacity: 50 }
 * parseSystemColor('invalid')       // → null
 */
export declare function parseSystemColor(value: string): ParsedSystemColor | null;
/**
 * Check if a value is a valid SystemColorName.
 */
export declare function isSystemColorName(value: string): value is SystemColorName;
/**
 * Check if an EntityColor value is a system color (string) vs custom color (object).
 */
export declare function isSystemColor(color: EntityColor): color is SystemColor;
/**
 * Auto-derive a dark mode variant from a light mode color.
 * Brightens the color by increasing OKLCH lightness by ~20%.
 *
 * For hex colors, converts to a brighter version.
 * For other formats, returns the original (custom colors should specify dark explicitly).
 */
export declare function deriveDarkVariant(lightColor: string): string;
