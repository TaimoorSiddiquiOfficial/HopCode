/**
 * Server spawner — start a headless HopCode server as a child process.
 *
 * Spawns `bun run <serverEntry>`, reads stdout for the `CRAFT_SERVER_URL=`
 * and `CRAFT_SERVER_TOKEN=` lines, and returns a handle to stop the server.
 */
export interface SpawnedServer {
    url: string;
    token: string;
    stop: () => Promise<void>;
}
export interface SpawnServerOptions {
    /** Path to the server entry file. Auto-detected from monorepo root if omitted. */
    serverEntry?: string;
    /** Extra env vars to pass to the server process. */
    env?: Record<string, string>;
    /** How long to wait for the server to print its URL (ms). Default: 30000. */
    startupTimeout?: number;
    /** Suppress server stderr output (useful for validation where only test output matters). */
    quiet?: boolean;
}
export declare function spawnServer(opts?: SpawnServerOptions): Promise<SpawnedServer>;
