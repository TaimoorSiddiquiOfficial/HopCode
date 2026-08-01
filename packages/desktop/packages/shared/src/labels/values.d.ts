/**
 * Label Value Utilities
 *
 * Parser and formatter for label entries that carry typed values.
 * Session labels are stored as flat strings: "bug" (boolean) or "priority::3" (valued).
 * The :: separator splits label ID from value. Values are type-inferred at parse time.
 *
 * Value type inference order:
 * 1. ISO date (YYYY-MM-DD) → Date
 * 2. Finite number → number
 * 3. Everything else → string
 */
import type { ParsedLabelEntry } from './types.ts';
/**
 * Parse a session label entry into its structured form.
 * Splits on the first :: only (values may themselves contain ::).
 *
 * Examples:
 *   "bug"                  → { id: "bug" }
 *   "priority::3"          → { id: "priority", rawValue: "3", value: 3 }
 *   "due::2026-01-30"      → { id: "due", rawValue: "2026-01-30", value: Date }
 *   "url::https://a::b"    → { id: "url", rawValue: "https://a::b", value: "https://a::b" }
 */
export declare function parseLabelEntry(entry: string): ParsedLabelEntry;
/**
 * Format a label ID and optional value into the stored string form.
 * Handles Date serialization to ISO date string (YYYY-MM-DD).
 *
 * Examples:
 *   formatLabelEntry("bug")              → "bug"
 *   formatLabelEntry("priority", 3)      → "priority::3"
 *   formatLabelEntry("due", new Date())  → "due::2026-01-23"
 *   formatLabelEntry("link", "https://") → "link::https://"
 */
export declare function formatLabelEntry(id: string, value?: string | number | Date): string;
/**
 * Quick extraction of label ID from an entry string.
 * Use this when you only need the ID (e.g., for validation/filtering)
 * without the overhead of full parsing.
 *
 * "priority::3" → "priority"
 * "bug"         → "bug"
 */
export declare function extractLabelId(entry: string): string;
/**
 * Check whether `rawValue` is well-formed for the declared `valueType`.
 *
 * - `string` — always valid
 * - `number` — matches DECIMAL_NUMBER_REGEX (rejects hex/octal/scientific)
 * - `date`   — ISO date (YYYY-MM-DD) or datetime (YYYY-MM-DDTHH:mm), with a
 *              round-trip check so `2026-02-29` doesn't silently clamp.
 *
 * Used by resolveSessionLabels to reject malformed values like `"priority::high"`
 * when the label is configured with `valueType: "number"`.
 */
export declare function validateLabelValue(rawValue: string, valueType: 'string' | 'number' | 'date'): boolean;
/**
 * Format a raw label value for human-readable display.
 * Dates get locale-formatted (e.g. "Jan 30, 2026"), numbers and strings pass through.
 * Used by UI badge components to render the value portion after the interpunct.
 */
export declare function formatDisplayValue(rawValue: string, valueType?: 'string' | 'number' | 'date'): string;
