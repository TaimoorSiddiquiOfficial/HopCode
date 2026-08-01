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
import { HopCodeError } from './types.js';
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
export declare function withinAgentBoundary<T>(config: AgentBoundaryConfig, operation: () => Promise<T>): Promise<T | undefined>;
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
export declare function withinToolBoundary<T>(config: ToolBoundaryConfig, operation: () => Promise<T>): Promise<T | undefined>;
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
export declare function withinServiceBoundary<T>(config: ServiceBoundaryConfig, operation: () => Promise<T>): Promise<T | undefined>;
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
export declare function withinUIBoundary<T>(componentId: string, operation: () => Promise<T>): Promise<T | undefined>;
