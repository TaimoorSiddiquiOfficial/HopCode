/**
 * Pool client for API sources.
 *
 * Connects to an in-process McpServer (created by createSdkMcpServer) via
 * in-memory transport, exposing it through the same PoolClient interface
 * that CraftMcpClient uses for remote MCP sources.
 */
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { PoolClient } from './client.ts';
export declare class ApiSourcePoolClient implements PoolClient {
    private mcpServer;
    private client;
    private connected;
    constructor(mcpServer: McpServer);
    connect(): Promise<void>;
    listTools(): Promise<Tool[]>;
    callTool(name: string, args: Record<string, unknown>): Promise<unknown>;
    close(): Promise<void>;
}
