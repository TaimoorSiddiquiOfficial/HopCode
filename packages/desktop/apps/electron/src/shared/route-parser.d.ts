/**
 * Route Parser
 *
 * Parses route strings back into structured navigation objects.
 * Used by both the navigate() function and deep link handler.
 *
 * Supports route formats:
 * - Action: action/{name}[/{id}] - Trigger side effects
 * - Compound: {filter}[/session/{sessionId}] - View routes for full navigation state
 */
import type { NavigationState, SessionFilter, SourceFilter, AutomationFilter, RightSidebarPanel } from './types';
export type RouteType = 'action' | 'view';
export interface ParsedRoute {
    type: RouteType;
    name: string;
    id?: string;
    params: Record<string, string>;
}
export type NavigatorType = 'sessions' | 'sources' | 'skills' | 'skillMarketplace' | 'automations' | 'settings';
export interface ParsedCompoundRoute {
    /** The navigator type */
    navigator: NavigatorType;
    /** Session filter (only for sessions navigator) */
    sessionFilter?: SessionFilter;
    /** Source filter (only for sources navigator) */
    sourceFilter?: SourceFilter;
    /** Automation filter (only for automations navigator) */
    automationFilter?: AutomationFilter;
    /** Details page info (null for empty state) */
    details: {
        type: string;
        id: string;
    } | null;
}
/**
 * Check if a route is a compound route (new format)
 */
export declare function isCompoundRoute(route: string): boolean;
/**
 * Parse a compound route into structured navigation
 *
 * Examples:
 *   'allSessions' -> { navigator: 'sessions', sessionFilter: { kind: 'allSessions' }, details: null }
 *   'allSessions/session/abc123' -> { navigator: 'sessions', sessionFilter: { kind: 'allSessions' }, details: { type: 'session', id: 'abc123' } }
 *   'flagged/session/abc123' -> { navigator: 'sessions', sessionFilter: { kind: 'flagged' }, details: { type: 'session', id: 'abc123' } }
 *   'sources' -> { navigator: 'sources', details: null }
 *   'sources/api' -> { navigator: 'sources', sourceFilter: { kind: 'type', sourceType: 'api' }, details: null }
 *   'sources/mcp' -> { navigator: 'sources', sourceFilter: { kind: 'type', sourceType: 'mcp' }, details: null }
 *   'sources/local' -> { navigator: 'sources', sourceFilter: { kind: 'type', sourceType: 'local' }, details: null }
 *   'sources/source/github' -> { navigator: 'sources', details: { type: 'source', id: 'github' } }
 *   'sources/api/source/gmail' -> { navigator: 'sources', sourceFilter: { kind: 'type', sourceType: 'api' }, details: { type: 'source', id: 'gmail' } }
 *   'settings' -> { navigator: 'settings', details: { type: 'general', id: 'general' } }
 *   'settings/shortcuts' -> { navigator: 'settings', details: { type: 'shortcuts', id: 'shortcuts' } }
 */
export declare function parseCompoundRoute(route: string): ParsedCompoundRoute | null;
/**
 * Build a compound route string from parsed state
 */
export declare function buildCompoundRoute(parsed: ParsedCompoundRoute): string;
/**
 * Parse a route string into structured navigation
 *
 * Examples:
 *   'allSessions' -> { type: 'view', name: 'allSessions', params: {} }
 *   'allSessions/session/abc123' -> { type: 'view', name: 'session', id: 'abc123', params: { filter: 'allSessions' } }
 *   'settings/shortcuts' -> { type: 'view', name: 'shortcuts', params: {} }
 *   'action/new-session' -> { type: 'action', name: 'new-session', params: {} }
 */
export declare function parseRoute(route: string): ParsedRoute | null;
/**
 * Parse a route string directly to NavigationState (the unified state)
 *
 * This is the preferred way to parse routes - returns the unified state that
 * determines all 3 panels (sidebar, navigator, main content).
 *
 * Supports:
 * - Compound routes: allSessions, allSessions/session/abc, sources, sources/source/github, settings/shortcuts
 * - Right sidebar param: ?sidebar=files or ?sidebar=history
 *
 * Returns null for action routes (they don't map to a navigation state) and invalid routes.
 */
export declare function parseRouteToNavigationState(route: string, sidebarParam?: string): NavigationState | null;
/**
 * Build a route string from NavigationState
 */
export declare function buildRouteFromNavigationState(state: NavigationState): string;
/**
 * Parse right sidebar param from URL query string
 *
 * Examples:
 *   'history' -> { type: 'history' }
 *   'files' -> { type: 'files' }
 *   'files/src/main.ts' -> { type: 'files', path: 'src/main.ts' }
 *   'none' -> { type: 'none' }
 */
export declare function parseRightSidebarParam(sidebarStr?: string): RightSidebarPanel | undefined;
/**
 * Build right sidebar param for URL query string
 *
 * Returns undefined for 'none' type (omit from URL to keep URLs clean)
 */
export declare function buildRightSidebarParam(panel?: RightSidebarPanel): string | undefined;
