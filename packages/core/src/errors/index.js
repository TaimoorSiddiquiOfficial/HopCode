/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
// Types
export { HopCodeError, ErrorCategory, isHopCodeError, toHopCodeError, UnknownError, FilesystemError, FilesystemErrors, NetworkError, NetworkErrors, ProviderError, ProviderErrors, ToolError, ToolErrors, ConfigError, ConfigErrors, InputError, CancellationError, } from './types.js';
// Logger
export { ErrorLogger, LogLevel, ConsoleSink, FileSink, errorLogger, } from './logger.js';
// Handlers
export { withRetry, withFallback, withinErrorBoundary } from './handlers.js';
// Boundaries
export { withinAgentBoundary, withinToolBoundary, withinServiceBoundary, withinUIBoundary, } from './boundaries.js';
//# sourceMappingURL=index.js.map