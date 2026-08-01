/**
 * Navigation Utilities
 *
 * Provides a unified `navigate()` function for internal navigation.
 * Works by dispatching a custom event that the NavigationContext listens for.
 *
 * Usage:
 *   import { navigate, routes } from '@/lib/navigate'
 *
 *   navigate(routes.tab.settings())
 *   navigate(routes.action.newChat({ agentId: 'hopcode' }))
 *   navigate(routes.view.allSessions())
 */
import { routes, type Route } from '../../shared/routes';
export { routes };
export type { Route };
export declare const NAVIGATE_EVENT = "craft-agent-navigate";
export interface NavigateOptions {
    /** Open the target in a new panel instead of navigating the current one */
    newPanel?: boolean;
    /**
     * Optional explicit lane target for new-panel opens.
     *
     * This is intentionally generic (not browser-specific) so future lane types
     * can reuse the same API without introducing per-feature navigation flags.
     */
    targetLaneId?: 'main';
    /** Skip auto-selecting first item when navigating to a list view (used when closing panels) */
    skipAutoSelect?: boolean;
}
/**
 * Navigate to a route
 *
 * This dispatches a custom event that the NavigationContext listens for.
 * Can be called from anywhere in the app.
 */
export declare function navigate(route: Route, options?: NavigateOptions): void;
