/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { errorLogger } from './logger.js';
import { ErrorCategory, isHopCodeError, UnknownError } from './types.js';
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
export async function withRetry(operation, options = {}) {
    const { maxRetries = 3, initialDelayMs = 1000, maxDelayMs = 30000, backoffMultiplier = 2, retryOnCategories = [ErrorCategory.NETWORK, ErrorCategory.PROVIDER], shouldRetry, onRetry, } = options;
    let lastError;
    let delayMs = initialDelayMs;
    for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
        try {
            return await operation();
        }
        catch (error) {
            lastError = error;
            // Check if we should retry
            const isRetryable = shouldRetry?.(error, attempt) ??
                isRetryableError(error, retryOnCategories);
            if (attempt > maxRetries || !isRetryable) {
                throw error;
            }
            // Log retry attempt
            onRetry?.(error, attempt, delayMs);
            // Wait with exponential backoff
            await sleep(delayMs);
            // Increase delay for next iteration (capped at maxDelayMs)
            delayMs = Math.min(delayMs * backoffMultiplier, maxDelayMs);
        }
    }
    // This should never be reached, but TypeScript needs it
    throw lastError;
}
/**
 * Check if error is retryable based on category.
 */
function isRetryableError(error, retryOnCategories) {
    if (!isHopCodeError(error)) {
        // Unknown errors: retry once as safety net
        return true;
    }
    return error.isRetryable && retryOnCategories.includes(error.category);
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
export async function withFallback(operation, options) {
    const { fallback, fallbackOnCategories = [ErrorCategory.CONFIG, ErrorCategory.NETWORK], shouldFallback, logFallback = true, } = options;
    try {
        return await operation();
    }
    catch (error) {
        const shouldUseFallback = shouldFallback?.(error) ??
            shouldFallbackOnError(error, fallbackOnCategories);
        if (!shouldUseFallback) {
            throw error;
        }
        if (logFallback) {
            errorLogger.warn('Using fallback value', {
                error,
                fallbackReason: 'error_recovery',
            });
        }
        return typeof fallback === 'function' ? fallback() : fallback;
    }
}
/**
 * Check if fallback should be used.
 */
function shouldFallbackOnError(error, fallbackOnCategories) {
    if (!isHopCodeError(error)) {
        // Unknown errors: don't use fallback, let them propagate
        return false;
    }
    return fallbackOnCategories.includes(error.category);
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
export async function withinErrorBoundary(operation, context, options = {}) {
    const { catchCategories, shouldCatch, onError, wrapError } = options;
    try {
        return await operation();
    }
    catch (error) {
        // Check if we should catch this error
        const shouldCatchError = shouldCatch?.(error) ??
            (catchCategories
                ? catchCategories.includes(getErrorCategory(error))
                : true);
        if (!shouldCatchError) {
            throw error;
        }
        // Log/handle error
        await onError?.(error, context);
        // Wrap error if configured
        if (wrapError) {
            throw new UnknownError(`${wrapError.message}: ${getErrorMessage(error)}`, error, wrapError.code, wrapError.category, { operation: context.operation, ...context.metadata });
        }
        throw error;
    }
}
/**
 * Get error category from unknown error.
 */
function getErrorCategory(error) {
    return isHopCodeError(error) ? error.category : ErrorCategory.INTERNAL;
}
/**
 * Get error message from unknown error.
 */
function getErrorMessage(error) {
    if (error instanceof Error) {
        return error.message;
    }
    return String(error);
}
/**
 * Sleep for specified milliseconds.
 * Uses Promise-based delay that works with Vitest fake timers.
 */
function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
//# sourceMappingURL=handlers.js.map