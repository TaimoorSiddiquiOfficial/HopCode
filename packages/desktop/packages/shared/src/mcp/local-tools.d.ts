import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { CallToolResult, ToolAnnotations } from '@modelcontextprotocol/sdk/types.js';
import type { z } from 'zod';
type ToolShape = z.ZodRawShape;
type ToolHandler<Args extends ToolShape> = (args: z.output<z.ZodObject<Args>>) => CallToolResult | Promise<CallToolResult>;
export interface LocalTool {
    name: string;
    description: string;
    inputSchema: ToolShape;
    handler: (args: Record<string, unknown>) => CallToolResult | Promise<CallToolResult>;
    annotations?: ToolAnnotations;
}
export declare function localTool<Args extends ToolShape>(name: string, description: string, inputSchema: Args, handler: ToolHandler<Args>, options?: {
    annotations?: ToolAnnotations;
}): LocalTool;
export declare function createLocalMcpServer(args: {
    name: string;
    version: string;
    tools: LocalTool[];
}): McpServer;
export {};
