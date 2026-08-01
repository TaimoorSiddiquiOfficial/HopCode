/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { type Span, type Context } from '@opentelemetry/api';
export declare const API_CALL_FAILED_SPAN_STATUS_MESSAGE = "API call failed";
export declare const API_CALL_ABORTED_SPAN_STATUS_MESSAGE = "API call aborted";
export declare function safeSetStatus(span: Span, status: Parameters<Span['setStatus']>[0]): void;
/**
 * Options for {@link withSpan}.
 */
export interface WithSpanOptions {
    /**
     * When true (default), withSpan automatically sets OK status if the
     * callback resolves without having set a status. When false, the caller
     * is responsible for setting a terminal status in every code path.
     * Use false when the callback handles multiple outcomes (success, error,
     * cancellation) and each path sets its own status.
     */
    autoOkOnSuccess?: boolean;
}
/**
 * Run an async function within a new OTel span.
 * When no parent span is active, the span becomes a trace root with a
 * fresh SDK-generated traceId. When the OTel SDK is not initialized,
 * the tracer is a noop.
 *
 * If the callback sets a status explicitly (e.g. ERROR on a handled failure),
 * withSpan will not overwrite it. Only when no status has been set and the
 * callback resolves without throwing will the span be marked OK (unless
 * autoOkOnSuccess is false). If the callback throws before setting status,
 * the span is marked ERROR with a generic message so raw exception text is
 * not exported to OTel backends.
 */
export declare function withSpan<T>(name: string, attributes: Record<string, string | number | boolean>, fn: (span: Span) => Promise<T>, options?: WithSpanOptions): Promise<T>;
/**
 * Start a span manually, returning the span and a function to run code
 * within that span's context.
 *
 * Unlike withSpan, this helper does not automatically set a terminal status
 * or end the span. Callers must set the final status themselves and call
 * span.end() from a finally block. Use runInContext around any eager work
 * that should be parented to this span, and around async-generator iteration
 * when the span must remain active while the consumer pulls values.
 *
 * Example:
 *
 *   const { span, runInContext } = startSpanWithContext('stream', attrs);
 *   try {
 *     return await runInContext(() => doWork());
 *   } catch (error) {
 *     span.setStatus({ code: SpanStatusCode.ERROR, message: 'failed' });
 *     throw error;
 *   } finally {
 *     span.end();
 *   }
 *
 * For a returned stream, put the try/catch/finally in the returned generator
 * wrapper so the span ends when iteration completes, not when the stream is
 * created.
 */
export declare function startSpanWithContext(name: string, attributes: Record<string, string | number | boolean>): {
    span: Span;
    runInContext: <T>(fn: () => T) => T;
};
/**
 * @deprecated No longer used for span parenting — each interaction is now a
 * trace root with its own traceId. Retained for backward compatibility
 * and existing tests.
 */
export declare function createSessionRootContext(sessionId: string): Context;
