/**
 * RetryScheduler - Persistent retry queue for failed webhooks
 *
 * When immediate retries (seconds-scale) are exhausted and a webhook still fails,
 * it's added to a persistent JSONL queue file. The scheduler checks the queue
 * every 60 seconds and retries at increasing intervals:
 *   - 1st deferred: 5 minutes
 *   - 2nd deferred: 30 minutes
 *   - 3rd deferred: 1 hour
 *
 * After all deferred attempts fail, the entry is removed and a final history
 * entry is written. Queue entries survive app restarts.
 */
import type { WebhookAction } from './types.ts';
export interface RetryQueueEntry {
    /** Unique entry ID */
    id: string;
    /** Matcher ID (for history correlation) */
    matcherId: string;
    /** The webhook action with expanded values (no env vars needed at retry time) */
    action: WebhookAction;
    /** Expanded URL (post-env-expansion) for safe logging */
    expandedUrl: string;
    /** Number of deferred attempts already made (0 = first deferred pending) */
    deferredAttempt: number;
    /** Timestamp when the next retry should happen */
    nextRetryAt: number;
    /** Timestamp when this entry was created */
    createdAt: number;
    /** Last error message */
    lastError?: string;
}
export interface RetrySchedulerOptions {
    workspaceRootPath: string;
}
export declare class RetryScheduler {
    private readonly workspaceRootPath;
    private timer;
    private processing;
    constructor(options: RetrySchedulerOptions);
    /**
     * Start the scheduler. Checks queue every minute.
     */
    start(): void;
    /**
     * Stop the scheduler and clean up.
     */
    dispose(): void;
    /**
     * Enqueue a failed webhook for deferred retry.
     * Called by WebhookHandler when immediate retries are exhausted.
     */
    enqueue(matcherId: string, action: WebhookAction, expandedUrl: string, lastError?: string): Promise<void>;
    /**
     * Process the queue: read entries, retry those that are due, rewrite the queue.
     */
    private tick;
}
