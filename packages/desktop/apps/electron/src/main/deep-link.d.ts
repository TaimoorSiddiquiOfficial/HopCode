/**
 * Deep Link Handler
 *
 * Parses craftagents:// URLs and routes to appropriate actions.
 *
 * URL Formats (workspace is optional - uses active window if omitted):
 *
 * Compound format (hierarchical navigation):
 *   craftagents://allSessions[/session/{sessionId}]            - Session list (all sessions)
 *   craftagents://flagged[/session/{sessionId}]             - Session list (flagged filter)
 *   craftagents://state/{stateId}[/session/{sessionId}]     - Session list (state filter)
 *   craftagents://sources[/source/{sourceSlug}]          - Sources list
 *   craftagents://settings[/{subpage}]                   - Settings (general, shortcuts, preferences)
 *
 * Action format:
 *   craftagents://action/{actionName}[/{id}][?params]
 *   craftagents://workspace/{workspaceId}/action/{actionName}[?params]
 *
 * Actions:
 *   new-chat                  - Create new chat, optional ?input=text&name=name&send=true
 *                               If send=true is provided with input, immediately sends the message
 *   resume-sdk-session/{id}   - Resume backend session by SDK session ID
 *   delete-session/{id}       - Delete session
 *   flag-session/{id}         - Flag session
 *   unflag-session/{id}       - Unflag session
 *
 * Examples:
 *   craftagents://allSessions                               (all sessions view)
 *   craftagents://allSessions/session/abc123                (specific session)
 *   craftagents://settings/shortcuts                     (shortcuts page)
 *   craftagents://sources/source/github                  (github source info)
 *   craftagents://action/new-chat                        (uses active window)
 *   craftagents://action/resume-sdk-session/{sdkId}      (resume backend session)
 *   craftagents://workspace/ws123/allSessions/session/abc123   (targets specific workspace)
 */
import type { WindowManager } from './window-manager';
import type { EventSink } from '@craft-agent/server-core/transport';
export interface DeepLinkTarget {
    /** Workspace ID - undefined means use active window */
    workspaceId?: string;
    /** Compound route format (e.g., 'allSessions/session/abc123', 'settings/shortcuts') */
    view?: string;
    /** Action route (e.g., 'new-chat', 'delete-session') */
    action?: string;
    actionParams?: Record<string, string>;
    /** Window mode - if set, opens in a new window instead of navigating in existing */
    windowMode?: 'focused' | 'full';
    /** Right sidebar param (e.g., 'files/path/to/file', 'history') */
    rightSidebar?: string;
}
export interface DeepLinkResult {
    success: boolean;
    error?: string;
    windowId?: number;
}
/**
 * Navigation payload sent to renderer via IPC
 */
export interface DeepLinkNavigation {
    /** Compound route format (e.g., 'allSessions/session/abc123', 'settings/shortcuts') */
    view?: string;
    /** Action route (e.g., 'new-chat', 'delete-session') */
    action?: string;
    actionParams?: Record<string, string>;
}
/**
 * Parse a deep link URL into structured target
 */
export declare function parseDeepLink(url: string): DeepLinkTarget | null;
/**
 * Handle a deep link by navigating to the target
 */
export declare function handleDeepLink(url: string, windowManager: WindowManager, sink?: EventSink, resolveClientId?: (webContentsId: number) => string | undefined, preferredClientId?: string): Promise<DeepLinkResult>;
