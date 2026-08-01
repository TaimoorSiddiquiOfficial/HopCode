/**
 * ANSI escape code parsing utilities for terminal output.
 */
/**
 * ANSI color code to CSS color mapping
 * Supports both foreground (30-37, 90-97) and background (40-47, 100-107) colors
 */
export declare const ANSI_COLORS: Record<number, string>;
export interface AnsiSpan {
    text: string;
    fg?: string;
    bg?: string;
    bold?: boolean;
}
/**
 * Parse ANSI escape codes and convert to styled spans
 */
export declare function parseAnsi(input: string): AnsiSpan[];
/**
 * Strip ANSI escape codes from text (for copying)
 */
export declare function stripAnsi(input: string): string;
/**
 * Check if output looks like grep content output (with line numbers)
 * Pattern: starts with lines like "123:" (match) or "123-" (context)
 */
export declare function isGrepContentOutput(output: string): boolean;
export interface GrepLine {
    lineNum: string;
    isMatch: boolean;
    content: string;
}
/**
 * Parse grep content output into structured lines
 */
export declare function parseGrepOutput(output: string): GrepLine[];
