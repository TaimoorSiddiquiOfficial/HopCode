/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Error categories for routing and handling.
 * Each category maps to specific handling strategies.
 */
export var ErrorCategory;
(function (ErrorCategory) {
    /** User input errors — no retry, show validation message */
    ErrorCategory["INPUT"] = "input";
    /** Configuration errors — no retry, show config fix */
    ErrorCategory["CONFIG"] = "config";
    /** Network errors — retry with backoff */
    ErrorCategory["NETWORK"] = "network";
    /** Provider errors — retry if 5xx, show message if 4xx */
    ErrorCategory["PROVIDER"] = "provider";
    /** File system errors — retry if EBUSY, fail if EACCES */
    ErrorCategory["FILESYSTEM"] = "filesystem";
    /** Tool execution errors — retry if denied, fail if not found */
    ErrorCategory["TOOL"] = "tool";
    /** Internal errors — retry once, then escalate */
    ErrorCategory["INTERNAL"] = "internal";
    /** Cancellation — no retry, cleanup only */
    ErrorCategory["CANCELLED"] = "cancelled";
})(ErrorCategory || (ErrorCategory = {}));
/**
 * Base class for all HopCode errors.
 * Provides standard metadata for logging, recovery, and user messaging.
 */
export class HopCodeError extends Error {
    code;
    category;
    context;
    recoveryHint;
    isRetryable;
    isExpected;
    constructor(code, category, message, context, cause, recoveryHint, isRetryable = false, isExpected = false) {
        super(message, { cause });
        this.code = code;
        this.category = category;
        this.context = context ?? {};
        this.recoveryHint = recoveryHint;
        this.isRetryable = isRetryable;
        this.isExpected = isExpected;
    }
    /**
     * Get the cause of this error.
     * Provided for explicit access to the error chain.
     */
    getCause() {
        return this.cause;
    }
    /**
     * Convert to structured object for logging/telemetry.
     */
    toJSON() {
        return {
            name: this.constructor.name,
            code: this.code,
            category: this.category,
            message: this.message,
            context: this.context,
            recoveryHint: this.recoveryHint,
            isRetryable: this.isRetryable,
            isExpected: this.isExpected,
            stack: this.stack,
            cause: this.cause,
            timestamp: new Date().toISOString(),
        };
    }
    /**
     * Override toString for better debugging.
     */
    toString() {
        return `${this.constructor.name} [${this.code}]: ${this.message}`;
    }
}
/**
 * Type guard to check if error is a HopCodeError.
 */
export function isHopCodeError(error) {
    return error instanceof HopCodeError;
}
/**
 * Convert unknown error to HopCodeError.
 * Wraps non-HopCodeError errors with context.
 */
export function toHopCodeError(error, _defaultCode, _defaultCategory) {
    if (error instanceof HopCodeError) {
        return error;
    }
    const message = error instanceof Error ? error.message : String(error);
    return new UnknownError(message, error);
}
/**
 * Unknown error — used as fallback for unclassified errors.
 */
export class UnknownError extends HopCodeError {
    constructor(message, cause, code, category, context) {
        super(code ?? 'UNKNOWN_ERROR', category ?? ErrorCategory.INTERNAL, message, context ?? {}, cause, undefined, false, false);
    }
}
export class FilesystemError extends HopCodeError {
    constructor(code, message, context, cause, recoveryHint) {
        super(code, ErrorCategory.FILESYSTEM, message, context, cause, recoveryHint);
    }
    get filePath() {
        return this.context.filePath;
    }
    get operation() {
        return this.context.operation;
    }
}
/**
 * Filesystem error factory functions.
 */
export const FilesystemErrors = {
    notFound: (filePath) => new FilesystemError('FILE_NOT_FOUND', `File not found: ${filePath}`, {
        filePath,
        operation: 'read',
    }),
    permissionDenied: (filePath, operation) => new FilesystemError('PERMISSION_DENIED', `Permission denied: ${operation} ${filePath}`, { filePath, operation }, undefined, 'Check file permissions or run with elevated privileges'),
    changedSinceRead: (filePath) => new FilesystemError('FILE_CHANGED_SINCE_READ', `File modified since read: ${filePath}`, { filePath, operation: 'edit' }, undefined, 'Re-read the file before editing'),
    writeFailed: (filePath, cause) => new FilesystemError('WRITE_FAILED', `Failed to write file: ${filePath}`, { filePath, operation: 'write' }, cause),
    directoryCreationFailed: (dirPath, cause) => new FilesystemError('DIRECTORY_CREATION_FAILED', `Failed to create directory: ${dirPath}`, { filePath: dirPath, operation: 'mkdir' }, cause, 'Check parent directory permissions'),
};
export class NetworkError extends HopCodeError {
    constructor(code, message, context, cause, isRetryable = true) {
        super(code, ErrorCategory.NETWORK, message, context, cause, undefined, isRetryable);
    }
}
export const NetworkErrors = {
    connectionRefused: (url) => new NetworkError('CONNECTION_REFUSED', url ? `Connection refused: ${url}` : 'Connection refused', { url }, undefined, true),
    timeout: (url, timeoutMs) => new NetworkError('CONNECTION_TIMEOUT', url
        ? `Request timed out after ${timeoutMs}ms: ${url}`
        : `Request timed out after ${timeoutMs}ms`, { url, timeoutMs }, undefined, true),
};
export class ProviderError extends HopCodeError {
    constructor(code, message, context, cause, isRetryable) {
        super(code, ErrorCategory.PROVIDER, message, context, cause, undefined, isRetryable ??
            (code === 'RATE_LIMITED' || code === 'SERVICE_UNAVAILABLE'));
    }
    get provider() {
        return this.context.provider;
    }
    get httpStatus() {
        return this.context.httpStatus;
    }
    get retryAfterMs() {
        return this.context.retryAfterMs;
    }
}
export const ProviderErrors = {
    rateLimited: (provider, retryAfterMs) => new ProviderError('RATE_LIMITED', `Rate limited${provider ? ` by ${provider}` : ''}`, { provider, retryAfterMs }, undefined, true),
    serviceUnavailable: (provider) => new ProviderError('SERVICE_UNAVAILABLE', `Service unavailable${provider ? `: ${provider}` : ''}`, { provider }, undefined, true),
};
export class ToolError extends HopCodeError {
    constructor(code, message, context, cause) {
        super(code, ErrorCategory.TOOL, message, context, cause);
    }
    get toolName() {
        return this.context.toolName;
    }
}
export const ToolErrors = {
    notFound: (toolName) => new ToolError('TOOL_NOT_FOUND', `Tool not found: ${toolName}`, {
        toolName,
    }),
    invalidParams: (toolName, details) => new ToolError('INVALID_PARAMS', `Invalid parameters for ${toolName}: ${details}`, { toolName }),
    executionFailed: (toolName, cause) => new ToolError('EXECUTION_FAILED', `Tool execution failed: ${toolName}`, { toolName }, cause),
};
export class ConfigError extends HopCodeError {
    constructor(code, message, context, cause) {
        super(code, ErrorCategory.CONFIG, message, context, cause);
    }
}
export const ConfigErrors = {
    missingCredentials: (provider) => new ConfigError('MISSING_CREDENTIALS', `Missing credentials${provider ? ` for ${provider}` : ''}`, { provider }),
    invalidConfig: (key, reason) => new ConfigError('INVALID_CONFIG', `Invalid config for ${key}: ${reason}`, {
        configKey: key,
    }),
};
// ============================================================================
// Input Errors
// ============================================================================
export class InputError extends HopCodeError {
    constructor(message, context) {
        super('INVALID_INPUT', ErrorCategory.INPUT, message, context);
    }
}
// ============================================================================
// Cancellation Errors
// ============================================================================
export class CancellationError extends HopCodeError {
    constructor(message = 'Operation cancelled') {
        super('CANCELLED', ErrorCategory.CANCELLED, message, {}, undefined, undefined, false, true);
    }
}
//# sourceMappingURL=types.js.map