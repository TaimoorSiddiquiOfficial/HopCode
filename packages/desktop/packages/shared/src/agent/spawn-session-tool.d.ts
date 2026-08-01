/**
 * Spawn Session Tool (spawn_session)
 *
 * Session-scoped tool that enables the main agent to create independent sessions
 * with configurable connection, model, sources, and an initial prompt.
 *
 * Two modes:
 * - help=true: Returns available connections, models, and sources
 * - Default: Creates a session and sends the prompt (fire-and-forget)
 */
import type { SpawnSessionResult, SpawnSessionHelpResult } from './base-agent.ts';
export type SpawnSessionFn = (input: Record<string, unknown>) => Promise<SpawnSessionResult | SpawnSessionHelpResult>;
export interface SpawnSessionToolOptions {
    sessionId: string;
    /**
     * Lazy resolver for the spawn session callback.
     * Called at execution time to get the current callback from the session registry.
     */
    getSpawnSessionFn: () => SpawnSessionFn | undefined;
}
export declare function createSpawnSessionTool(options: SpawnSessionToolOptions): import("../mcp/local-tools.ts").LocalTool;
