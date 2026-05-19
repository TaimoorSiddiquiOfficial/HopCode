/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Error categories for routing and handling.
 * Each category maps to specific handling strategies.
 */
export enum ErrorCategory {
  /** User input errors — no retry, show validation message */
  INPUT = 'input',
  /** Configuration errors — no retry, show config fix */
  CONFIG = 'config',
  /** Network errors — retry with backoff */
  NETWORK = 'network',
  /** Provider errors — retry if 5xx, show message if 4xx */
  PROVIDER = 'provider',
  /** File system errors — retry if EBUSY, fail if EACCES */
  FILESYSTEM = 'filesystem',
  /** Tool execution errors — retry if denied, fail if not found */
  TOOL = 'tool',
  /** Internal errors — retry once, then escalate */
  INTERNAL = 'internal',
  /** Cancellation — no retry, cleanup only */
  CANCELLED = 'cancelled',
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
export abstract class HopCodeError extends Error {
  readonly code: string;
  readonly category: ErrorCategory;
  readonly context: ErrorContext;
  readonly recoveryHint?: string;
  readonly isRetryable: boolean;
  readonly isExpected: boolean;

  constructor(
    code: string,
    category: ErrorCategory,
    message: string,
    context?: ErrorContext,
    cause?: unknown,
    recoveryHint?: string,
    isRetryable: boolean = false,
    isExpected: boolean = false,
  ) {
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
  getCause(): unknown {
    return this.cause;
  }

  /**
   * Convert to structured object for logging/telemetry.
   */
  toJSON(): ErrorRecord {
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
  override toString(): string {
    return `${this.constructor.name} [${this.code}]: ${this.message}`;
  }
}

/**
 * Type guard to check if error is a HopCodeError.
 */
export function isHopCodeError(error: unknown): error is HopCodeError {
  return error instanceof HopCodeError;
}

/**
 * Convert unknown error to HopCodeError.
 * Wraps non-HopCodeError errors with context.
 */
export function toHopCodeError(
  error: unknown,
  _defaultCode?: string,
  _defaultCategory?: ErrorCategory,
): HopCodeError {
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
  constructor(
    message: string,
    cause?: unknown,
    code?: string,
    category?: ErrorCategory,
    context?: Record<string, unknown>,
  ) {
    super(
      code ?? 'UNKNOWN_ERROR',
      category ?? ErrorCategory.INTERNAL,
      message,
      context ?? {},
      cause,
      undefined,
      false,
      false,
    );
  }
}

// ============================================================================
// Filesystem Errors
// ============================================================================

export type FilesystemErrorCode =
  | 'FILE_NOT_FOUND'
  | 'PERMISSION_DENIED'
  | 'NO_SPACE_LEFT'
  | 'TARGET_IS_DIRECTORY'
  | 'FILE_CHANGED_SINCE_READ'
  | 'READ_FAILED'
  | 'WRITE_FAILED'
  | 'DIRECTORY_CREATION_FAILED';

export class FilesystemError extends HopCodeError {
  constructor(
    code: FilesystemErrorCode,
    message: string,
    context: { filePath: string; operation: string },
    cause?: unknown,
    recoveryHint?: string,
  ) {
    super(
      code,
      ErrorCategory.FILESYSTEM,
      message,
      context,
      cause,
      recoveryHint,
    );
  }

  get filePath(): string {
    return this.context.filePath!;
  }

  get operation(): string {
    return this.context.operation!;
  }
}

/**
 * Filesystem error factory functions.
 */
export const FilesystemErrors = {
  notFound: (filePath: string): FilesystemError =>
    new FilesystemError('FILE_NOT_FOUND', `File not found: ${filePath}`, {
      filePath,
      operation: 'read',
    }),

  permissionDenied: (filePath: string, operation: string): FilesystemError =>
    new FilesystemError(
      'PERMISSION_DENIED',
      `Permission denied: ${operation} ${filePath}`,
      { filePath, operation },
      undefined,
      'Check file permissions or run with elevated privileges',
    ),

  changedSinceRead: (filePath: string): FilesystemError =>
    new FilesystemError(
      'FILE_CHANGED_SINCE_READ',
      `File modified since read: ${filePath}`,
      { filePath, operation: 'edit' },
      undefined,
      'Re-read the file before editing',
    ),

  writeFailed: (filePath: string, cause?: unknown): FilesystemError =>
    new FilesystemError(
      'WRITE_FAILED',
      `Failed to write file: ${filePath}`,
      { filePath, operation: 'write' },
      cause,
    ),

  directoryCreationFailed: (
    dirPath: string,
    cause?: unknown,
  ): FilesystemError =>
    new FilesystemError(
      'DIRECTORY_CREATION_FAILED',
      `Failed to create directory: ${dirPath}`,
      { filePath: dirPath, operation: 'mkdir' },
      cause,
      'Check parent directory permissions',
    ),
};

// ============================================================================
// Network Errors
// ============================================================================

export type NetworkErrorCode =
  | 'CONNECTION_REFUSED'
  | 'CONNECTION_TIMEOUT'
  | 'DNS_FAILURE'
  | 'SSL_ERROR'
  | 'NETWORK_UNREACHABLE';

export class NetworkError extends HopCodeError {
  constructor(
    code: NetworkErrorCode,
    message: string,
    context?: ErrorContext,
    cause?: unknown,
    isRetryable: boolean = true,
  ) {
    super(
      code,
      ErrorCategory.NETWORK,
      message,
      context,
      cause,
      undefined,
      isRetryable,
    );
  }
}

export const NetworkErrors = {
  connectionRefused: (url?: string): NetworkError =>
    new NetworkError(
      'CONNECTION_REFUSED',
      url ? `Connection refused: ${url}` : 'Connection refused',
      { url },
      undefined,
      true,
    ),

  timeout: (url?: string, timeoutMs?: number): NetworkError =>
    new NetworkError(
      'CONNECTION_TIMEOUT',
      url
        ? `Request timed out after ${timeoutMs}ms: ${url}`
        : `Request timed out after ${timeoutMs}ms`,
      { url, timeoutMs },
      undefined,
      true,
    ),
};

// ============================================================================
// Provider Errors
// ============================================================================

export type ProviderErrorCode =
  | 'RATE_LIMITED'
  | 'SERVICE_UNAVAILABLE'
  | 'INVALID_REQUEST'
  | 'AUTHENTICATION_FAILED'
  | 'QUOTA_EXCEEDED';

export class ProviderError extends HopCodeError {
  constructor(
    code: ProviderErrorCode,
    message: string,
    context?: { provider?: string; httpStatus?: number; retryAfterMs?: number },
    cause?: unknown,
    isRetryable?: boolean,
  ) {
    super(
      code,
      ErrorCategory.PROVIDER,
      message,
      context,
      cause,
      undefined,
      isRetryable ??
        (code === 'RATE_LIMITED' || code === 'SERVICE_UNAVAILABLE'),
    );
  }

  get provider(): string | undefined {
    return this.context.provider as string | undefined;
  }

  get httpStatus(): number | undefined {
    return this.context.httpStatus as number | undefined;
  }

  get retryAfterMs(): number | undefined {
    return this.context.retryAfterMs as number | undefined;
  }
}

export const ProviderErrors = {
  rateLimited: (provider?: string, retryAfterMs?: number): ProviderError =>
    new ProviderError(
      'RATE_LIMITED',
      `Rate limited${provider ? ` by ${provider}` : ''}`,
      { provider, retryAfterMs },
      undefined,
      true,
    ),

  serviceUnavailable: (provider?: string): ProviderError =>
    new ProviderError(
      'SERVICE_UNAVAILABLE',
      `Service unavailable${provider ? `: ${provider}` : ''}`,
      { provider },
      undefined,
      true,
    ),
};

// ============================================================================
// Tool Errors
// ============================================================================

export type ToolErrorCode =
  | 'TOOL_NOT_FOUND'
  | 'INVALID_PARAMS'
  | 'EXECUTION_FAILED'
  | 'EXECUTION_DENIED'
  | 'OUTPUT_TRUNCATED';

export class ToolError extends HopCodeError {
  constructor(
    code: ToolErrorCode,
    message: string,
    context?: { toolName?: string },
    cause?: unknown,
  ) {
    super(code, ErrorCategory.TOOL, message, context, cause);
  }

  get toolName(): string | undefined {
    return this.context.toolName;
  }
}

export const ToolErrors = {
  notFound: (toolName: string): ToolError =>
    new ToolError('TOOL_NOT_FOUND', `Tool not found: ${toolName}`, {
      toolName,
    }),

  invalidParams: (toolName: string, details: string): ToolError =>
    new ToolError(
      'INVALID_PARAMS',
      `Invalid parameters for ${toolName}: ${details}`,
      { toolName },
    ),

  executionFailed: (toolName: string, cause?: unknown): ToolError =>
    new ToolError(
      'EXECUTION_FAILED',
      `Tool execution failed: ${toolName}`,
      { toolName },
      cause,
    ),
};

// ============================================================================
// Config Errors
// ============================================================================

export type ConfigErrorCode =
  | 'MISSING_CREDENTIALS'
  | 'INVALID_CONFIG'
  | 'CONFIG_NOT_FOUND'
  | 'CONFIG_PARSE_ERROR';

export class ConfigError extends HopCodeError {
  constructor(
    code: ConfigErrorCode,
    message: string,
    context?: ErrorContext,
    cause?: unknown,
  ) {
    super(code, ErrorCategory.CONFIG, message, context, cause);
  }
}

export const ConfigErrors = {
  missingCredentials: (provider?: string): ConfigError =>
    new ConfigError(
      'MISSING_CREDENTIALS',
      `Missing credentials${provider ? ` for ${provider}` : ''}`,
      { provider },
    ),

  invalidConfig: (key: string, reason: string): ConfigError =>
    new ConfigError('INVALID_CONFIG', `Invalid config for ${key}: ${reason}`, {
      configKey: key,
    }),
};

// ============================================================================
// Input Errors
// ============================================================================

export class InputError extends HopCodeError {
  constructor(message: string, context?: ErrorContext) {
    super('INVALID_INPUT', ErrorCategory.INPUT, message, context);
  }
}

// ============================================================================
// Cancellation Errors
// ============================================================================

export class CancellationError extends HopCodeError {
  constructor(message: string = 'Operation cancelled') {
    super(
      'CANCELLED',
      ErrorCategory.CANCELLED,
      message,
      {},
      undefined,
      undefined,
      false,
      true,
    );
  }
}
