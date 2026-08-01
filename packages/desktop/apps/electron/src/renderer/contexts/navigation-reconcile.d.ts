import type { ViewRoute } from '../../shared/routes';
import type { NavigationState } from '../../shared/types';
export type AutoSelectionResolver = (state: NavigationState) => NavigationState;
/**
 * Normalize a panel route during URL reconciliation.
 *
 * Ensures filter-only routes (e.g. `allSessions`) can be upgraded to
 * canonical detail routes (e.g. `allSessions/session/{id}`) via the same
 * auto-selection policy used by normal navigation.
 */
export declare function normalizePanelRouteForReconcile(route: ViewRoute, resolveAutoSelection: AutoSelectionResolver): ViewRoute;
