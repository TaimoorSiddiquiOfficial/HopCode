/**
 * Error Boundaries Module
 *
 * Provides pre-configured error boundaries for common execution contexts:
 * - Agent execution (cancellation, max turns)
 * - Tool execution (not found, invalid params)
 * - Service execution (connection, timeout)
 *
 * Each boundary wraps `withinErrorBoundary` with context-specific configuration.
 *
 * @module errors/boundaries
 */

import { withinErrorBoundary } from './handlers.js';
import type {
  ErrorBoundaryOptions,
  ErrorContext as HandlerErrorContext,
} from './handlers.js';
import {
  HopCodeError,
  CancellationError,
  InputError,
  ToolError,
  isHopCodeError,
} from './types.js';
import { errorLogger } from './logger.js';

/**
 * Configuration for agent execution boundary.
 */
export interface AgentBoundaryConfig {
  agentId: string;
  expectedErrorCodes?: string[];
  onError?: (error: HopCodeError) => void;
}

/**
 * Agent execution boundary.
 * Catches errors during agent execution and handles appropriately.
 *
 * Expected errors (logged at INFO level):
 * - CANCELLED: User cancelled the operation
 * - MAX_TURNS: Agent reached maximum turn limit
 *
 * Unexpected errors (logged at ERROR level):
 * - All other HopCodeError instances
 * - Unknown errors (wrapped)
 *
 * @param config - Agent boundary configuration
 * @param operation - Async operation to execute
 * @returns Operation result or undefined on error
 *
 * @example
 * ```typescript
 * const result = await withinAgentBoundary(
 *   { agentId: 'research-agent' },
 *   async () => await runAgent('research-agent')
 * );
 * ```
 */
export async function withinAgentBoundary<T>(
  config: AgentBoundaryConfig,
  operation: () => Promise<T>,
): Promise<T | undefined> {
  const handlerContext: HandlerErrorContext = {
    operation: 'agent-execution',
    metadata: { agentId: config.agentId },
  };

  const boundaryConfig: ErrorBoundaryOptions = {
    shouldCatch: (error: unknown) => {
      // Catch CancellationError and MAX_TURNS errors
      if (error instanceof CancellationError) return true;
      if (error instanceof HopCodeError && error.code === 'MAX_TURNS')
        return true;
      return false;
    },
    onError: (error: unknown) => {
      if (error instanceof HopCodeError) {
        if (config.onError) {
          config.onError(error);
        } else {
          errorLogger.error('Agent execution error', {
            error: error.toJSON(),
            agentId: config.agentId,
          });
        }
      }
    },
  };

  try {
    return await withinErrorBoundary(operation, handlerContext, boundaryConfig);
  } catch (error) {
    // Expected errors are caught by withinErrorBoundary and rethrown
    // Check if this is an expected error we should handle
    if (
      error instanceof CancellationError ||
      (error instanceof HopCodeError && error.code === 'MAX_TURNS')
    ) {
      return undefined;
    }
    // Rethrow unexpected errors
    throw error;
  }
}

/**
 * Configuration for tool execution boundary.
 */
export interface ToolBoundaryConfig {
  toolName: string;
  expectedErrorCodes?: string[];
  onError?: (error: HopCodeError) => void;
}

/**
 * Tool execution boundary.
 * Catches errors during tool execution and formats for model.
 *
 * Expected errors (logged at INFO level):
 * - TOOL_NOT_FOUND: Tool does not exist
 * - INVALID_PARAMS: Tool parameters validation failed
 * - TOOL_EXECUTION: Tool execution failed (expected failures)
 *
 * Unexpected errors (logged at ERROR level):
 * - All other HopCodeError instances
 * - Unknown errors (wrapped)
 *
 * @param config - Tool boundary configuration
 * @param operation - Async operation to execute
 * @returns Operation result or undefined on error
 *
 * @example
 * ```typescript
 * const result = await withinToolBoundary(
 *   { toolName: 'file_read' },
 *   async () => await readFile('/path/to/file')
 * );
 * ```
 */
export async function withinToolBoundary<T>(
  config: ToolBoundaryConfig,
  operation: () => Promise<T>,
): Promise<T | undefined> {
  const handlerContext: HandlerErrorContext = {
    operation: 'tool-execution',
    metadata: { toolName: config.toolName },
  };

  const boundaryConfig: ErrorBoundaryOptions = {
    shouldCatch: (error: unknown) => {
      // Catch expected tool errors
      if (
        error instanceof ToolError &&
        ['TOOL_NOT_FOUND', 'EXECUTION_FAILED'].includes(error.code)
      )
        return true;
      if (error instanceof InputError) return true;
      return false;
    },
    onError: (error: unknown) => {
      if (error instanceof HopCodeError) {
        if (config.onError) {
          config.onError(error);
        } else {
          errorLogger.error('Tool execution error', {
            error: error.toJSON(),
            toolName: config.toolName,
          });
        }
      }
    },
  };

  try {
    return await withinErrorBoundary(operation, handlerContext, boundaryConfig);
  } catch (error) {
    // Expected errors are caught by withinErrorBoundary and rethrown
    // Check if this is an expected error we should handle
    if (
      error instanceof ToolError &&
      ['TOOL_NOT_FOUND', 'EXECUTION_FAILED'].includes(error.code)
    ) {
      return undefined;
    }
    if (error instanceof InputError) {
      return undefined;
    }
    // Rethrow unexpected errors
    throw error;
  }
}

/**
 * Configuration for service execution boundary.
 */
export interface ServiceBoundaryConfig {
  serviceName: string;
  expectedErrorCodes?: string[];
  onError?: (error: HopCodeError) => void;
  retryable?: boolean;
}

/**
 * Service execution boundary.
 * Catches errors during service execution (API calls, database, etc.).
 *
 * Expected errors (logged at WARN level):
 * - CONNECTION_REFUSED: Service unavailable
 * - TIMEOUT: Request timeout
 * - SERVICE_UNAVAILABLE: Service temporarily down
 *
 * Unexpected errors (logged at ERROR level):
 * - All other HopCodeError instances
 * - Unknown errors (wrapped)
 *
 * @param config - Service boundary configuration
 * @param operation - Async operation to execute
 * @returns Operation result or undefined on error
 *
 * @example
 * ```typescript
 * const result = await withinServiceBoundary(
 *   { serviceName: 'github-api', retryable: true },
 *   async () => await fetchGitHubData()
 * );
 * ```
 */
export async function withinServiceBoundary<T>(
  config: ServiceBoundaryConfig,
  operation: () => Promise<T>,
): Promise<T | undefined> {
  const handlerContext: HandlerErrorContext = {
    operation: 'service-execution',
    metadata: { serviceName: config.serviceName },
  };

  const boundaryConfig: ErrorBoundaryOptions = {
    shouldCatch: (error: unknown) => {
      // Catch expected service errors
      if (isHopCodeError(error)) {
        return [
          'CONNECTION_REFUSED',
          'TIMEOUT',
          'SERVICE_UNAVAILABLE',
        ].includes(error.code);
      }
      return false;
    },
    onError: (error: unknown) => {
      if (error instanceof HopCodeError) {
        if (config.onError) {
          config.onError(error);
        } else {
          errorLogger.error('Service execution error', {
            error: error.toJSON(),
            serviceName: config.serviceName,
          });
        }
      }
    },
  };

  try {
    return await withinErrorBoundary(operation, handlerContext, boundaryConfig);
  } catch (error) {
    // Expected errors are caught by withinErrorBoundary and rethrown
    // Check if this is an expected error we should handle
    if (
      isHopCodeError(error) &&
      ['CONNECTION_REFUSED', 'TIMEOUT', 'SERVICE_UNAVAILABLE'].includes(
        error.code,
      )
    ) {
      return undefined;
    }
    // Rethrow unexpected errors
    throw error;
  }
}

/**
 * UI rendering boundary.
 * Catches errors during UI component rendering.
 *
 * Expected errors (logged at WARN level):
 * - RENDER_ERROR: Component render failed
 * - STATE_ERROR: Invalid component state
 *
 * @param componentId - Component identifier
 * @param operation - Render operation
 * @returns Operation result or undefined on error
 *
 * @example
 * ```typescript
 * const result = await withinUIBoundary(
 *   'ChatMessage',
 *   async () => await renderChatMessage(props)
 * );
 * ```
 */
export async function withinUIBoundary<T>(
  componentId: string,
  operation: () => Promise<T>,
): Promise<T | undefined> {
  const handlerContext: HandlerErrorContext = {
    operation: 'ui-rendering',
    metadata: { componentId },
  };

  const boundaryConfig: ErrorBoundaryOptions = {
    shouldCatch: (error: unknown) => {
      // Catch expected UI errors
      if (isHopCodeError(error)) {
        return ['RENDER_ERROR', 'STATE_ERROR'].includes(error.code);
      }
      return false;
    },
    onError: (error: unknown) => {
      if (error instanceof HopCodeError) {
        errorLogger.warn('UI rendering error', {
          error: error.toJSON(),
          componentId,
        });
      }
    },
  };

  try {
    return await withinErrorBoundary(operation, handlerContext, boundaryConfig);
  } catch (error) {
    // Expected errors are caught by withinErrorBoundary and rethrown
    // Check if this is an expected error we should handle
    if (
      isHopCodeError(error) &&
      ['RENDER_ERROR', 'STATE_ERROR'].includes(error.code)
    ) {
      return undefined;
    }
    // Rethrow unexpected errors
    throw error;
  }
}
