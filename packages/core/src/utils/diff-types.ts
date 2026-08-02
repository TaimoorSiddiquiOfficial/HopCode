/**
 * Local type definitions for the `diff` library types we use.
 *
 * We can't import from '@types/diff' (verbatimModuleSyntax rejects @types imports)
 * and we can't import from 'diff' (npm deduplication hoists diff@8 whose bundled
 * .d.ts doesn't export Hunk/ParsedDiff/PatchOptions).
 *
 * These match @types/diff@7's definitions exactly.
 */

export interface DiffHunk {
  oldStart: number;
  oldLines: number;
  newStart: number;
  newLines: number;
  lines: string[];
}

export interface ParsedDiff {
  index?: string | undefined;
  oldFileName?: string | undefined;
  newFileName?: string | undefined;
  oldHeader?: string | undefined;
  newHeader?: string | undefined;
  hunks: DiffHunk[];
}

export interface PatchOptions {
  context?: number | undefined;
  ignoreCase?: boolean | undefined;
  maxEditLength?: number | undefined;
  oneChangePerToken?: boolean | undefined;
  ignoreNewlineAtEof?: boolean | undefined;
  ignoreWhitespace?: boolean | undefined;
  newlineIsToken?: boolean | undefined;
  stripTrailingCr?: boolean | undefined;
}
