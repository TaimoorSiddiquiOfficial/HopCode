/**
 * Keybinding Context
 *
 * Provides context keys for when-clause evaluation in the action registry.
 * Inspired by VSCode's context keys but much simpler.
 *
 * Context is computed at keydown time from the DOM + a module-level ref.
 * No React state, no re-renders — just a synchronous snapshot.
 */
import type { FocusZoneId } from '@/context/FocusContext';
/**
 * Context keys available in when-clause expressions.
 * All values are boolean — evaluated by `evaluateWhen()`.
 */
export interface KeybindingContext {
    /** A text input (INPUT, TEXTAREA, contentEditable) has focus */
    inputFocus: boolean;
    /** Text is selected within a focused input */
    hasSelection: boolean;
    /** Chat focus zone is active */
    chatFocus: boolean;
    /** Navigator focus zone is active */
    navigatorFocus: boolean;
    /** Sidebar focus zone is active */
    sidebarFocus: boolean;
    /** A modal dialog or dropdown/popover is open */
    menuOpen: boolean;
}
export declare function setCurrentZone(zone: FocusZoneId | null): void;
/**
 * Build a context snapshot from DOM state at event time.
 * Called synchronously in the keyboard handler's capture phase.
 */
export declare function getKeybindingContext(e: KeyboardEvent): KeybindingContext;
/**
 * Evaluate a when-clause expression against the current context.
 *
 * Syntax (subset of VSCode's when-clause syntax):
 *   undefined        → always true (action fires everywhere)
 *   'inputFocus'     → true when input has focus
 *   '!inputFocus'    → true when input does NOT have focus
 *   'a && b'         → logical AND (all terms must be true)
 *   'a || b'         → logical OR  (any group must be true)
 *   'a && !b || c'   → OR has lower precedence than AND
 *
 * @example evaluateWhen(undefined, ctx)                // always true
 * @example evaluateWhen('!inputFocus', ctx)            // outside text inputs
 * @example evaluateWhen('chatFocus && !hasSelection', ctx)
 */
export declare function evaluateWhen(when: string | undefined, ctx: KeybindingContext): boolean;
