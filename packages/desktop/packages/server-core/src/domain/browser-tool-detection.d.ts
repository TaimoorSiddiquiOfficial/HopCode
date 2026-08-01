/**
 * Browser tool detection helpers.
 *
 * Browser overlay activation is now driven by the unified `browser_tool` only.
 * Tool names can be direct (`browser_tool`) or namespaced
 * (`mcp__session__browser_tool`).
 */
export declare function normalizeBrowserToolName(toolName: string): string | null;
export declare function getBrowserToolCommandVerb(toolInput: unknown): string;
export declare function shouldActivateBrowserOverlay(toolName: string, toolInput: unknown): boolean;
