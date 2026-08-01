/**
 * Session Label Resolver
 *
 * Pure resolver used by set_session_labels (and anywhere else that needs to
 * validate user-supplied label strings against the workspace's configured
 * label tree).
 *
 * Accepts plain IDs (`"bug"`), display names (`"Bug"`), and valued entries
 * (`"priority::3"`, `"due::2026-01-30"`). Preserves the original value part
 * verbatim so downstream storage can parse it via `parseLabelEntry()`.
 *
 * Validation rules:
 *   1. Base ID must match a configured label by ID or case-insensitive name.
 *   2. Valued input (`id::value`) is only accepted when the matched label
 *      has `valueType` configured — boolean labels refuse values outright.
 *   3. When `valueType` is set, the raw value is checked against that type
 *      via `validateLabelValue()` (strict: `"priority::high"` fails on
 *      `valueType: number`).
 *
 * Rejections come with a per-entry `reason` string so the handler can
 * surface a clear message to the caller.
 */
import type { LabelConfig } from './types.ts';
export interface ResolveLabelsResult {
    /** Canonical label entries ready for storage (ID form, preserving `::value`). */
    resolved: string[];
    /** Inputs that couldn't be resolved. */
    unknown: string[];
    /** All valid label IDs — included in error messages. */
    available: string[];
    /** Per-input explanation keyed by the original input string. */
    reasons: Record<string, string>;
}
export declare function resolveSessionLabels(inputs: string[], labels: LabelConfig[]): ResolveLabelsResult;
