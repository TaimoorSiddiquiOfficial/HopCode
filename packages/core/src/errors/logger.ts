/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */

import { createDebugLogger } from '../utils/debugLogger.js';
import type { ErrorRecord } from './types.js';
import { ErrorCategory, HopCodeError } from './types.js';

/**
 * Log severity levels.
 */
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

/**
 * Error sink interface — defines where errors are logged.
 */
export interface ErrorSink {
  log(record: ErrorRecord, level: LogLevel): void;
}

/**
 * Console sink — outputs to console.error/warn/log.
 */
export class ConsoleSink implements ErrorSink {
   
  log(record: ErrorRecord, level: LogLevel): void {
    const output = formatForConsole(record);

    switch (level) {
      case LogLevel.ERROR:
        // eslint-disable-next-line no-console
        console.error(output);
        break;
      case LogLevel.WARN:
        // eslint-disable-next-line no-console
        console.warn(output);
        break;
      case LogLevel.INFO:
        // eslint-disable-next-line no-console
        console.log(output);
        break;
      case LogLevel.DEBUG:
        // eslint-disable-next-line no-console
        console.log(output);
        break;
      default:
        // eslint-disable-next-line no-console
        console.log(output);
    }
  }
}

/**
 * File sink — outputs to debug log file via createDebugLogger.
 */
export class FileSink implements ErrorSink {
  private debugLogger = createDebugLogger('ERROR_LOGGER');

  log(record: ErrorRecord, level: LogLevel): void {
    // All errors go to debug log file as JSON for structured analysis
    const jsonRecord = JSON.stringify(record, null, 2);

    switch (level) {
      case LogLevel.ERROR:
        this.debugLogger.error(jsonRecord);
        break;
      case LogLevel.WARN:
        this.debugLogger.warn(jsonRecord);
        break;
      case LogLevel.INFO:
        this.debugLogger.info(jsonRecord);
        break;
      case LogLevel.DEBUG:
        this.debugLogger.debug(jsonRecord);
        break;
      default:
        this.debugLogger.debug(jsonRecord);
    }
  }
}

/**
 * Error logger configuration.
 */
export interface ErrorLoggerConfig {
  level: LogLevel;
  sessionId?: string;
  agentId?: string;
  sinks: ErrorSink[];
}

/**
 * Main error logger class.
 * Provides structured error logging with multiple sinks.
 */
export class ErrorLogger {
  private config: ErrorLoggerConfig;

  constructor(config: ErrorLoggerConfig) {
    this.config = config;
  }

  /**
   * Log an error record.
   */
  log(record: ErrorRecord, level: LogLevel = LogLevel.ERROR): void {
    if (!shouldLog(level, this.config.level)) {
      return;
    }

    // Enrich with session context
    const enrichedRecord: ErrorRecord = {
      ...record,
      context: {
        ...record.context,
        sessionId: record.context.sessionId ?? this.config.sessionId,
        agentId: record.context.agentId ?? this.config.agentId,
      },
    };

    // Send to all sinks
    for (const sink of this.config.sinks) {
      sink.log(enrichedRecord, level);
    }
  }

  /**
   * Log error with message and context.
   */
  error(
    message: string,
    context: { error: unknown; [key: string]: unknown },
  ): void {
    const record = this.toRecord(message, context);
    this.log(record, LogLevel.ERROR);
  }

  /**
   * Log warning with message and optional error.
   */
  warn(
    message: string,
    context: { error?: unknown; [key: string]: unknown } = {},
  ): void {
    const record = this.toRecord(message, context);
    this.log(record, LogLevel.WARN);
  }

  /**
   * Log info message.
   */
  info(message: string, context: Record<string, unknown> = {}): void {
    const record = this.toRecord(message, context);
    this.log(record, LogLevel.INFO);
  }

  /**
   * Log debug message.
   */
  debug(message: string, context: Record<string, unknown> = {}): void {
    const record = this.toRecord(message, context);
    this.log(record, LogLevel.DEBUG);
  }

  /**
   * Convert message and context to error record.
   */
  private toRecord(
    message: string,
    context: Record<string, unknown>,
  ): ErrorRecord {
    const error = context.error;
    const isError = error instanceof HopCodeError;

    return {
      name: isError
        ? error.constructor.name
        : error instanceof Error
          ? error.name
          : 'Error',
      code: isError ? error.code : 'UNKNOWN',
      category: isError ? error.category : ErrorCategory.INTERNAL,
      message,
      context: context as Record<string, unknown> & {
        sessionId?: string;
        agentId?: string;
        toolName?: string;
        filePath?: string;
        operation?: string;
        httpStatus?: number;
        retryAttempt?: number;
      },
      isRetryable: isError ? error.isRetryable : false,
      isExpected: isError ? error.isExpected : false,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Log a generic message (not necessarily an error).
   * Useful for info/debug logging without error context.
   */
  message(
    message: string,
    level: LogLevel = LogLevel.INFO,
    context: Record<string, unknown> = {},
  ): void {
    const record: ErrorRecord = {
      name: 'Message',
      code: 'MESSAGE',
      category: ErrorCategory.INTERNAL,
      message,
      context: context as Record<string, unknown> & {
        sessionId?: string;
        agentId?: string;
        toolName?: string;
        filePath?: string;
        operation?: string;
        httpStatus?: number;
        retryAttempt?: number;
      },
      isRetryable: false,
      isExpected: true,
      timestamp: new Date().toISOString(),
    };
    this.log(record, level);
  }
}

/**
 * Default error logger instance.
 * Configured with console and file sinks.
 */
export const errorLogger = new ErrorLogger({
  level: LogLevel.DEBUG,
  sinks: [new ConsoleSink(), new FileSink()],
});

/**
 * Helper: Check if level should be logged based on threshold.
 */
function shouldLog(level: LogLevel, threshold: LogLevel): boolean {
  const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR];
  return levels.indexOf(level) >= levels.indexOf(threshold);
}

/**
 * Helper: Format record for console output.
 */
function formatForConsole(record: ErrorRecord): string {
  const parts: string[] = [
    `[${record.category.toUpperCase()}]`,
    record.code,
    record.message,
  ];

  if (record.context.toolName) {
    parts.push(`(tool: ${record.context.toolName})`);
  }

  if (record.context.filePath) {
    parts.push(`(file: ${record.context.filePath})`);
  }

  if (record.context.httpStatus) {
    parts.push(`(http: ${record.context.httpStatus})`);
  }

  return parts.join(' ');
}
