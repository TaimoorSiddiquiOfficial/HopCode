/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type { ErrorRecord } from './types.js';
/**
 * Log severity levels.
 */
export declare enum LogLevel {
    DEBUG = "debug",
    INFO = "info",
    WARN = "warn",
    ERROR = "error"
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
export declare class ConsoleSink implements ErrorSink {
    log(record: ErrorRecord, level: LogLevel): void;
}
/**
 * File sink — outputs to debug log file via createDebugLogger.
 */
export declare class FileSink implements ErrorSink {
    private debugLogger;
    log(record: ErrorRecord, level: LogLevel): void;
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
export declare class ErrorLogger {
    private config;
    constructor(config: ErrorLoggerConfig);
    /**
     * Log an error record.
     */
    log(record: ErrorRecord, level?: LogLevel): void;
    /**
     * Log error with message and context.
     */
    error(message: string, context: {
        error: unknown;
        [key: string]: unknown;
    }): void;
    /**
     * Log warning with message and optional error.
     */
    warn(message: string, context?: {
        error?: unknown;
        [key: string]: unknown;
    }): void;
    /**
     * Log info message.
     */
    info(message: string, context?: Record<string, unknown>): void;
    /**
     * Log debug message.
     */
    debug(message: string, context?: Record<string, unknown>): void;
    /**
     * Convert message and context to error record.
     */
    private toRecord;
    /**
     * Log a generic message (not necessarily an error).
     * Useful for info/debug logging without error context.
     */
    message(message: string, level?: LogLevel, context?: Record<string, unknown>): void;
}
/**
 * Default error logger instance.
 * Configured with console and file sinks.
 */
export declare const errorLogger: ErrorLogger;
