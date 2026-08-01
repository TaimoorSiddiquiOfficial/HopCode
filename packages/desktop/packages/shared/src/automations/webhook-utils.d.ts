/**
 * Webhook Execution Utilities
 *
 * Shared webhook HTTP execution logic used by both the production WebhookHandler
 * and the RPC test handler. Centralizes timeout, body consumption, request building,
 * env var expansion, and retry logic so the two code paths can't diverge.
 */
import type { WebhookAction, WebhookActionResult } from './types.ts';
/**
 * Redact a URL for safe logging. Webhook URLs may contain secrets
 * (e.g., Slack webhook paths). Keep scheme + host, truncate long paths.
 */
export declare function redactUrl(url: string): string;
/**
 * Create a webhook history entry for appending to the history JSONL file.
 */
export declare function createWebhookHistoryEntry(opts: {
    matcherId: string;
    ok: boolean;
    method?: string;
    url: string;
    statusCode: number;
    durationMs: number;
    attempts?: number;
    error?: string;
    responseBody?: string;
}): Record<string, unknown>;
/**
 * Create a prompt-action history entry for appending to the history JSONL file.
 */
export declare function createPromptHistoryEntry(opts: {
    matcherId: string;
    ok: boolean;
    sessionId?: string;
    prompt?: string;
    error?: string;
}): Record<string, unknown>;
/**
 * Return a copy of a WebhookAction with all env-expandable string fields resolved.
 * Used before enqueueing for deferred retry so the retry scheduler doesn't need
 * the original event environment.
 */
export declare function expandWebhookAction(action: WebhookAction, env: Record<string, string>): WebhookAction;
export interface RetryConfig {
    /** Max retry attempts (default: 0 = no retry) */
    maxAttempts: number;
    /** Initial delay in ms (default: 1000). Doubles each attempt. */
    initialDelayMs?: number;
    /** Max delay cap in ms (default: 10000) */
    maxDelayMs?: number;
}
export interface ExecuteWebhookOptions {
    /** Timeout in milliseconds (default: 30000) */
    timeoutMs?: number;
    /** Environment variables for $VAR expansion. If undefined, no expansion is performed (raw mode for tests) */
    env?: Record<string, string>;
    /** Retry config for transient failures. Disabled by default. */
    retry?: RetryConfig;
}
/**
 * Execute a single webhook HTTP request.
 *
 * Handles: request building, env var expansion, timeout via AbortController,
 * response body consumption (prevents memory leaks), and error wrapping.
 * Includes durationMs in the result for observability.
 *
 * @param action - The webhook action definition from automations config
 * @param options - Execution options (timeout, env vars for expansion)
 * @returns WebhookActionResult with status, success flag, timing, and any error
 */
export declare function executeWebhookRequest(action: WebhookAction, options?: ExecuteWebhookOptions): Promise<WebhookActionResult>;
/**
 * Determine if a webhook result represents a transient failure worth retrying.
 * - 5xx server errors: likely transient
 * - Timeout / connection errors (statusCode 0): likely transient
 * - 4xx client errors: not retryable (bad request, auth issues, etc.)
 * - 2xx success: obviously not
 */
export declare function isTransientFailure(result: WebhookActionResult): boolean;
/**
 * Execute a webhook request with optional retry for transient failures.
 *
 * Wraps executeWebhookRequest with exponential backoff + jitter.
 * If retry is not configured (or maxAttempts=0), behaves identically to executeWebhookRequest.
 *
 * @param action - The webhook action definition
 * @param options - Execution options including retry config
 * @returns WebhookActionResult with attempts count and total duration
 */
export declare function executeWithRetry(action: WebhookAction, options?: ExecuteWebhookOptions): Promise<WebhookActionResult>;
