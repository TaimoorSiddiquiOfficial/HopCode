/**
 * MCP client using official @modelcontextprotocol/sdk
 * Supports both HTTP and stdio transports for remote and local MCP servers
 */
import type { Tool } from '@modelcontextprotocol/sdk/types.js';
/**
 * HTTP transport config for remote MCP servers
 */
export interface HttpMcpClientConfig {
    transport: 'http';
    url: string;
    headers?: Record<string, string>;
}
/**
 * Stdio transport config for local MCP servers (spawns subprocess)
 */
export interface StdioMcpClientConfig {
    transport: 'stdio';
    command: string;
    args?: string[];
    env?: Record<string, string>;
}
/**
 * Unified config supporting both transport types
 */
export type McpClientConfig = HttpMcpClientConfig | StdioMcpClientConfig;
/**
 * Interface for clients managed by McpClientPool.
 * Both CraftMcpClient (remote MCP sources) and ApiSourcePoolClient (API sources) implement this.
 */
export interface PoolClient {
    listTools(): Promise<Tool[]>;
    callTool(name: string, args: Record<string, unknown>): Promise<unknown>;
    close(): Promise<void>;
}
export declare class CraftMcpClient {
    private client;
    private transport;
    private connected;
    constructor(config: McpClientConfig);
    connect(): Promise<void>;
    listTools(): Promise<Tool[]>;
    callTool(name: string, args: Record<string, unknown>): Promise<unknown>;
    close(): Promise<void>;
}
