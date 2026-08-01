/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { ErrorCategory } from './types.js';
/**
 * Retry configuration.
 */
export interface RetryOptions {
    /** Maximum number of retry attempts (default: 3) */
    maxRetries?: number;
    /** Initial delay in ms (default: 1000) */
    initialDelayMs?: number;
    /** Maximum delay in ms (default: 30000) */
    maxDelayMs?: number;
    /** Backoff multiplier (default: 2) */
    backoffMultiplier?: number;
    /** Only retry on these error categories (default: [NETWORK, PROVIDER]) */
    retryOnCategories?: ErrorCategory[];
    /** Custom retry predicate */
    shouldRetry?: (error: unknown, attempt: number) => boolean;
    /** Callback on each retry */
    onRetry?: (error: unknown, attempt: number, delayMs: number) => void;
}
/**
 * Executes an async operation with retry logic.
 *
 * @example
 * ```ts
 * const result = await withRetry(
 *   () => fetchFromProvider(),
 *   { maxRetries: 3, initialDelayMs: 1000 }
 * );
 * ```
 */
export declare function withRetry<T>(operation: () => Promise<T>, options?: RetryOptions): Promise<T>;
/**
 * Fallback configuration.
 */
export interface FallbackOptions<T> {
    /** Fallback value or factory */
    fallback: T | (() => T);
    /** Only use fallback on these error categories */
    fallbackOnCategories?: ErrorCategory[];
    /** Custom fallback predicate */
    shouldFallback?: (error: unknown) => boolean;
    /** Log fallback usage (default: true) */
    logFallback?: boolean;
}
/**
 * Executes an async operation with fallback.
 *
 * @example
 * ```ts
 * const config = await withFallback(
 *   () => fetchRemoteConfig(),
 *   { fallback: getDefaultConfig() }
 * );
 * ```
 */
export declare function withFallback<T>(operation: () => Promise<T>, options: FallbackOptions<T>): Promise<T>;
/**
 * Error boundary configuration.
 */
export interface ErrorBoundaryOptions {
    /** Error categories to catch (default: all) */
    catchCategories?: ErrorCategory[];
    /** Custom error predicate */
    shouldCatch?: (error: unknown) => boolean;
    /** Transform caught error */
    onError?: (error: unknown, context: ErrorContext) => void | Promise<void>;
    /** Wrap error in custom HopCodeError */
    wrapError?: {
        code: string;
        message: string;
        category: ErrorCategory;
    };
}
export interface ErrorContext {
    operation: string;
    metadata?: Record<string, unknown>;
}
/**
 * Executes an async operation within an error boundary.
 *
 * @example
 * ```ts
 * const result = await withinErrorBoundary(
 *   () => executeTool(toolName, args),
 *   {
 *     operation: 'tool-execution',
 *     onError: (error) => logTelemetry(error),
 *     wrapError: { code: 'TOOL_FAILED', message: 'Tool execution failed', category: ErrorCategory.TOOL }
 *   }
 * );
 * ```
 */
export declare function withinErrorBoundary<T>(operation: () => Promise<T>, context: ErrorContext, options?: ErrorBoundaryOptions): Promise<T>;
