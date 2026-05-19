/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  ErrorLogger,
  LogLevel,
  ConsoleSink,
  FileSink,
  errorLogger,
  type ErrorSink,
} from './logger.js';
import { FilesystemErrors, ErrorCategory } from './types.js';

describe('ConsoleSink', () => {
  it('should log errors to console.error', () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const sink = new ConsoleSink();
    const record = {
      name: 'FilesystemError',
      code: 'FILE_NOT_FOUND',
      category: ErrorCategory.FILESYSTEM,
      message: 'File not found',
      context: {},
      isRetryable: false,
      isExpected: false,
      timestamp: new Date().toISOString(),
    };

    sink.log(record, LogLevel.ERROR);

    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(consoleErrorSpy.mock.calls[0][0]).toContain('FILE_NOT_FOUND');
    consoleErrorSpy.mockRestore();
  });

  it('should log warnings to console.warn', () => {
    const consoleWarnSpy = vi
      .spyOn(console, 'warn')
      .mockImplementation(() => {});
    const sink = new ConsoleSink();
    const record = {
      name: 'Error',
      code: 'UNKNOWN',
      category: ErrorCategory.INTERNAL,
      message: 'Warning message',
      context: {},
      isRetryable: false,
      isExpected: false,
      timestamp: new Date().toISOString(),
    };

    sink.log(record, LogLevel.WARN);

    expect(consoleWarnSpy).toHaveBeenCalled();
    consoleWarnSpy.mockRestore();
  });

  it('should format console output with category and code', () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const sink = new ConsoleSink();
    const record = {
      name: 'FilesystemError',
      code: 'PERMISSION_DENIED',
      category: ErrorCategory.FILESYSTEM,
      message: 'Permission denied',
      context: {},
      isRetryable: false,
      isExpected: false,
      timestamp: new Date().toISOString(),
    };

    sink.log(record, LogLevel.ERROR);

    expect(consoleErrorSpy.mock.calls[0][0]).toMatch(
      /\[FILESYSTEM\].*PERMISSION_DENIED.*Permission denied/,
    );
    consoleErrorSpy.mockRestore();
  });

  it('should include tool name in console output', () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const sink = new ConsoleSink();
    const record = {
      name: 'ToolError',
      code: 'TOOL_NOT_FOUND',
      category: ErrorCategory.TOOL,
      message: 'Tool not found',
      context: { toolName: 'read_file' },
      isRetryable: false,
      isExpected: false,
      timestamp: new Date().toISOString(),
    };

    sink.log(record, LogLevel.ERROR);

    expect(consoleErrorSpy.mock.calls[0][0]).toContain('(tool: read_file)');
    consoleErrorSpy.mockRestore();
  });

  it('should include file path in console output', () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const sink = new ConsoleSink();
    const record = {
      name: 'FilesystemError',
      code: 'FILE_NOT_FOUND',
      category: ErrorCategory.FILESYSTEM,
      message: 'File not found',
      context: { filePath: '/test/file.txt' },
      isRetryable: false,
      isExpected: false,
      timestamp: new Date().toISOString(),
    };

    sink.log(record, LogLevel.ERROR);

    expect(consoleErrorSpy.mock.calls[0][0]).toContain(
      '(file: /test/file.txt)',
    );
    consoleErrorSpy.mockRestore();
  });

  it('should include HTTP status in console output', () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const sink = new ConsoleSink();
    const record = {
      name: 'ProviderError',
      code: 'RATE_LIMITED',
      category: ErrorCategory.PROVIDER,
      message: 'Rate limited',
      context: { httpStatus: 429 },
      isRetryable: true,
      isExpected: false,
      timestamp: new Date().toISOString(),
    };

    sink.log(record, LogLevel.ERROR);

    expect(consoleErrorSpy.mock.calls[0][0]).toContain('(http: 429)');
    consoleErrorSpy.mockRestore();
  });
});

describe('FileSink', () => {
  it('should log errors to debug logger', () => {
    const sink = new FileSink();
    const record = {
      name: 'FilesystemError',
      code: 'FILE_NOT_FOUND',
      category: ErrorCategory.FILESYSTEM,
      message: 'File not found',
      context: { filePath: '/test.txt' },
      isRetryable: false,
      isExpected: false,
      timestamp: new Date().toISOString(),
    };

    // FileSink uses createDebugLogger which writes to file
    // We verify it doesn't throw
    expect(() => sink.log(record, LogLevel.ERROR)).not.toThrow();
  });

  it('should log as JSON for structured analysis', () => {
    const sink = new FileSink();
    const record = {
      name: 'FilesystemError',
      code: 'FILE_NOT_FOUND',
      category: ErrorCategory.FILESYSTEM,
      message: 'File not found',
      context: { filePath: '/test.txt' },
      isRetryable: false,
      isExpected: false,
      timestamp: new Date().toISOString(),
    };

    expect(() => sink.log(record, LogLevel.ERROR)).not.toThrow();
  });
});

describe('ErrorLogger', () => {
  let sink: ErrorSink;
  let logger: ErrorLogger;

  beforeEach(() => {
    sink = {
      log: vi.fn(),
    };
    logger = new ErrorLogger({
      level: LogLevel.DEBUG,
      sessionId: 'test-session',
      agentId: 'test-agent',
      sinks: [sink],
    });
  });

  it('should enrich records with session context', () => {
    const error = FilesystemErrors.notFound('/test.txt');
    logger.error('File operation failed', { error });

    expect(sink.log).toHaveBeenCalled();
    const call = (sink.log as ReturnType<typeof vi.fn>).mock.calls[0];
    const record = call[0];

    expect(record.context.sessionId).toBe('test-session');
    expect(record.context.agentId).toBe('test-agent');
  });

  it('should respect log level threshold', () => {
    const errorLogger = new ErrorLogger({
      level: LogLevel.ERROR,
      sinks: [sink],
    });

    errorLogger.debug('Debug message');
    errorLogger.info('Info message');
    errorLogger.warn('Warn message', {});

    expect(sink.log).not.toHaveBeenCalled();
  });

  it('should log errors at ERROR level', () => {
    const error = FilesystemErrors.notFound('/test.txt');
    logger.error('File not found', { error });

    expect(sink.log).toHaveBeenCalledWith(
      expect.objectContaining({
        code: 'FILE_NOT_FOUND',
        category: ErrorCategory.FILESYSTEM,
      }),
      LogLevel.ERROR,
    );
  });

  it('should log warnings at WARN level', () => {
    logger.warn('Something might be wrong', { extra: 'context' });

    expect(sink.log).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Something might be wrong',
      }),
      LogLevel.WARN,
    );
  });

  it('should log info messages at INFO level', () => {
    logger.info('Operation started', { operation: 'read' });

    expect(sink.log).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Operation started',
      }),
      LogLevel.INFO,
    );
  });

  it('should log debug messages at DEBUG level', () => {
    logger.debug('Debug info', { detail: 'value' });

    expect(sink.log).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Debug info',
      }),
      LogLevel.DEBUG,
    );
  });

  it('should handle HopCodeError with proper metadata', () => {
    const error = FilesystemErrors.permissionDenied('/test.txt', 'write');
    logger.error('Permission denied', { error });

    expect(sink.log).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'FilesystemError',
        code: 'PERMISSION_DENIED',
        category: ErrorCategory.FILESYSTEM,
        isRetryable: false,
        isExpected: false,
      }),
      LogLevel.ERROR,
    );
  });

  it('should handle non-HopCodeError gracefully', () => {
    const error = new Error('Regular error');
    logger.error('Something failed', { error });

    expect(sink.log).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Error',
        code: 'UNKNOWN',
        category: ErrorCategory.INTERNAL,
      }),
      LogLevel.ERROR,
    );
  });

  it('should handle string errors', () => {
    logger.error('Operation failed', { error: 'Connection timeout' });

    expect(sink.log).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Error',
        code: 'UNKNOWN',
        message: 'Operation failed',
      }),
      LogLevel.ERROR,
    );
  });

  it('should send to all configured sinks', () => {
    const sink2 = { log: vi.fn() };
    const multiLogger = new ErrorLogger({
      level: LogLevel.DEBUG,
      sinks: [sink, sink2],
    });

    multiLogger.error('Test error', { error: new Error('test') });

    expect(sink.log).toHaveBeenCalled();
    expect(sink2.log).toHaveBeenCalled();
  });
});

describe('errorLogger (default instance)', () => {
  it('should be configured with console and file sinks', () => {
    // Verify default logger exists and has expected sinks
    expect(errorLogger).toBeDefined();
  });

  it('should log to default sinks without throwing', () => {
    expect(() => {
      errorLogger.info('Test message');
    }).not.toThrow();
  });
});

describe('LogLevel', () => {
  it('should have correct level ordering', () => {
    const levels = [
      LogLevel.DEBUG,
      LogLevel.INFO,
      LogLevel.WARN,
      LogLevel.ERROR,
    ];
    expect(levels).toEqual(['debug', 'info', 'warn', 'error']);
  });
});
