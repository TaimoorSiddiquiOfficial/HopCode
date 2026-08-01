/**
 * Auto-Label Value Normalization
 *
 * Normalizes raw extracted values based on the label's valueType.
 * Called after regex capture groups are substituted into the valueTemplate.
 *
 * Normalization rules:
 * - string: pass-through (no transformation)
 * - number: strip commas, expand suffixes (k/K → ×1000, M → ×1000000)
 * - date: pass-through (regex captures already produce ISO format)
 */
/**
 * Normalize a raw extracted value based on the target label's valueType.
 * Returns the normalized string ready for storage in the session label entry.
 *
 * @param raw - Raw value string from regex valueTemplate substitution
 * @param valueType - The label's declared valueType (determines normalization strategy)
 */
export declare function normalizeValue(raw: string, valueType?: 'string' | 'number' | 'date'): string;
