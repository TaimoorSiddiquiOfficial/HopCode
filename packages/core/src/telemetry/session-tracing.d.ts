/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { type Attributes, type Context, type Span } from '@opentelemetry/api';
import type { Config } from '../config/config.js';
type InteractionStatus = 'ok' | 'error' | 'cancelled';
export interface StartInteractionOptions {
    promptId: string;
    model: string;
    messageType: string;
}
export interface EndInteractionOptions {
    errorMessage?: string;
}
export type InteractionSpanResultStatus = 'ok' | 'error' | 'cancelled';
export interface LLMRequestMetadata {
    inputTokens?: number;
    outputTokens?: number;
    /**
     * Tokens served from the provider's prompt cache (Anthropic
     * cache_read_input_tokens, OpenAI prompt_tokens_details.cached_tokens, etc).
     * Normalized to GenerateContentResponseUsageMetadata.cachedContentTokenCount
     * by each provider generator before reaching LoggingContentGenerator.
     */
    cachedInputTokens?: number;
    success: boolean;
    durationMs?: number;
    error?: string;
    /**
     * Time from the successful attempt's request dispatch to the first stream
     * chunk containing user-visible content (text / functionCall / inlineData /
     * executableCode / thought). Undefined for non-streaming requests, requests
     * aborted before the first user-visible chunk, and any path that does not
     * pass through LoggingContentGenerator's stream wrapper.
     *
     * Semantics: diverges from claude-code's ttftMs (which fires on
     * Anthropic's message_start metadata event). Matches the "time to first
     * actual token" intent of the industry-standard TTFT name.
     * See docs/design/telemetry-llm-request-timing-design.md (D1).
     */
    ttftMs?: number;
    /**
     * Time from `retryWithBackoff` entry to THIS attempt's start (ms). On a
     * successful-attempt span this doubles as the total retry overhead before
     * success. On a failed-attempt span this is the cumulative time elapsed in
     * the retry budget at the moment this attempt fired (= attempts 1..N-1's
     * durations + their backoff sleeps).
     *
     * Undefined when no retry context exists (direct calls bypassing
     * retryWithBackoff: warmup, side-queries, etc.). Populated by the retry
     * layer in Phase 4b via AsyncLocalStorage (`retryContext`).
     */
    requestSetupMs?: number;
    /**
     * 1-based monotonic attempt counter, populated by LoggingContentGenerator
     * from `retryContext.getStore()`. Defaults to 1 when no retry context is
     * present so dashboards filtering `WHERE attempt=1` include direct/warmup
     * calls. Populated by Phase 4b retry layer for attempt >= 2.
     */
    attempt?: number;
    /**
     * Sum of all backoff delays BEFORE this attempt started (ms). 0 for attempt 1.
     * Undefined when no retry context exists. Populated by Phase 4b retry layer.
     */
    retryTotalDelayMs?: number;
    /** Provider response ID (e.g. DashScope request_id / OpenAI completion id). */
    responseId?: string;
    /** Model finish/stop reason (e.g. "STOP", "MAX_TOKENS"). */
    finishReason?: string;
    /**
     * Reasoning/thinking token count. For OpenAI-compatible providers,
     * this value is already INCLUDED in outputTokens (candidatesTokenCount).
     * Do not sum with outputTokens to avoid double-counting.
     */
    thoughtsTokenCount?: number;
    /** Subagent name that originated this request, or undefined for main. */
    subagentName?: string;
    /** Structured error type (e.g. "RateLimitError", "APIConnectionError:ECONNREFUSED"). */
    errorType?: string;
    /** HTTP status code from the provider error response. */
    errorStatusCode?: number;
    /** Config reference for Phase 4c metric recording (recordApiRequestBreakdown). */
    config?: Config;
}
export interface ToolSpanMetadata {
    success?: boolean;
    error?: string;
}
export declare function isInNativeSubagentSpan(): boolean;
/**
 * Bound the size of error strings written to span attributes / status
 * messages. Hook server responses, raw exception stacks, or malicious
 * inputs can be unbounded; some OTel backends drop the entire span when
 * any field exceeds their limit.
 *
 * Truncates by UTF-16 code units (`String.length`/`String.slice`), not
 * bytes — for ASCII-heavy text this approximates a 1KB byte limit, but
 * CJK/emoji-heavy errors can land in the ~2-3KB range after UTF-8
 * encoding. That's still well under all major OTel backends'
 * per-attribute limits (Jaeger ~64KB, Honeycomb ~64KB, OTLP default
 * ~32KB), so we keep the simpler char-count bound rather than paying
 * the encoder cost on every endXSpan.
 */
export declare function truncateSpanError(s: string): string;
export declare function startInteractionSpan(config: Config, options: StartInteractionOptions): void;
export declare function endInteractionSpan(status: InteractionStatus, metadata?: EndInteractionOptions): void;
export declare function withInteractionSpan<T>(config: Config, options: StartInteractionOptions & {
    parentContext?: Context;
}, fn: () => Promise<T>, getResultStatus?: (result: T) => InteractionSpanResultStatus): Promise<T>;
export declare function startLLMRequestSpan(model: string, promptId: string): Span;
export declare function endLLMRequestSpan(span: Span, metadata?: LLMRequestMetadata): void;
export declare function startToolSpan(toolName: string, attrs?: Record<string, string | number | boolean>): Span;
/**
 * Runs a callback within the tool span's AsyncLocalStorage context AND
 * OpenTelemetry context. Use this instead of enterWith() to scope the
 * context to a single async call tree — safe for concurrent tool calls.
 *
 * Setting the OTel context ensures any nested OTel spans/logs emitted
 * during the callback (HTTP instrumentation, hooks, log-bridge spans)
 * inherit the tool span as parent.
 */
export declare function runInToolSpanContext<T>(span: Span, fn: () => T): T;
/**
 * When metadata is omitted, span status is NOT set — callers on failure paths
 * must pre-set status via setToolSpanFailure/setToolSpanCancelled before calling
 * this. This asymmetry with endLLMRequestSpan (which defaults to OK) is intentional:
 * tool spans have multiple failure modes that set status before endToolSpan runs.
 */
export declare function endToolSpan(span: Span, metadata?: ToolSpanMetadata): void;
export declare function startToolExecutionSpan(): Span;
export declare function endToolExecutionSpan(span: Span, metadata?: {
    success?: boolean;
    error?: string;
    /**
     * Mark the execution as user-cancelled: success/error attributes are
     * still recorded but status stays UNSET, mirroring setToolSpanCancelled
     * on the parent tool span. Without this, success: false unconditionally
     * sets ERROR and trace backends filtering for errors false-positive on
     * user cancels.
     */
    cancelled?: boolean;
    /** Extra span attributes recorded verbatim alongside the standard set. */
    attributes?: Attributes;
}): void;
export type ToolBlockedDecision = 'proceed_once' | 'proceed_always' | 'cancel' | 'aborted' | 'auto_approved' | 'error';
export type ToolBlockedSource = 'cli' | 'ide' | 'hook' | 'auto' | 'system';
/**
 * Brackets the time a tool spends in `awaiting_approval` waiting on the user.
 *
 * The parent is passed explicitly because this span starts BEFORE the tool
 * body's `runInToolSpanContext` block — so `toolContext.getStore()` is empty.
 * Passing the span object also avoids the `findLast`-by-type concurrency bug
 * (claude-code's sessionTracing has it; we deliberately don't).
 */
export declare function startToolBlockedOnUserSpan(toolSpan: Span, attrs?: {
    tool_name?: string;
    call_id?: string;
}): Span;
/**
 * Status stays UNSET — waiting on the user is neither OK nor ERROR.
 * The decision/source attributes are the canonical signal.
 */
export declare function endToolBlockedOnUserSpan(span: Span, metadata?: {
    decision?: ToolBlockedDecision;
    source?: ToolBlockedSource;
}): void;
export type HookEvent = 'PreToolUse' | 'PostToolUse' | 'PostToolUseFailure' | 'PostToolBatch';
export interface StartHookSpanOptions {
    hookEvent: HookEvent;
    toolName: string;
    toolUseId?: string;
    /** PostToolUseFailure only: true when the failure is a user interrupt. */
    isInterrupt?: boolean;
}
export interface HookSpanMetadata {
    /** Whether the hook fire site completed without throwing. */
    success?: boolean;
    /** PreToolUse: false means the hook blocked tool execution. */
    shouldProceed?: boolean;
    /** PostToolUse: true means the hook stopped further processing. */
    shouldStop?: boolean;
    /** Discriminator for blocking decision when applicable. */
    blockType?: 'denied' | 'ask' | 'stop';
    hasAdditionalContext?: boolean;
    /** PostToolBatch only: true when the batch hook stopped before the next turn. */
    postBatchStop?: boolean;
    /** PostToolBatch only: reason attached to a stop decision. */
    postBatchStopReason?: string;
    /** Hook threw — span ends as ERROR with this message. */
    error?: string;
}
export declare function startHookSpan(opts: StartHookSpanOptions): Span;
/**
 * Status: UNSET on normal flow (including blocking decisions like
 * shouldProceed: false or shouldStop: true — those are intentional, not
 * errors). Only an actual hook-side throw (caught by the safelyFire wrapper
 * or rethrown) maps to ERROR via the `error` metadata field.
 */
export declare function endHookSpan(span: Span, metadata?: HookSpanMetadata): void;
export type SubagentInvocationKind = 'foreground' | 'fork' | 'background';
export type SubagentStatus = 'completed' | 'failed' | 'cancelled' | 'aborted';
export interface StartSubagentSpanOptions {
    /** Unique identifier for this subagent invocation (e.g. `Explore-abc123`). */
    agentId: string;
    /** Human-readable subagent type (e.g. `Explore`, `code-reviewer`, `fork`). */
    subagentName: string;
    invocationKind: SubagentInvocationKind;
    isBuiltIn: boolean;
    /** Parent agent's id, when this subagent is nested inside another. */
    parentAgentId?: string;
    /** 0 for top-level subagent, +1 per nesting. */
    depth: number;
    /** Parent's request id (for cross-trace correlation with parent prompt). */
    invokingRequestId?: string;
    /** Session id — set as both `gen_ai.conversation.id` and vendor key. */
    sessionId: string;
    /** Model override, if this subagent runs on a different model than parent. */
    modelOverride?: string;
    /**
     * For `fork` / `background` invocations: span context of the invoking
     * span (the parent AGENT tool span). Used as the `Link` source so the
     * new-traceId root can be navigated back to the invoker. Ignored for
     * `foreground` (inherits via context.active()).
     */
    invokerSpanContext?: import('@opentelemetry/api').SpanContext;
}
export interface SubagentSpanMetadata {
    status: SubagentStatus;
    /** Free-form reason (e.g. `task_complete`, `max_iterations`, `user_abort`, `ttl_swept`). */
    terminateReason?: string;
    /** Whether the subagent produced any result text. Bounded boolean (no payload). */
    resultSummaryPresent?: boolean;
    /** Truncated via {@link truncateSpanError} before write. */
    error?: string;
    /** Error class name (e.g. `Error`, `AbortError`). */
    errorType?: string;
}
/**
 * Open a subagent span.
 *
 * - `foreground` invocations become children of the currently-active span
 *   (typically the AGENT tool span), inheriting its traceId.
 * - `fork` / `background` invocations become linked-root spans — new traceId,
 *   with an OTel {@link Link} pointing at `invokerSpanContext`. The OTel
 *   spec explicitly recommends Link for "long running asynchronous data
 *   processing operation that was initiated by [a] fast incoming request"
 *   (`https://opentelemetry.io/docs/specs/otel/overview/#links-between-spans`).
 *   Fire-and-forget subagents run for minutes-to-hours and would otherwise
 *   inflate the parent trace's duration / span count beyond several
 *   backends' caps (e.g. LangSmith's 25k-run cap per trace).
 *
 * Dual-emits the OTel GenAI spec attrs (`gen_ai.agent.id`, `gen_ai.agent.name`,
 * `gen_ai.conversation.id`) alongside vendor `hopcode.subagent.*` keys.
 * Spec is in Development status — dual-emit lets dashboards transition once
 * the spec stabilises; drop the vendor key in a follow-up.
 */
export declare function startSubagentSpan(opts: StartSubagentSpanOptions): Span;
/**
 * Run `fn` with `span` set as the active OTel span. Child LLM / tool /
 * hook spans created inside `fn` will see `span` as parent via
 * `context.active()` and inherit its traceId. Required for fork /
 * background paths so child spans don't escape into the ambient context
 * after the caller's AgentTool.execute has already returned.
 *
 * **Side effects (intentional, callers should be aware):**
 *
 *  - Enters `subagentContext` ALS for the body's duration so
 *    `startLLMRequestSpan` / `startToolSpan` / `startHookSpan` prefer
 *    this subagent over the outer interaction as the parent.
 *  - **Clears `toolContext`** for the body's duration. Any code that
 *    reads `toolContext` inside the subagent body BEFORE the first
 *    inner tool call will see `undefined`. The subagent's own inner
 *    tools re-set `toolContext` via `runInToolSpanContext`, so
 *    inner-tool parenting remains correct. This is required so hooks
 *    fired inside a subagent body (e.g. SubagentStart) don't
 *    incorrectly parent under the outer AGENT tool span (#4410).
 *
 * Mirrors opencode's `withRunSpan` pattern.
 */
export declare function runInSubagentSpanContext<T>(span: Span, fn: () => Promise<T>): Promise<T>;
/**
 * Finalize a subagent span. Status mapping:
 *  - `completed` → SpanStatus OK
 *  - `failed`    → SpanStatus ERROR, sets `exception.message` + `error.type`
 *  - `cancelled` / `aborted` → SpanStatus UNSET (matches Phase 2 cancellation)
 *
 * Idempotent: second call on the same span is a no-op.
 */
export declare function endSubagentSpan(span: Span, metadata: SubagentSpanMetadata): void;
export declare function getActiveInteractionSpan(): Span | undefined;
export declare function clearSessionTracingForTesting(): void;
/**
 * Test-only: invoke the TTL sweep with a synthetic `now`. Lets tests
 * exercise the stale-span path without waiting 30 minutes or stubbing
 * setInterval globally.
 */
export declare function runTTLSweepForTesting(now: number): void;
export {};
