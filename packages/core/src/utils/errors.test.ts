/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect } from 'vitest';
import {
  isAbortError,
  isNodeError,
  hasErrorCode,
  hasErrorType,
} from './errors.js';

describe('isAbortError', () => {
  it('should return true for DOMException-style AbortError', () => {
    const abortError = new Error('The operation was aborted');
    abortError.name = 'AbortError';

    expect(isAbortError(abortError)).toBe(true);
  });

  it('should return true for custom AbortError class', () => {
    class AbortError extends Error {
      constructor(message: string) {
        super(message);
        this.name = 'AbortError';
      }
    }

    const error = new AbortError('Custom abort error');
    expect(isAbortError(error)).toBe(true);
  });

  it('should return true for Node.js abort error (ABORT_ERR code)', () => {
    const nodeAbortError = new Error(
      'Request aborted',
    ) as NodeJS.ErrnoException;
    nodeAbortError.code = 'ABORT_ERR';

    expect(isAbortError(nodeAbortError)).toBe(true);
  });

  it('should return false for regular errors', () => {
    expect(isAbortError(new Error('Regular error'))).toBe(false);
  });

  it('should return false for null', () => {
    expect(isAbortError(null)).toBe(false);
  });

  it('should return false for undefined', () => {
    expect(isAbortError(undefined)).toBe(false);
  });

  it('should return false for non-object values', () => {
    expect(isAbortError('string error')).toBe(false);
    expect(isAbortError(123)).toBe(false);
    expect(isAbortError(true)).toBe(false);
  });

  it('should return false for errors with different names', () => {
    const timeoutError = new Error('Request timed out');
    timeoutError.name = 'TimeoutError';

    expect(isAbortError(timeoutError)).toBe(false);
  });

  it('should return false for errors with other error codes', () => {
    const networkError = new Error('Network error') as NodeJS.ErrnoException;
    networkError.code = 'ECONNREFUSED';

    expect(isAbortError(networkError)).toBe(false);
  });
});

describe('isNodeError', () => {
  it('should return true for Error with code property', () => {
    const nodeError = new Error('File not found') as NodeJS.ErrnoException;
    nodeError.code = 'ENOENT';

    expect(isNodeError(nodeError)).toBe(true);
  });

  it('should return false for Error without code property', () => {
    const regularError = new Error('Regular error');

    expect(isNodeError(regularError)).toBe(false);
  });

  it('should return false for non-Error objects', () => {
    expect(isNodeError({ code: 'ENOENT' })).toBe(false);
    expect(isNodeError('string')).toBe(false);
    expect(isNodeError(null)).toBe(false);
  });
});

describe('hasErrorCode', () => {
  it('should return true for errors with string code property', () => {
    const error = new Error('timeout') as Error & { code: string };
    error.code = 'ETIMEDOUT';

    expect(hasErrorCode(error)).toBe(true);
  });

  it('should return true for provider errors with code', () => {
    const error = {
      message: 'rate limited',
      code: 'rate_limit_error',
    };

    expect(hasErrorCode(error)).toBe(true);
  });

  it('should return false for errors without code', () => {
    expect(hasErrorCode(new Error('regular error'))).toBe(false);
  });

  it('should return false for errors with non-string code', () => {
    const error = new Error('test') as Error & { code: number };
    error.code = 500;

    expect(hasErrorCode(error)).toBe(false);
  });

  it('should return false for non-objects', () => {
    expect(hasErrorCode(null)).toBe(false);
    expect(hasErrorCode(undefined)).toBe(false);
    expect(hasErrorCode('string')).toBe(false);
  });
});

describe('hasErrorType', () => {
  it('should return true for errors with string type property', () => {
    const error = { message: 'bad request', type: 'invalid_request_error' };

    expect(hasErrorType(error)).toBe(true);
  });

  it('should return true for OpenAI-style SDK errors', () => {
    class OpenAIError extends Error {
      type = 'authentication_error';
    }
    const error = new OpenAIError('invalid key');

    expect(hasErrorType(error)).toBe(true);
  });

  it('should return false for errors without type', () => {
    expect(hasErrorType(new Error('regular error'))).toBe(false);
  });

  it('should return false for errors with non-string type', () => {
    const error = { message: 'test', type: 123 };

    expect(hasErrorType(error)).toBe(false);
  });

  it('should return false for non-objects', () => {
    expect(hasErrorType(null)).toBe(false);
    expect(hasErrorType(undefined)).toBe(false);
    expect(hasErrorType('string')).toBe(false);
  });
});
