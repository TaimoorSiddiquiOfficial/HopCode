/**
 * History Store — single source of truth for automations-history.jsonl writes
 * and compaction.
 *
 * Provides:
 * - `appendAutomationHistoryEntry()` — serialized append, triggers compaction at the global cap
 * - `compactAutomationHistory()` — async two-tier retention (runtime, under mutex)
 * - `compactAutomationHistorySync()` — sync two-tier retention (startup, no mutex needed)
 *
 * Both sync and async compaction share the same pure algorithm (`compactEntries`).
 * All history writes should go through `appendAutomationHistoryEntry` so the mutex
 * prevents concurrent file corruption.
 */
/**
 * Append a history entry to the JSONL file.
 * Triggers compaction when appends since startup reach the global cap.
 *
 * The entry must already be a fully-formed history object (use `createWebhookHistoryEntry`
 * or `createPromptHistoryEntry` from `webhook-utils.ts` to build one).
 */
export declare function appendAutomationHistoryEntry(workspaceRootPath: string, entry: Record<string, unknown>): Promise<void>;
/**
 * Compact the history file asynchronously (runtime path, under mutex).
 */
export declare function compactAutomationHistory(workspaceRootPath: string, maxPerMatcher?: number, maxTotal?: number): Promise<void>;
/**
 * Compact the history file synchronously (startup path).
 * Safe to call without the mutex — startup is single-threaded and runs
 * before any async appends.
 */
export declare function compactAutomationHistorySync(workspaceRootPath: string, maxPerMatcher?: number, maxTotal?: number): void;
