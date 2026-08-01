/**
 * Tool Result Parsers
 *
 * Shared utilities for parsing tool results from agent tools.
 * Used by both Electron and viewer apps for consistent overlay display.
 */
import type { ActivityItem } from '../components/chat/TurnCard';
import type { ToolType } from '../components/terminal/TerminalOutput';
export interface ReadResult {
    content: string;
    numLines?: number;
    startLine?: number;
    totalLines?: number;
}
/**
 * Parse Read tool JSON result to extract file content and metadata.
 */
export declare function parseReadResult(rawContent: string): ReadResult;
export interface BashResult {
    output: string;
    exitCode?: number;
}
/**
 * Parse Bash tool JSON result to extract output and exit code.
 */
export declare function parseBashResult(rawContent: string): BashResult;
export interface GrepResult {
    output: string;
    description: string;
    command: string;
}
/**
 * Parse Grep tool JSON result to extract search results.
 */
export declare function parseGrepResult(rawContent: string, pattern: string, searchPath: string, outputMode: string): GrepResult;
export interface GlobResult {
    output: string;
    description: string;
    command: string;
}
/**
 * Parse Glob tool JSON result to extract file list.
 */
export declare function parseGlobResult(rawContent: string, pattern: string, searchPath: string): GlobResult;
/**
 * Parse WebSearch tool result to format embedded JSON links properly.
 * Converts raw JSON arrays in "Links: [...]" to formatted markdown lists.
 * Handles multiple Links sections in a single result.
 */
export declare function parseWebSearchResult(rawContent: string): string;
export interface CodeOverlayData {
    type: 'code';
    filePath: string;
    content: string;
    mode: 'read' | 'write';
    startLine?: number;
    totalLines?: number;
    numLines?: number;
    error?: string;
    /** Original shell command (for Codex reads) - displayed in overlay */
    command?: string;
}
export interface TerminalOverlayData {
    type: 'terminal';
    command: string;
    output: string;
    exitCode?: number;
    toolType: ToolType;
    description: string;
    error?: string;
}
export interface GenericOverlayData {
    type: 'generic';
    content: string;
    title: string;
    error?: string;
}
export interface JSONOverlayData {
    type: 'json';
    data: unknown;
    rawContent: string;
    title: string;
    error?: string;
}
/** Rendered markdown document — used for Write tool results on .md/.txt files */
export interface DocumentOverlayData {
    type: 'document';
    content: string;
    filePath: string;
    /** Tool that produced this content (e.g. "Write") — used for the header type badge */
    toolName: string;
    error?: string;
}
export type OverlayData = CodeOverlayData | TerminalOverlayData | GenericOverlayData | JSONOverlayData | DocumentOverlayData;
/** Generic overlay card model (tab item) for activity details. */
export interface OverlayCard {
    /** Stable card identifier (e.g. input, output, metadata) */
    id: string;
    /** Display label shown in card navigator */
    label: string;
    /** Card payload rendered by overlay */
    data: OverlayData;
    /** Optional CLI-style command preview (shown on Input cards) */
    commandPreview?: string;
}
/**
 * Extract overlay data from an activity item.
 * Returns typed data for rendering the appropriate overlay component.
 */
export declare function extractOverlayData(activity: ActivityItem): OverlayData | null;
/** Build a deterministic, Bash-like command preview from tool name + input. */
export declare function formatToolCommandPreview(toolName: string | undefined, input: Record<string, unknown> | undefined): string | undefined;
/**
 * Extract one or more overlay cards from an activity.
 *
 * Current cards:
 * - Input: toolInput (when present)
 * - Output: parsed tool result/content (when meaningful)
 *
 * This intentionally returns an array to support future card types
 * without changing the overlay contract.
 */
export declare function extractOverlayCards(activity: ActivityItem): OverlayCard[];
