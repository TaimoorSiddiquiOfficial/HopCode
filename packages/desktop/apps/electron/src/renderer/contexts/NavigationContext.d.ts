/**
 * NavigationContext
 *
 * Provides a global `navigate()` function that decouples components from
 * direct session/action imports. All navigation goes through typed routes.
 *
 * PEER PANEL MODEL:
 * All panels are equal. The **focused** panel drives the NavigationState
 * (which determines sidebar highlight, navigator content, etc.).
 * `navigate(route)` updates the focused panel's route.
 *
 * URL-DRIVEN HISTORY:
 * The URL is the source of truth. Every meaningful navigation pushes a
 * browser history entry via pushState. Back/forward uses the browser's
 * native popstate, with smart panel reconciliation to preserve React keys
 * (and thus scroll position, streaming state, etc.).
 *
 * Usage:
 *   import { useNavigation, useNavigationState } from '@/contexts/NavigationContext'
 *   import { routes } from '@/shared/routes'
 *
 *   const { navigate } = useNavigation()
 *   const navState = useNavigationState()
 *
 *   navigate(routes.view.allSessions())
 *   navigate(routes.action.newChat())
 */
import { type ReactNode } from 'react';
import { routes, type Route, type ViewRoute } from '../../shared/routes';
import { type NavigateOptions } from '../lib/navigate';
import type { Session, NavigationState, SessionFilter, RightSidebarPanel } from '../../shared/types';
import { isSessionsNavigation, isSourcesNavigation, isSettingsNavigation, isSkillsNavigation, isSkillMarketplaceNavigation, isAutomationsNavigation } from '../../shared/types';
export { routes };
export type { Route };
export type { NavigationState, SessionFilter };
export { isSessionsNavigation, isSourcesNavigation, isSettingsNavigation, isSkillsNavigation, isSkillMarketplaceNavigation, isAutomationsNavigation, };
interface NavigationContextValue {
    /** Navigate to a route */
    navigate: (route: Route, options?: NavigateOptions) => void | Promise<void>;
    /** Check if navigation is ready */
    isReady: boolean;
    /** Unified navigation state — derived from focused panel + right sidebar */
    navigationState: NavigationState;
    /** Whether we can go back in history */
    canGoBack: boolean;
    /** Whether we can go forward in history */
    canGoForward: boolean;
    /** Go back in history */
    goBack: () => void;
    /** Go forward in history */
    goForward: () => void;
    /** Update right sidebar panel */
    updateRightSidebar: (panel: RightSidebarPanel | undefined) => void;
    /** Toggle right sidebar (with optional panel) */
    toggleRightSidebar: (panel?: RightSidebarPanel) => void;
    /** Navigate to a source (or source list if no slug), preserving the current filter type */
    navigateToSource: (sourceSlug?: string) => void;
    /** Navigate to a session, preserving the current filter type */
    navigateToSession: (sessionId: string) => void;
}
export declare const NavigationContext: import("react").Context<NavigationContextValue | null>;
interface NavigationProviderProps {
    children: ReactNode;
    /** Current workspace ID */
    workspaceId: string | null;
    /** Current workspace slug (used for URL ?ws= param and localStorage) */
    workspaceSlug: string | null;
    /** Switch to a workspace by slug (called on popstate when ?ws= changes) */
    onSwitchWorkspaceBySlug?: (slug: string) => void;
    /** Session creation handler */
    onCreateSession: (workspaceId: string, options?: import('../../shared/types').CreateSessionOptions) => Promise<Session>;
    /** Input change handler for pre-filling chat input */
    onInputChange?: (sessionId: string, value: string) => void;
    /** Get draft input text for a session (reads from ref, no re-render) */
    getDraft?: (sessionId: string) => string;
    /** Auto-delete an empty session (no confirmation needed) */
    onAutoDeleteEmptySession?: (sessionId: string) => void;
    /** Whether the app is ready to navigate */
    isReady?: boolean;
    /** Whether session metadata has been initialized (required for deterministic route restoration) */
    isSessionsReady?: boolean;
    /** Remote workspace ID — when set, sessions with this ID are also considered part of the workspace */
    remoteWorkspaceId?: string | null;
    /** One-shot route to use for a UI-triggered workspace switch, such as selecting a project-tree session. */
    consumeWorkspaceSwitchRoute?: (workspaceId: string) => ViewRoute | null;
}
export declare function NavigationProvider({ children, workspaceId, workspaceSlug, onSwitchWorkspaceBySlug, onCreateSession, getDraft, onAutoDeleteEmptySession, isReady, isSessionsReady, remoteWorkspaceId, consumeWorkspaceSwitchRoute, }: NavigationProviderProps): import("react").JSX.Element;
/**
 * Hook to access navigation functions
 */
export declare function useNavigation(): NavigationContextValue;
/**
 * Hook to access just the navigation state
 */
export declare function useNavigationState(): NavigationState;
