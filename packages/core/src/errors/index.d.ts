/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
export { HopCodeError, ErrorCategory, isHopCodeError, toHopCodeError, UnknownError, FilesystemError, FilesystemErrors, NetworkError, NetworkErrors, ProviderError, ProviderErrors, ToolError, ToolErrors, ConfigError, ConfigErrors, InputError, CancellationError, } from './types.js';
export type { ErrorContext, ErrorRecord, FilesystemErrorCode, NetworkErrorCode, ProviderErrorCode, ToolErrorCode, ConfigErrorCode, } from './types.js';
export { ErrorLogger, LogLevel, ConsoleSink, FileSink, errorLogger, } from './logger.js';
export type { ErrorSink } from './logger.js';
export { withRetry, withFallback, withinErrorBoundary } from './handlers.js';
export type { RetryOptions, FallbackOptions, ErrorBoundaryOptions, ErrorContext as ErrorBoundaryContext, } from './handlers.js';
export { withinAgentBoundary, withinToolBoundary, withinServiceBoundary, withinUIBoundary, } from './boundaries.js';
export type { AgentBoundaryConfig, ToolBoundaryConfig, ServiceBoundaryConfig, } from './boundaries.js';
