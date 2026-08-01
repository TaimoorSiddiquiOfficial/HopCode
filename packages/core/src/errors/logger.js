/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { createDebugLogger } from '../utils/debugLogger.js';
import { ErrorCategory, HopCodeError } from './types.js';
/**
 * Log severity levels.
 */
export var LogLevel;
(function (LogLevel) {
    LogLevel["DEBUG"] = "debug";
    LogLevel["INFO"] = "info";
    LogLevel["WARN"] = "warn";
    LogLevel["ERROR"] = "error";
})(LogLevel || (LogLevel = {}));
/**
 * Console sink — outputs to console.error/warn/log.
 */
export class ConsoleSink {
    log(record, level) {
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
export class FileSink {
    debugLogger = createDebugLogger('ERROR_LOGGER');
    log(record, level) {
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
 * Main error logger class.
 * Provides structured error logging with multiple sinks.
 */
export class ErrorLogger {
    config;
    constructor(config) {
        this.config = config;
    }
    /**
     * Log an error record.
     */
    log(record, level = LogLevel.ERROR) {
        if (!shouldLog(level, this.config.level)) {
            return;
        }
        // Enrich with session context
        const enrichedRecord = {
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
    error(message, context) {
        const record = this.toRecord(message, context);
        this.log(record, LogLevel.ERROR);
    }
    /**
     * Log warning with message and optional error.
     */
    warn(message, context = {}) {
        const record = this.toRecord(message, context);
        this.log(record, LogLevel.WARN);
    }
    /**
     * Log info message.
     */
    info(message, context = {}) {
        const record = this.toRecord(message, context);
        this.log(record, LogLevel.INFO);
    }
    /**
     * Log debug message.
     */
    debug(message, context = {}) {
        const record = this.toRecord(message, context);
        this.log(record, LogLevel.DEBUG);
    }
    /**
     * Convert message and context to error record.
     */
    toRecord(message, context) {
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
            context: context,
            isRetryable: isError ? error.isRetryable : false,
            isExpected: isError ? error.isExpected : false,
            timestamp: new Date().toISOString(),
        };
    }
    /**
     * Log a generic message (not necessarily an error).
     * Useful for info/debug logging without error context.
     */
    message(message, level = LogLevel.INFO, context = {}) {
        const record = {
            name: 'Message',
            code: 'MESSAGE',
            category: ErrorCategory.INTERNAL,
            message,
            context: context,
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
function shouldLog(level, threshold) {
    const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR];
    return levels.indexOf(level) >= levels.indexOf(threshold);
}
/**
 * Helper: Format record for console output.
 */
function formatForConsole(record) {
    const parts = [
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
//# sourceMappingURL=logger.js.map