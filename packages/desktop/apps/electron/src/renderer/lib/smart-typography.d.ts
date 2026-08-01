/**
 * Smart Typography - Live text replacement for typographic symbols
 *
 * Transforms trigger when user types a space after the pattern.
 * This avoids complex partial-match handling and feels natural.
 *
 * Supported patterns:
 * - -> → (right arrow)
 * - <- → ← (left arrow)
 * - <-> → ↔ (left-right arrow)
 * - => → ⇒ (double right arrow)
 * - <=> → ⇔ (double bidirectional arrow)
 * - -- → – (en-dash)
 * - ... → … (ellipsis)
 * - != → ≠ (not equal)
 */
interface SmartTypographyResult {
    /** The transformed text */
    text: string;
    /** The adjusted cursor position */
    cursor: number;
    /** Whether a replacement was made */
    replaced: boolean;
}
/**
 * Apply smart typography replacements to text
 *
 * Transforms trigger when user types a space after a pattern.
 * e.g., "hello -> " becomes "hello → "
 *
 * @param text - The current input text
 * @param cursor - The current cursor position
 * @returns Object with transformed text, adjusted cursor, and whether replacement occurred
 */
export declare function applySmartTypography(text: string, cursor: number): SmartTypographyResult;
export {};
