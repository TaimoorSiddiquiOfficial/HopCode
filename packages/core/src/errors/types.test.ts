/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect } from 'vitest';
import type {
  ErrorContext} from './types.js';
import {
  HopCodeError,
  ErrorCategory,
  isHopCodeError,
  toHopCodeError,
  UnknownError,
  FilesystemError,
  FilesystemErrors,
  NetworkError,
  NetworkErrors,
  ProviderError,
  ProviderErrors,
  ToolError,
  ToolErrors,
  ConfigError,
  ConfigErrors,
  InputError,
  CancellationError,
} from './types.js';

describe('HopCodeError', () => {
  class TestError extends HopCodeError {
    constructor(message: string, context?: ErrorContext) {
      super('TEST_ERROR', ErrorCategory.INTERNAL, message, context);
    }
  }

  it('should create error with standard properties', () => {
    const error = new TestError('Test message', { sessionId: 'test-123' });

    expect(error.code).toBe('TEST_ERROR');
    expect(error.category).toBe(ErrorCategory.INTERNAL);
    expect(error.message).toBe('Test message');
    expect(error.context.sessionId).toBe('test-123');
    expect(error.isRetryable).toBe(false);
    expect(error.isExpected).toBe(false);
  });

  it('should serialize to JSON', () => {
    const error = new TestError('Test message', {
      sessionId: 'test-123',
      agentId: 'agent-456',
    });

    const json = error.toJSON();

    expect(json).toMatchObject({
      name: 'TestError',
      code: 'TEST_ERROR',
      category: ErrorCategory.INTERNAL,
      message: 'Test message',
      context: {
        sessionId: 'test-123',
        agentId: 'agent-456',
      },
      isRetryable: false,
      isExpected: false,
      timestamp: expect.any(String),
    });
  });

  it('should have custom toString method', () => {
    const error = new TestError('Test message');
    expect(error.toString()).toBe('TestError [TEST_ERROR]: Test message');
  });
});

describe('isHopCodeError', () => {
  it('should return true for HopCodeError instances', () => {
    const error = new UnknownError('Test');
    expect(isHopCodeError(error)).toBe(true);
  });

  it('should return false for regular Error', () => {
    const error = new Error('Test');
    expect(isHopCodeError(error)).toBe(false);
  });

  it('should return false for non-Error objects', () => {
    expect(isHopCodeError({ message: 'test' })).toBe(false);
    expect(isHopCodeError('error string')).toBe(false);
    expect(isHopCodeError(null)).toBe(false);
    expect(isHopCodeError(undefined)).toBe(false);
  });
});

describe('toHopCodeError', () => {
  it('should return HopCodeError as-is', () => {
    const original = new UnknownError('Already HopCodeError');
    const result = toHopCodeError(original);
    expect(result).toBe(original);
  });

  it('should wrap regular Error', () => {
    const original = new Error('Regular error');
    const result = toHopCodeError(original);

    expect(result).toBeInstanceOf(UnknownError);
    expect(result.message).toBe('Regular error');
    expect(result.cause).toBe(original);
  });

  it('should wrap string errors', () => {
    const result = toHopCodeError('Something went wrong');

    expect(result).toBeInstanceOf(UnknownError);
    expect(result.message).toBe('Something went wrong');
  });

  it('should handle null/undefined gracefully', () => {
    const nullResult = toHopCodeError(null);
    expect(nullResult.message).toBe('null');

    const undefinedResult = toHopCodeError(undefined);
    expect(undefinedResult.message).toBe('undefined');
  });
});

describe('UnknownError', () => {
  it('should create with default values', () => {
    const error = new UnknownError('Unknown issue');

    expect(error.code).toBe('UNKNOWN_ERROR');
    expect(error.category).toBe(ErrorCategory.INTERNAL);
    expect(error.isRetryable).toBe(false);
    expect(error.isExpected).toBe(false);
  });

  it('should accept cause', () => {
    const cause = new Error('Root cause');
    const error = new UnknownError('Wrapped', cause);

    expect(error.cause).toBe(cause);
  });
});

describe('FilesystemError', () => {
  it('should create with filePath and operation', () => {
    const error = new FilesystemError('FILE_NOT_FOUND', 'File not found', {
      filePath: '/test.txt',
      operation: 'read',
    });

    expect(error.category).toBe(ErrorCategory.FILESYSTEM);
    expect(error.filePath).toBe('/test.txt');
    expect(error.operation).toBe('read');
  });

  it('should accept recovery hint', () => {
    const error = new FilesystemError(
      'PERMISSION_DENIED',
      'Permission denied',
      { filePath: '/test.txt', operation: 'write' },
      undefined,
      'Check file permissions',
    );

    expect(error.recoveryHint).toBe('Check file permissions');
  });
});

describe('FilesystemErrors factory', () => {
  it('should create notFound error', () => {
    const error = FilesystemErrors.notFound('/path/to/file.txt');

    expect(error.code).toBe('FILE_NOT_FOUND');
    expect(error.filePath).toBe('/path/to/file.txt');
    expect(error.operation).toBe('read');
  });

  it('should create permissionDenied error with recovery hint', () => {
    const error = FilesystemErrors.permissionDenied('/test.txt', 'write');

    expect(error.code).toBe('PERMISSION_DENIED');
    expect(error.recoveryHint).toBe(
      'Check file permissions or run with elevated privileges',
    );
  });

  it('should create changedSinceRead error with recovery hint', () => {
    const error = FilesystemErrors.changedSinceRead('/test.txt');

    expect(error.code).toBe('FILE_CHANGED_SINCE_READ');
    expect(error.recoveryHint).toBe('Re-read the file before editing');
  });

  it('should create writeFailed error with cause', () => {
    const cause = new Error('Disk full');
    const error = FilesystemErrors.writeFailed('/test.txt', cause);

    expect(error.code).toBe('WRITE_FAILED');
    expect(error.cause).toBe(cause);
  });

  it('should create directoryCreationFailed error', () => {
    const error = FilesystemErrors.directoryCreationFailed('/test/dir');

    expect(error.code).toBe('DIRECTORY_CREATION_FAILED');
    expect(error.filePath).toBe('/test/dir');
    expect(error.recoveryHint).toBe('Check parent directory permissions');
  });
});

describe('NetworkError', () => {
  it('should be retryable by default', () => {
    const error = new NetworkError('CONNECTION_TIMEOUT', 'Timeout');

    expect(error.isRetryable).toBe(true);
  });

  it('should accept custom retryable flag', () => {
    const error = new NetworkError(
      'DNS_FAILURE',
      'DNS failed',
      {},
      undefined,
      false,
    );

    expect(error.isRetryable).toBe(false);
  });
});

describe('NetworkErrors factory', () => {
  it('should create connectionRefused error', () => {
    const error = NetworkErrors.connectionRefused('https://api.example.com');

    expect(error.code).toBe('CONNECTION_REFUSED');
    expect(error.isRetryable).toBe(true);
  });

  it('should create timeout error with details', () => {
    const error = NetworkErrors.timeout('https://api.example.com', 30000);

    expect(error.code).toBe('CONNECTION_TIMEOUT');
    expect(error.message).toContain('30000ms');
    expect(error.isRetryable).toBe(true);
  });
});

describe('ProviderError', () => {
  it('should be retryable for rate limited and service unavailable', () => {
    const rateLimitError = new ProviderError('RATE_LIMITED', 'Rate limited');
    expect(rateLimitError.isRetryable).toBe(true);

    const serviceError = new ProviderError('SERVICE_UNAVAILABLE', 'Down');
    expect(serviceError.isRetryable).toBe(true);
  });

  it('should not be retryable for invalid request', () => {
    const error = new ProviderError('INVALID_REQUEST', 'Bad request');
    expect(error.isRetryable).toBe(false);
  });

  it('should store provider and httpStatus', () => {
    const error = new ProviderError('RATE_LIMITED', 'Rate limited', {
      provider: 'openai',
      httpStatus: 429,
    });

    expect(error.provider).toBe('openai');
    expect(error.httpStatus).toBe(429);
  });
});

describe('ProviderErrors factory', () => {
  it('should create rateLimited error', () => {
    const error = ProviderErrors.rateLimited('openai', 60000);

    expect(error.code).toBe('RATE_LIMITED');
    expect(error.provider).toBe('openai');
    expect(error.isRetryable).toBe(true);
  });

  it('should create serviceUnavailable error', () => {
    const error = ProviderErrors.serviceUnavailable('anthropic');

    expect(error.code).toBe('SERVICE_UNAVAILABLE');
    expect(error.isRetryable).toBe(true);
  });
});

describe('ToolError', () => {
  it('should create with toolName', () => {
    const error = new ToolError('TOOL_NOT_FOUND', 'Tool not found', {
      toolName: 'read_file',
    });

    expect(error.toolName).toBe('read_file');
  });
});

describe('ToolErrors factory', () => {
  it('should create notFound error', () => {
    const error = ToolErrors.notFound('edit');

    expect(error.code).toBe('TOOL_NOT_FOUND');
    expect(error.toolName).toBe('edit');
  });

  it('should create invalidParams error with details', () => {
    const error = ToolErrors.invalidParams(
      'edit',
      'Missing required field: path',
    );

    expect(error.code).toBe('INVALID_PARAMS');
    expect(error.message).toContain('Missing required field: path');
  });

  it('should create executionFailed error with cause', () => {
    const cause = new Error('Permission denied');
    const error = ToolErrors.executionFailed('shell', cause);

    expect(error.cause).toBe(cause);
  });
});

describe('ConfigError', () => {
  it('should create with config context', () => {
    const error = new ConfigError('MISSING_CREDENTIALS', 'No API key', {
      provider: 'openai',
    });

    expect(error.category).toBe(ErrorCategory.CONFIG);
  });
});

describe('ConfigErrors factory', () => {
  it('should create missingCredentials error', () => {
    const error = ConfigErrors.missingCredentials('anthropic');

    expect(error.code).toBe('MISSING_CREDENTIALS');
    expect(error.message).toContain('anthropic');
  });

  it('should create invalidConfig error', () => {
    const error = ConfigErrors.invalidConfig(
      'timeout',
      'Must be positive number',
    );

    expect(error.code).toBe('INVALID_CONFIG');
    expect(error.context.configKey).toBe('timeout');
  });
});

describe('InputError', () => {
  it('should create with INPUT category', () => {
    const error = new InputError('Invalid input format');

    expect(error.category).toBe(ErrorCategory.INPUT);
    expect(error.code).toBe('INVALID_INPUT');
  });
});

describe('CancellationError', () => {
  it('should create with CANCELLED category and isExpected=true', () => {
    const error = new CancellationError('User cancelled operation');

    expect(error.category).toBe(ErrorCategory.CANCELLED);
    expect(error.code).toBe('CANCELLED');
    expect(error.isExpected).toBe(true);
    expect(error.isRetryable).toBe(false);
  });

  it('should use default message', () => {
    const error = new CancellationError();
    expect(error.message).toBe('Operation cancelled');
  });
});

describe('Error categories', () => {
  it('should have all expected categories', () => {
    expect(ErrorCategory.INPUT).toBe('input');
    expect(ErrorCategory.CONFIG).toBe('config');
    expect(ErrorCategory.NETWORK).toBe('network');
    expect(ErrorCategory.PROVIDER).toBe('provider');
    expect(ErrorCategory.FILESYSTEM).toBe('filesystem');
    expect(ErrorCategory.TOOL).toBe('tool');
    expect(ErrorCategory.INTERNAL).toBe('internal');
    expect(ErrorCategory.CANCELLED).toBe('cancelled');
  });
});
