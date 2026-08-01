/**
 * Summarization utilities — DEPRECATED
 *
 * Constants, types, and summarization logic have moved to large-response.ts.
 * This file is kept only for resetSummarizationClient() (no-op, used by sessions.ts).
 *
 * New code should import from './large-response.ts' instead.
 */
/**
 * Reset the cached summarization client.
 * @deprecated No-op. Summarization now goes through agent.runMiniCompletion().
 */
export declare function resetSummarizationClient(): void;
