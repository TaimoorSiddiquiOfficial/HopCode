/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type { PartListUnion } from '@google/genai';
import type { Config } from '../config/config.js';
export declare const MAX_SESSION_BYTES: number;
/**
 * Stable prefix every truncated tool output starts with. Used as an
 * idempotency sentinel so content that was already truncated (by a tool's own
 * path — e.g. MCP `truncateTextParts` — or by a prior pass) is not truncated
 * again, which would nest headers and spill a duplicate file.
 */
export declare const TOOL_OUTPUT_TRUNCATED_PREFIX = "Tool output was too large and has been truncated";
/**
 * Truncates large tool output and saves the full content to a temp file.
 * Used by the shell tool to prevent excessively large outputs from being
 * sent to the LLM context.
 *
 * If content length is within the threshold, returns it unchanged.
 * Otherwise, saves full content to a file and returns a truncated version
 * with head/tail lines and a pointer to the saved file.
 */
export declare function truncateAndSaveToFile(content: string, fileName: string, projectTempDir: string, threshold: number, truncateLines: number, keep?: 'head' | 'tail' | 'both'): Promise<{
    content: string;
    outputFile?: string;
}>;
/**
 * High-level truncation helper that reads thresholds from Config,
 * truncates if needed, saves full output to a temp file, and logs
 * telemetry. Returns the (possibly truncated) content and an optional
 * output file path.
 *
 * Callers no longer need to duplicate config extraction, file naming,
 * or telemetry logging.
 */
export declare function truncateToolOutput(config: Config, toolName: string, content: string, limits?: {
    threshold?: number;
    lines?: number;
    keep?: 'head' | 'tail' | 'both';
}, promptId?: string): Promise<{
    content: string;
    outputFile?: string;
}>;
/**
 * Unified truncation entry for the tool scheduler. Handles both string and
 * Part[] `llmContent`:
 *   - string is truncated directly;
 *   - Part[] has its text parts merged and truncated, while media parts
 *     (inlineData/fileData) are preserved verbatim;
 *   - empty output is replaced with a no-output marker;
 *   - already-truncated content passes through unchanged (idempotent).
 */
export declare function truncateLlmContent(config: Config, toolName: string, content: PartListUnion, limits?: {
    threshold?: number;
    lines?: number;
    keep?: 'head' | 'tail' | 'both';
}, promptId?: string): Promise<{
    content: PartListUnion;
    outputFile?: string;
}>;
export declare function isAlreadyTruncated(content: string): boolean;
export interface PersistResult {
    content: string;
    outputFile?: string;
    bytesWritten: number;
}
export declare function persistAndTruncateToolResult(callId: string, toolName: string, content: string, config: Config): Promise<PersistResult>;
