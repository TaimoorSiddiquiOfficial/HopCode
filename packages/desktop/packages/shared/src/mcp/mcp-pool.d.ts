/**
 * Centralized MCP Client Pool
 *
 * Owns all MCP source connections in the main Electron process.
 * Backends receive proxy tool definitions
 * and route tool calls through this pool instead of managing MCP connections
 * themselves.
 *
 * Benefits:
 * - One MCP code path for all backends
 * - Shared clients across sessions (e.g., same Linear connection)
 * - No credential cache files — main process has direct access
 * - Runtime source switching without session restart
 */
import { type PoolClient } from './client.ts';
import type { SdkMcpServerConfig } from '../agent/backend/types.ts';
import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
/**
 * Configuration for an in-process API source server.
 * Used by sync() to connect API sources alongside MCP sources.
 */
export interface ApiServerConfig {
    type: 'sdk';
    instance: McpServer;
}
/**
 * Proxy tool definition — the format passed to backends for registration.
 * Uses mcp__{slug}__{toolName} naming convention.
 */
export interface ProxyToolDef {
    name: string;
    description: string;
    inputSchema: Record<string, unknown>;
}
/**
 * Result of an MCP tool call, matching the subprocess protocol format.
 */
export interface McpToolResult {
    content: string;
    isError: boolean;
    /** Source slug for error attribution (set on failure) */
    sourceSlug?: string;
}
export declare class McpClientPool {
    /** Active MCP clients keyed by source slug */
    private clients;
    /** Configs used for active MCP connections (for change detection during sync) */
    protected activeConfigs: Map<string, SdkMcpServerConfig>;
    /** Cached tool lists keyed by source slug */
    private toolCache;
    /** Proxy tool name → { slug, originalName } (e.g., "mcp__linear__createIssue" → { slug: "linear", originalName: "createIssue" }) */
    private proxyTools;
    /** Optional debug logger */
    private debugFn;
    /** Workspace root path for local MCP filtering */
    private workspaceRootPath?;
    /** Session storage path for saving large responses */
    private sessionPath?;
    /** Summarize callback for large response handling */
    private summarizeCallback?;
    /** Called after sync() connects/disconnects sources, so clients can be notified */
    onToolsChanged?: () => void;
    constructor(options?: {
        debug?: (msg: string) => void;
        workspaceRootPath?: string;
        sessionPath?: string;
    });
    /**
     * Set the summarize callback for large response handling.
     * Typically called after agent creation: pool.setSummarizeCallback(agent.getSummarizeCallback())
     */
    setSummarizeCallback(fn: (prompt: string) => Promise<string | null>): void;
    private debug;
    /**
     * Register a client: connect, cache tools, build proxy mappings.
     * Shared logic for both remote MCP and in-process API sources.
     */
    protected registerClient(slug: string, client: PoolClient): Promise<void>;
    /**
     * Connect to an MCP source server (remote HTTP/SSE/stdio).
     * If already connected, this is a no-op.
     */
    connect(slug: string, config: SdkMcpServerConfig): Promise<void>;
    /**
     * Connect to an in-process MCP server (API source) via in-memory transport.
     */
    connectInProcess(slug: string, mcpServer: McpServer): Promise<void>;
    /**
     * Disconnect a source and remove its tools from the pool.
     */
    disconnect(slug: string): Promise<void>;
    /**
     * Disconnect all sources and clear all state.
     */
    disconnectAll(): Promise<void>;
    /**
     * Sync the pool to match a desired set of MCP + API sources.
     * Connects new sources, disconnects removed ones, keeps existing ones.
     *
     * @param mcpServers - Map of slug → config for desired MCP sources
     * @param apiServers - Map of slug → config for desired API sources
     * @returns List of slugs that failed to connect
     */
    sync(mcpServers: Record<string, SdkMcpServerConfig>, apiServers?: Record<string, ApiServerConfig>): Promise<string[]>;
    /**
     * Get cached tools for a source. Returns empty array if not connected.
     */
    getTools(slug: string): Tool[];
    /**
     * Get all connected source slugs.
     */
    getConnectedSlugs(): string[];
    /**
     * Check if a source is connected.
     */
    isConnected(slug: string): boolean;
    /**
     * Generate proxy tool definitions for all connected sources (or a subset).
     * These are passed to backends for tool registration.
     */
    getProxyToolDefs(slugs?: string[]): ProxyToolDef[];
    /**
     * Execute an MCP tool by its proxy name (mcp__{slug}__{toolName}).
     * Returns a result matching the subprocess protocol format.
     */
    callTool(proxyName: string, args: Record<string, unknown>): Promise<McpToolResult>;
    /**
     * Check if a tool name is an MCP proxy tool managed by this pool.
     */
    isProxyTool(toolName: string): boolean;
}
