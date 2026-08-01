/**
 * MCP Connection Validation
 *
 * Connects directly to the target MCP server, lists tools, and validates
 * schemas before a source is enabled for sessions.
 */
import { type AgentError } from '../agent/errors.ts';
import type { McpTransport } from '../sources/types.ts';
export interface InvalidProperty {
    toolName: string;
    propertyPath: string;
    propertyKey: string;
}
export interface McpValidationResult {
    success: boolean;
    error?: string;
    errorType?: 'failed' | 'needs-auth' | 'pending' | 'invalid-schema' | 'disabled' | 'unknown';
    /** Typed error for API/billing failures - display as ErrorBanner */
    typedError?: AgentError;
    serverInfo?: {
        name: string;
        version: string;
    };
    invalidProperties?: InvalidProperty[];
    /** Tool names available on this server (populated on successful connection) */
    tools?: string[];
}
/**
 * Pattern for valid property names in tool input schemas.
 * Must match: letters, numbers, underscores, dots, hyphens (1-64 chars)
 *
 * Keep schemas conservative so they work across MCP clients and model runtimes.
 */
export declare const TOOL_PROPERTY_NAME_PATTERN: RegExp;
export interface McpValidationConfig {
    /** MCP server URL */
    mcpUrl: string;
    /** Transport type ('http' or 'sse'). Defaults to 'http'. */
    mcpTransport?: McpTransport;
    /** Custom headers for MCP requests (merged before auth headers) */
    mcpHeaders?: Record<string, string>;
    /** Access token for MCP server (OAuth or bearer) */
    mcpAccessToken?: string;
}
/**
 * Validates an MCP connection by opening a direct MCP client and listing tools.
 */
export declare function validateMcpConnection(config: McpValidationConfig): Promise<McpValidationResult>;
export interface StdioValidationConfig {
    /** Command to spawn (e.g., 'npx', 'node') */
    command: string;
    /** Arguments to pass to the command */
    args?: string[];
    /** Environment variables for the spawned process */
    env?: Record<string, string>;
    /** Timeout in ms (default: 30000) */
    timeout?: number;
}
/**
 * Validates a stdio MCP connection by spawning the process and listing tools.
 *
 * Unlike HTTP validation, this actually spawns the MCP server process,
 * connects via stdio transport, and validates the available tools.
 */
export declare function validateStdioMcpConnection(config: StdioValidationConfig): Promise<McpValidationResult>;
/**
 * Get a user-friendly error message based on the validation result.
 * Accepts optional transport context to distinguish local (stdio) vs remote failures.
 */
export declare function getValidationErrorMessage(result: McpValidationResult, context?: {
    transport?: string;
}): string;
