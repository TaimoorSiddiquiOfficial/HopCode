/**
 * View Evaluator
 *
 * Compiles Filtrex expressions into native JS functions (once, on config load)
 * and evaluates them against session context (per render).
 *
 * Architecture:
 *   config load → compileAllViews() → CompiledView[]  (cached)
 *   per render  → evaluateViews(context, compiled) → matching ViewConfig[]
 *
 * Performance: Compilation is one-time overhead; evaluation runs at native JS speed.
 */
import type { ViewConfig, CompiledView, ViewEvaluationContext } from './types.ts';
/**
 * Compile a single view expression into a native JS function.
 * Uses dot notation (tokenUsage.costUsd) and optional chaining (null-safe).
 * Returns null if compilation fails (invalid expression).
 */
export declare function compileView(config: ViewConfig): CompiledView | null;
/**
 * Compile all view configs. Skips invalid expressions with a warning.
 * Call once on config load, then cache the result.
 */
export declare function compileAllViews(configs: ViewConfig[]): CompiledView[];
/**
 * Evaluate all compiled views against a session context.
 * Returns the configs of matching views (expression returned truthy).
 *
 * Each evaluation is a native JS function call — very fast.
 * Errors during evaluation (e.g. runtime type issues) are caught per-view
 * so one broken expression doesn't prevent others from matching.
 */
export declare function evaluateViews(context: ViewEvaluationContext, compiled: CompiledView[]): ViewConfig[];
/**
 * Build an evaluation context from session metadata.
 * Maps the SessionMeta-shaped object to the flat context expected by expressions.
 *
 * This is called once per session per render cycle.
 * The context includes computed fields (hasPendingPlan) derived from raw session data.
 */
export declare function buildViewContext(meta: {
    name?: string;
    preview?: string;
    sessionStatus?: string;
    permissionMode?: string;
    model?: string;
    lastMessageRole?: string;
    lastMessageAt?: number;
    createdAt?: number;
    messageCount?: number;
    isFlagged?: boolean;
    hasUnread?: boolean;
    isProcessing?: boolean;
    labels?: string[];
    tokenUsage?: {
        inputTokens?: number;
        outputTokens?: number;
        totalTokens?: number;
        costUsd?: number;
        contextTokens?: number;
    };
}): ViewEvaluationContext;
