/**
 * Large Response Handling Utility
 *
 * Centralized save + prompt building + formatting for large tool results.
 * Follows the title-generator.ts pattern: pure functions only, no SDK/LLM calls.
 *
 * Callers orchestrate via their agent's runMiniCompletion() for summarization.
 */
/** Token limit for summarization trigger (roughly ~60KB of text) */
export declare const TOKEN_LIMIT = 15000;
/** Max tokens to send for summarization (~400KB). Beyond this, save to file + preview only. */
export declare const MAX_SUMMARIZATION_INPUT = 100000;
/** Canonical subfolder under session dir for full tool results */
export declare const LONG_RESPONSES_DIR = "long_responses";
/**
 * Estimate token count from text length (rough approximation: 4 chars per token)
 */
export declare function estimateTokens(text: string): number;
export interface SaveResult {
    /** Absolute path for Read/Grep access */
    absolutePath: string;
    /** Relative path from session dir (e.g. "long_responses/2026-02-09_gmail_users_me.txt") for transform_data */
    relativePath: string;
}
/**
 * Save large response to the session's long_responses/ folder.
 * Creates the folder if it doesn't exist.
 *
 * @param sessionPath - Path to the session folder
 * @param toolName - Name of the tool (e.g., "gmail", "api_stripe")
 * @param label - Additional label for the filename (e.g., API path)
 * @param content - The full response content to save
 * @returns Absolute and relative paths to the saved file
 */
export declare function saveLargeResponse(sessionPath: string, toolName: string, label: string, content: string): SaveResult | null;
export interface SummarizationContext {
    /** Tool or API name */
    toolName: string;
    /** Optional endpoint/path for API calls */
    path?: string;
    /** Tool input parameters */
    input?: Record<string, unknown>;
    /** The model's stated intent before calling the tool */
    intent?: string;
    /** The user's original request (fallback context) */
    userRequest?: string;
}
/**
 * Build the prompt for summarizing a large tool result.
 * Pure function — no SDK calls.
 *
 * @param text - The large response text
 * @param context - Context about the tool call
 * @returns Prompt string ready for runMiniCompletion()
 */
export declare function buildSummarizationPrompt(text: string, context: SummarizationContext): string;
export interface FormatOptions {
    estimatedTokens: number;
    /** Relative path from session dir (for transform_data reference) */
    relativePath: string;
    /** Absolute path (for Read/Grep reference) */
    absolutePath: string;
    /** Summary from runMiniCompletion (if available) */
    summary?: string;
    /** Fallback preview when no summary (first N chars of response) */
    preview?: string;
}
/**
 * Format the message the model sees for a large response.
 * Includes file references for both Read/Grep and transform_data access.
 */
export declare function formatLargeResponseMessage(opts: FormatOptions): string;
export interface HandleLargeResponseOptions {
    /** Full response text */
    text: string;
    /** Path to the session folder */
    sessionPath: string;
    /** Context about the tool call */
    context: SummarizationContext;
    /** Optional summarize callback — typically agent.runMiniCompletion.bind(agent) */
    summarize?: (prompt: string) => Promise<string | null>;
}
export interface HandleLargeResponseResult {
    /** Formatted message for the model */
    message: string;
    /** Absolute path to saved file */
    filePath: string;
    /** Whether the response was summarized (vs preview-only) */
    wasSummarized: boolean;
}
/**
 * Thin guard wrapper: returns the replacement text if the result is too large
 * or contains binary data, or null if the result should be passed through as-is.
 *
 * Accepts string | Buffer:
 * - Buffer: binary detection on raw bytes (preserves data integrity for file saving).
 *   Used by api-tools which has raw HTTP response buffers.
 * - string: binary detection via Buffer conversion. Used by MCP pool and backend adapters
 *   where data is already a string.
 *
 * Pipeline: binary check → (if text) size check → save + summarize.
 *
 * Shared by McpClientPool.callTool(), api-tools.ts, and backend agents.
 */
export declare function guardLargeResult(input: string | Buffer, opts: {
    sessionPath: string;
    toolName: string;
    input?: Record<string, unknown>;
    intent?: string;
    summarize?: (prompt: string) => Promise<string | null>;
}): Promise<string | null>;
/**
 * Full pipeline: save to disk, optionally summarize, format result message.
 *
 * Call this when a tool result exceeds TOKEN_LIMIT.
 * If `summarize` callback is provided and tokens are within MAX_SUMMARIZATION_INPUT,
 * it will be called with the built prompt. Otherwise falls back to preview.
 *
 * @returns Formatted result, or null if the text is not large enough to handle
 */
export declare function handleLargeResponse(opts: HandleLargeResponseOptions): Promise<HandleLargeResponseResult | null>;
