/**
 * Built-in Sources
 *
 * System-level sources that are always available in every workspace.
 * These sources are not shown in the sources list UI but are available
 * for the agent to use.
 *
 * NOTE: craft-agents-docs is now an always-available MCP server configured
 * directly in craft-agent.ts, not a source. This file is kept for backwards
 * compatibility but returns empty results.
 */
import type { LoadedSource } from './types.ts';
/**
 * Get all built-in sources for a workspace.
 *
 * Currently returns empty array - craft-agents-docs has been moved to
 * an always-available MCP server in craft-agent.ts.
 *
 * @param _workspaceId - The workspace ID (unused)
 * @param _workspaceRootPath - Absolute path to workspace root folder (unused)
 * @returns Empty array (no built-in sources)
 */
export declare function getBuiltinSources(_workspaceId: string, _workspaceRootPath: string): LoadedSource[];
/**
 * Get the built-in HopCode docs source.
 *
 * @deprecated craft-agents-docs is now an always-available MCP server
 * configured directly in craft-agent.ts. This function is kept for
 * backwards compatibility but returns a placeholder.
 */
export declare function getDocsSource(workspaceId: string, workspaceRootPath: string): LoadedSource;
/**
 * Check if a source slug is a built-in source.
 *
 * Returns false - craft-agents-docs is now an always-available MCP server,
 * not a source in the sources system.
 *
 * @param _slug - Source slug to check (unused)
 * @returns false (no built-in sources)
 */
export declare function isBuiltinSource(_slug: string): boolean;
