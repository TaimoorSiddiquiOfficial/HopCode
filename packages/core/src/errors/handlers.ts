/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */

import { errorLogger } from './logger.js';
import { ErrorCategory, isHopCodeError, UnknownError } from './types.js';

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
export async function withRetry<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {},
): Promise<T> {
  const {
    maxRetries = 3,
    initialDelayMs = 1000,
    maxDelayMs = 30000,
    backoffMultiplier = 2,
    retryOnCategories = [ErrorCategory.NETWORK, ErrorCategory.PROVIDER],
    shouldRetry,
    onRetry,
  } = options;

  let lastError: unknown;
  let delayMs = initialDelayMs;

  for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      // Check if we should retry
      const isRetryable =
        shouldRetry?.(error, attempt) ??
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
function isRetryableError(
  error: unknown,
  retryOnCategories: ErrorCategory[],
): boolean {
  if (!isHopCodeError(error)) {
    // Unknown errors: retry once as safety net
    return true;
  }

  return error.isRetryable && retryOnCategories.includes(error.category);
}

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
export async function withFallback<T>(
  operation: () => Promise<T>,
  options: FallbackOptions<T>,
): Promise<T> {
  const {
    fallback,
    fallbackOnCategories = [ErrorCategory.CONFIG, ErrorCategory.NETWORK],
    shouldFallback,
    logFallback = true,
  } = options;

  try {
    return await operation();
  } catch (error) {
    const shouldUseFallback =
      shouldFallback?.(error) ??
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

    return typeof fallback === 'function' ? (fallback as () => T)() : fallback;
  }
}

/**
 * Check if fallback should be used.
 */
function shouldFallbackOnError(
  error: unknown,
  fallbackOnCategories: ErrorCategory[],
): boolean {
  if (!isHopCodeError(error)) {
    // Unknown errors: don't use fallback, let them propagate
    return false;
  }

  return fallbackOnCategories.includes(error.category);
}

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
export async function withinErrorBoundary<T>(
  operation: () => Promise<T>,
  context: ErrorContext,
  options: ErrorBoundaryOptions = {},
): Promise<T> {
  const { catchCategories, shouldCatch, onError, wrapError } = options;

  try {
    return await operation();
  } catch (error) {
    // Check if we should catch this error
    const shouldCatchError =
      shouldCatch?.(error) ??
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
      throw new UnknownError(
        `${wrapError.message}: ${getErrorMessage(error)}`,
        error,
        wrapError.code,
        wrapError.category,
        { operation: context.operation, ...context.metadata },
      );
    }

    throw error;
  }
}

/**
 * Get error category from unknown error.
 */
function getErrorCategory(error: unknown): ErrorCategory {
  return isHopCodeError(error) ? error.category : ErrorCategory.INTERNAL;
}

/**
 * Get error message from unknown error.
 */
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

/**
 * Sleep for specified milliseconds.
 * Uses Promise-based delay that works with Vitest fake timers.
 */
function sleep(ms: number): Promise<void> {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}
