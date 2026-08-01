/**
 * Browser tool naming helpers.
 *
 * Canonical runtime tool is `browser_tool`, but we retain compatibility with
 * legacy split tool names (browser_open, browser_snapshot, etc.) that may
 * appear in older sessions/tests/logs.
 */
/** Legacy split browser tool aliases that map to canonical `browser_tool`. */
export declare const LEGACY_BROWSER_TOOL_ALIASES: Set<string>;
/**
 * Normalize canonical browser tool names (`browser_tool`) with optional namespaces.
 * Does NOT accept legacy aliases.
 */
export declare function normalizeCanonicalBrowserToolName(toolName: string): 'browser_tool' | null;
/**
 * Normalize browser tool names (canonical + legacy aliases) to `browser_tool`.
 */
export declare function normalizeBrowserToolName(toolName: string): 'browser_tool' | null;
/**
 * True when a tool name is the canonical browser tool (with optional namespace prefix).
 */
export declare function isCanonicalBrowserToolName(toolName: string): boolean;
/**
 * True when a tool name is the canonical browser tool or a supported legacy alias.
 */
export declare function isBrowserToolNameOrAlias(toolName: string): boolean;
