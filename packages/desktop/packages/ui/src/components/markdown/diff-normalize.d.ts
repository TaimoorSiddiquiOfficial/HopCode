/**
 * Normalize a raw diff body (as found in a ```diff markdown code block) into a
 * unified diff shape that @pierre/diffs' PatchDiff can parse.
 *
 * - Already-valid single-file unified/git diffs are returned byte-identically.
 * - Valid numbered hunks without file headers get placeholder headers prepended.
 * - Bare or malformed @@ marker lines are collapsed into a single synthetic hunk.
 */
export declare function ensureUnifiedDiffFormat(raw: string): string;
