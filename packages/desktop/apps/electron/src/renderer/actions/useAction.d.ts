import type { ActionId } from './definitions';
/**
 * Register a handler for an action.
 *
 * @example
 * useAction('app.newChat', () => handleNewChat())
 *
 * @example
 * // With enabled condition
 * useAction('navigator.selectAll', selectAll, {
 *   enabled: () => zoneRef.current?.contains(document.activeElement) ?? false
 * })
 */
export declare function useAction(actionId: ActionId, handler: () => void, options?: {
    enabled?: () => boolean;
}, deps?: unknown[]): void;
