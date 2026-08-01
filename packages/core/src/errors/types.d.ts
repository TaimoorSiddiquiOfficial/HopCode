/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Error categories for routing and handling.
 * Each category maps to specific handling strategies.
 */
export declare enum ErrorCategory {
    /** User input errors — no retry, show validation message */
    INPUT = "input",
    /** Configuration errors — no retry, show config fix */
    CONFIG = "config",
    /** Network errors — retry with backoff */
    NETWORK = "network",
    /** Provider errors — retry if 5xx, show message if 4xx */
    PROVIDER = "provider",
    /** File system errors — retry if EBUSY, fail if EACCES */
    FILESYSTEM = "filesystem",
    /** Tool execution errors — retry if denied, fail if not found */
    TOOL = "tool",
    /** Internal errors — retry once, then escalate */
    INTERNAL = "internal",
    /** Cancellation — no retry, cleanup only */
    CANCELLED = "cancelled"
}
/**
 * Context metadata attached to errors.
 * Used for debugging and telemetry.
 */
export interface ErrorContext {
    sessionId?: string;
    agentId?: string;
    toolName?: string;
    filePath?: string;
    operation?: string;
    httpStatus?: number;
    retryAttempt?: number;
    [key: string]: unknown;
}
/**
 * Structured error record for logging.
 */
export interface ErrorRecord {
    name: string;
    code: string;
    category: ErrorCategory;
    message: string;
    context: ErrorContext;
    recoveryHint?: string;
    isRetryable: boolean;
    isExpected: boolean;
    stack?: string;
    cause?: unknown;
    timestamp: string;
}
/**
 * Base class for all HopCode errors.
 * Provides standard metadata for logging, recovery, and user messaging.
 */
export declare abstract class HopCodeError extends Error {
    readonly code: string;
    readonly category: ErrorCategory;
    readonly context: ErrorContext;
    readonly recoveryHint?: string;
    readonly isRetryable: boolean;
    readonly isExpected: boolean;
    constructor(code: string, category: ErrorCategory, message: string, context?: ErrorContext, cause?: unknown, recoveryHint?: string, isRetryable?: boolean, isExpected?: boolean);
    /**
     * Get the cause of this error.
     * Provided for explicit access to the error chain.
     */
    getCause(): unknown;
    /**
     * Convert to structured object for logging/telemetry.
     */
    toJSON(): ErrorRecord;
    /**
     * Override toString for better debugging.
     */
    toString(): string;
}
/**
 * Type guard to check if error is a HopCodeError.
 */
export declare function isHopCodeError(error: unknown): error is HopCodeError;
/**
 * Convert unknown error to HopCodeError.
 * Wraps non-HopCodeError errors with context.
 */
export declare function toHopCodeError(error: unknown, _defaultCode?: string, _defaultCategory?: ErrorCategory): HopCodeError;
/**
 * Unknown error — used as fallback for unclassified errors.
 */
export declare class UnknownError extends HopCodeError {
    constructor(message: string, cause?: unknown, code?: string, category?: ErrorCategory, context?: Record<string, unknown>);
}
export type FilesystemErrorCode = 'FILE_NOT_FOUND' | 'PERMISSION_DENIED' | 'NO_SPACE_LEFT' | 'TARGET_IS_DIRECTORY' | 'FILE_CHANGED_SINCE_READ' | 'READ_FAILED' | 'WRITE_FAILED' | 'DIRECTORY_CREATION_FAILED';
export declare class FilesystemError extends HopCodeError {
    constructor(code: FilesystemErrorCode, message: string, context: {
        filePath: string;
        operation: string;
    }, cause?: unknown, recoveryHint?: string);
    get filePath(): string;
    get operation(): string;
}
/**
 * Filesystem error factory functions.
 */
export declare const FilesystemErrors: {
    notFound: (filePath: string) => FilesystemError;
    permissionDenied: (filePath: string, operation: string) => FilesystemError;
    changedSinceRead: (filePath: string) => FilesystemError;
    writeFailed: (filePath: string, cause?: unknown) => FilesystemError;
    directoryCreationFailed: (dirPath: string, cause?: unknown) => FilesystemError;
};
export type NetworkErrorCode = 'CONNECTION_REFUSED' | 'CONNECTION_TIMEOUT' | 'DNS_FAILURE' | 'SSL_ERROR' | 'NETWORK_UNREACHABLE';
export declare class NetworkError extends HopCodeError {
    constructor(code: NetworkErrorCode, message: string, context?: ErrorContext, cause?: unknown, isRetryable?: boolean);
}
export declare const NetworkErrors: {
    connectionRefused: (url?: string) => NetworkError;
    timeout: (url?: string, timeoutMs?: number) => NetworkError;
};
export type ProviderErrorCode = 'RATE_LIMITED' | 'SERVICE_UNAVAILABLE' | 'INVALID_REQUEST' | 'AUTHENTICATION_FAILED' | 'QUOTA_EXCEEDED';
export declare class ProviderError extends HopCodeError {
    constructor(code: ProviderErrorCode, message: string, context?: {
        provider?: string;
        httpStatus?: number;
        retryAfterMs?: number;
    }, cause?: unknown, isRetryable?: boolean);
    get provider(): string | undefined;
    get httpStatus(): number | undefined;
    get retryAfterMs(): number | undefined;
}
export declare const ProviderErrors: {
    rateLimited: (provider?: string, retryAfterMs?: number) => ProviderError;
    serviceUnavailable: (provider?: string) => ProviderError;
};
export type ToolErrorCode = 'TOOL_NOT_FOUND' | 'INVALID_PARAMS' | 'EXECUTION_FAILED' | 'EXECUTION_DENIED' | 'OUTPUT_TRUNCATED';
export declare class ToolError extends HopCodeError {
    constructor(code: ToolErrorCode, message: string, context?: {
        toolName?: string;
    }, cause?: unknown);
    get toolName(): string | undefined;
}
export declare const ToolErrors: {
    notFound: (toolName: string) => ToolError;
    invalidParams: (toolName: string, details: string) => ToolError;
    executionFailed: (toolName: string, cause?: unknown) => ToolError;
};
export type ConfigErrorCode = 'MISSING_CREDENTIALS' | 'INVALID_CONFIG' | 'CONFIG_NOT_FOUND' | 'CONFIG_PARSE_ERROR';
export declare class ConfigError extends HopCodeError {
    constructor(code: ConfigErrorCode, message: string, context?: ErrorContext, cause?: unknown);
}
export declare const ConfigErrors: {
    missingCredentials: (provider?: string) => ConfigError;
    invalidConfig: (key: string, reason: string) => ConfigError;
};
export declare class InputError extends HopCodeError {
    constructor(message: string, context?: ErrorContext);
}
export declare class CancellationError extends HopCodeError {
    constructor(message?: string);
}
