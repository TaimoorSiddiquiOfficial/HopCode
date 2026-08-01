import type { ActionId } from './definitions';
/**
 * Get the display string for an action's hotkey.
 *
 * @example
 * const hotkey = useHotkeyLabel('app.newChat') // "⌘N" on Mac
 *
 * @example
 * // In a tooltip
 * <Tooltip content={`New Chat ${useHotkeyLabel('app.newChat')}`}>
 */
export declare function useHotkeyLabel(actionId: ActionId): string | null;
/**
 * Get the action label and hotkey for display.
 *
 * @example
 * const { label, hotkey } = useActionLabel('app.newChat')
 * // label: "New Chat", hotkey: "⌘N"
 */
export declare function useActionLabel(actionId: ActionId): {
    label: any;
    description: any;
    hotkey: any;
};
