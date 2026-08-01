/**
 * MCP Pool Server
 *
 * Serves McpClientPool tools over HTTP using the MCP Streamable HTTP protocol.
 * This allows external backend subprocesses to access pool-managed
 * MCP source tools through a single HTTP endpoint instead of connecting to each
 * source independently.
 *
 * Uses Streamable HTTP transport in stateless mode because Codex uses the
 * Streamable HTTP protocol (POST-based JSON-RPC). Stateless mode means no
 * session tracking — each request is independent.
 *
 * Architecture:
 *   Backend subprocess
 *       ↓ (HTTP Streamable HTTP protocol)
 *   McpPoolServer (this, in Electron main process)
 *       ↓
 *   McpClientPool
 *       ↓ (per-source MCP connections)
 *   Linear / GitHub / Notion / etc.
 */
import type { McpClientPool } from './mcp-pool.ts';
export declare class McpPoolServer {
    private pool;
    private httpServer;
    private mcpServer;
    private transport;
    private debugFn;
    private _port;
    constructor(pool: McpClientPool, options?: {
        debug?: (msg: string) => void;
    });
    private debug;
    get port(): number;
    get url(): string;
    /**
     * Start the HTTP MCP server on a random port.
     * Returns the URL clients should connect to.
     */
    start(): Promise<string>;
    /**
     * Create an MCP Server instance wired to the pool.
     * Tools from pool use `mcp__craft__search_spaces` naming internally.
     * We strip the `mcp__` prefix so Codex (which adds its own `mcp__sources__`
     * prefix based on the POOL_SERVER_MCP_NAME) sees clean names:
     *   pool internal: mcp__craft__search_spaces
     *   exposed here:  craft__search_spaces
     *   Codex sees:    mcp__sources__craft__search_spaces
     */
    private createMcpServer;
    /**
     * Notify that the tool list has changed.
     * In stateless mode this is a no-op — source changes already trigger
     * `regenCodexConfigAndReconnect()` which restarts the app-server,
     * and it re-discovers tools on startup.
     */
    notifyToolsChanged(): void;
    /**
     * Stop the HTTP server and close the transport.
     */
    stop(): Promise<void>;
}
