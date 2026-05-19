/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { withRetry, withFallback, withinErrorBoundary } from './handlers.js';
import {
  HopCodeError,
  ErrorCategory,
  NetworkErrors,
  ProviderErrors,
  ConfigErrors,
  NetworkError,
} from './types.js';
import { errorLogger } from './logger.js';

describe('withRetry', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('succeeds on first attempt', async () => {
    const operation = vi.fn().mockResolvedValue('success');

    const result = withRetry(operation);

    // Fast-forward timers
    await vi.runAllTimersAsync();

    expect(await result).toBe('success');
    expect(operation).toHaveBeenCalledTimes(1);
  });

  it('retries on network error and succeeds', async () => {
    const operation = vi
      .fn()
      .mockRejectedValueOnce(NetworkErrors.connectionRefused('api.example.com'))
      .mockRejectedValueOnce(NetworkErrors.timeout('api.example.com', 5000))
      .mockResolvedValueOnce('success');

    const result = withRetry(operation, {
      maxRetries: 3,
      initialDelayMs: 100,
    });

    // Fast-forward timers
    await vi.runAllTimersAsync();

    expect(await result).toBe('success');
    expect(operation).toHaveBeenCalledTimes(3);
  });

  it('retries on provider error (rate limited)', async () => {
    const operation = vi
      .fn()
      .mockRejectedValueOnce(ProviderErrors.rateLimited('openai'))
      .mockResolvedValueOnce('success');

    const result = withRetry(operation, {
      maxRetries: 3,
      initialDelayMs: 100,
    });

    await vi.runAllTimersAsync();

    expect(await result).toBe('success');
    expect(operation).toHaveBeenCalledTimes(2);
  });

  it('fails after max retries', async () => {
    const operation = vi.fn().mockImplementation(async () => {
      throw NetworkErrors.connectionRefused('api.example.com');
    });

    const promise = withRetry(operation, {
      maxRetries: 2,
      initialDelayMs: 100,
    });

    await vi.runAllTimersAsync();

    await expect(promise).rejects.toThrow('Connection refused');

    expect(operation).toHaveBeenCalledTimes(3); // 1 initial + 2 retries
  });

  it('does not retry on non-retryable error category', async () => {
    const operation = vi
      .fn()
      .mockRejectedValue(ConfigErrors.invalidConfig('bad config', 'reason'));

    await expect(
      withRetry(operation, {
        maxRetries: 3,
        initialDelayMs: 100,
      }),
    ).rejects.toThrow('Invalid config');
    expect(operation).toHaveBeenCalledTimes(1); // No retries
  });

  it('uses custom shouldRetry predicate', async () => {
    const customError = new HopCodeError(
      'CUSTOM',
      ErrorCategory.INTERNAL,
      'Custom error',
    );
    const operation = vi
      .fn()
      .mockRejectedValueOnce(customError)
      .mockResolvedValueOnce('success');

    const result = withRetry(operation, {
      maxRetries: 3,
      initialDelayMs: 100,
      shouldRetry: (error) =>
        error instanceof HopCodeError && error.code === 'CUSTOM',
    });

    await vi.runAllTimersAsync();

    expect(await result).toBe('success');
    expect(operation).toHaveBeenCalledTimes(2);
  });

  it('calls onRetry callback', async () => {
    const onRetry = vi.fn();
    const operation = vi
      .fn()
      .mockRejectedValueOnce(NetworkErrors.connectionRefused('api.example.com'))
      .mockResolvedValueOnce('success');

    const result = withRetry(operation, {
      maxRetries: 3,
      initialDelayMs: 100,
      onRetry,
    });

    await vi.runAllTimersAsync();

    await result;

    expect(onRetry).toHaveBeenCalledTimes(1);
    expect(onRetry).toHaveBeenCalledWith(expect.any(NetworkError), 1, 100);
  });

  it('uses exponential backoff', async () => {
    const operation = vi.fn().mockImplementation(async () => {
      throw NetworkErrors.connectionRefused('api.example.com');
    });

    const promise = withRetry(operation, {
      maxRetries: 3,
      initialDelayMs: 100,
      backoffMultiplier: 2,
      maxDelayMs: 1000,
    });

    // Run timers for each retry: 100ms, 200ms, 400ms
    await vi.advanceTimersByTimeAsync(100);
    await vi.advanceTimersByTimeAsync(200);
    await vi.advanceTimersByTimeAsync(400);

    await expect(promise).rejects.toThrow('Connection refused');
    expect(operation).toHaveBeenCalledTimes(4);
  });
});

describe('withFallback', () => {
  it('returns operation result on success', async () => {
    const operation = vi.fn().mockResolvedValue('success');
    const fallback = 'fallback-value';

    const result = await withFallback(operation, { fallback });

    expect(result).toBe('success');
    expect(operation).toHaveBeenCalledTimes(1);
  });

  it('uses fallback on network error', async () => {
    const operation = vi
      .fn()
      .mockRejectedValue(NetworkErrors.connectionRefused('api.example.com'));
    const fallback = 'fallback-value';

    const result = await withFallback(operation, { fallback });

    expect(result).toBe('fallback-value');
    expect(operation).toHaveBeenCalledTimes(1);
  });

  it('uses fallback on config error', async () => {
    const operation = vi
      .fn()
      .mockRejectedValue(ConfigErrors.invalidConfig('bad config'));
    const fallback = 'default-config';

    const result = await withFallback(operation, { fallback });

    expect(result).toBe('default-config');
    expect(operation).toHaveBeenCalledTimes(1);
  });

  it('uses fallback factory function', async () => {
    const operation = vi
      .fn()
      .mockRejectedValue(NetworkErrors.connectionRefused('api.example.com'));
    const fallbackFactory = vi.fn().mockReturnValue('factory-value');

    const result = await withFallback(operation, { fallback: fallbackFactory });

    expect(result).toBe('factory-value');
    expect(fallbackFactory).toHaveBeenCalledTimes(1);
  });

  it('does not use fallback on non-configured categories', async () => {
    const operation = vi
      .fn()
      .mockRejectedValue(ProviderErrors.serviceUnavailable('openai'));
    const fallback = 'fallback-value';

    // Only fallback on CONFIG errors, not PROVIDER
    const result = withFallback(operation, {
      fallback,
      fallbackOnCategories: [ErrorCategory.CONFIG],
    });

    await expect(result).rejects.toThrow('Service unavailable');
  });

  it('uses custom shouldFallback predicate', async () => {
    const customError = new HopCodeError(
      'CUSTOM',
      ErrorCategory.TOOL,
      'Tool failed',
    );
    const operation = vi.fn().mockRejectedValue(customError);
    const fallback = 'fallback-value';

    const result = withFallback(operation, {
      fallback,
      shouldFallback: (error) =>
        error instanceof HopCodeError && error.category === ErrorCategory.TOOL,
    });

    expect(await result).toBe('fallback-value');
  });

  it('logs fallback usage by default', async () => {
    const warnSpy = vi.spyOn(errorLogger, 'warn');
    const operation = vi
      .fn()
      .mockRejectedValue(NetworkErrors.connectionRefused('api.example.com'));
    const fallback = 'fallback-value';

    await withFallback(operation, { fallback });

    expect(warnSpy).toHaveBeenCalledWith(
      'Using fallback value',
      expect.objectContaining({
        error: expect.any(NetworkError),
        fallbackReason: 'error_recovery',
      }),
    );
  });

  it('skips logging when logFallback is false', async () => {
    const warnSpy = vi.spyOn(errorLogger, 'warn');
    const operation = vi
      .fn()
      .mockRejectedValue(NetworkErrors.connectionRefused('api.example.com'));
    const fallback = 'fallback-value';

    await withFallback(operation, { fallback, logFallback: false });

    expect(warnSpy).not.toHaveBeenCalled();
  });
});

describe('withinErrorBoundary', () => {
  it('returns operation result on success', async () => {
    const operation = vi.fn().mockResolvedValue('success');
    const context = { operation: 'test-operation' };

    const result = await withinErrorBoundary(operation, context);

    expect(result).toBe('success');
    expect(operation).toHaveBeenCalledTimes(1);
  });

  it('catches and rethrows error by default', async () => {
    const operation = vi.fn().mockRejectedValue(new Error('test error'));
    const context = { operation: 'test-operation' };

    const result = withinErrorBoundary(operation, context);

    await expect(result).rejects.toThrow('test error');
  });

  it('calls onError callback', async () => {
    const onError = vi.fn();
    const operation = vi.fn().mockRejectedValue(new Error('test error'));
    const context = { operation: 'test-operation', metadata: { key: 'value' } };

    const result = withinErrorBoundary(operation, context, { onError });

    await expect(result).rejects.toThrow('test error');
    expect(onError).toHaveBeenCalledWith(expect.any(Error), context);
  });

  it('wraps error in HopCodeError', async () => {
    const operation = vi.fn().mockRejectedValue(new Error('original error'));
    const context = { operation: 'tool-execution' };

    const result = withinErrorBoundary(operation, context, {
      wrapError: {
        code: 'TOOL_FAILED',
        message: 'Tool execution failed',
        category: ErrorCategory.TOOL,
      },
    });

    await expect(result).rejects.toThrow(
      'Tool execution failed: original error',
    );
    await expect(result).rejects.toHaveProperty('code', 'TOOL_FAILED');
    await expect(result).rejects.toHaveProperty('category', ErrorCategory.TOOL);
  });

  it('only catches configured categories', async () => {
    const onError = vi.fn();
    const operation = vi
      .fn()
      .mockRejectedValue(ProviderErrors.serviceUnavailable('openai'));
    const context = { operation: 'test-operation' };

    // Only catch TOOL errors, not PROVIDER
    const result = withinErrorBoundary(operation, context, {
      catchCategories: [ErrorCategory.TOOL],
      onError,
    });

    await expect(result).rejects.toThrow('Service unavailable');
    expect(onError).not.toHaveBeenCalled();
  });

  it('uses custom shouldCatch predicate', async () => {
    const onError = vi.fn();
    const customError = new HopCodeError(
      'CUSTOM',
      ErrorCategory.INTERNAL,
      'Custom error',
    );
    const operation = vi.fn().mockRejectedValue(customError);
    const context = { operation: 'test-operation' };

    const result = withinErrorBoundary(operation, context, {
      shouldCatch: (error) =>
        error instanceof HopCodeError && error.code === 'CUSTOM',
      onError,
    });

    await expect(result).rejects.toThrow('Custom error');
    expect(onError).toHaveBeenCalledWith(customError, context);
  });

  it('preserves error cause when wrapping', async () => {
    const originalError = new Error('original');
    const operation = vi.fn().mockRejectedValue(originalError);
    const context = { operation: 'test-operation' };

    const result = withinErrorBoundary(operation, context, {
      wrapError: {
        code: 'WRAPPED',
        message: 'Wrapped error',
        category: ErrorCategory.INTERNAL,
      },
    });

    await expect(result).rejects.toHaveProperty('cause', originalError);
  });
});
