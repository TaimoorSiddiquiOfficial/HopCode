/**
 * User-friendly display names for tools.
 *
 * Internal tool names are developer-facing and can be cryptic.
 * This mapping provides cleaner names for the UI.
 */
/**
 * Set of tool names that represent parent task tools (subagent launchers).
 * The SDK renamed 'Task' to 'Agent' in v0.2.72 — both must be recognised.
 * Add future renames here instead of scattering checks across the codebase.
 */
export declare const PARENT_TASK_TOOLS: ReadonlySet<string>;
/** Check whether a tool name is a parent task tool (Task or Agent). */
export declare const isParentTaskTool: (name: string) => boolean;
/**
 * Tools that should be hidden from the UI (purely internal state changes)
 */
export declare const HIDDEN_TOOLS: Set<string>;
/**
 * Get user-friendly display name for a tool.
 *
 * @param toolName - The internal tool name (e.g., "mcp__linear__list_issues")
 * @returns User-friendly display name
 */
export declare function getToolDisplayName(toolName: string): string;
/**
 * Check if a tool should be hidden from the UI
 */
export declare function shouldHideTool(toolName: string): boolean;
