import * as React from "react";
/**
 * Focus zone identifiers - ordered for Tab navigation
 */
export type FocusZoneId = 'sidebar' | 'navigator' | 'chat';
/**
 * Focus intent - describes WHY the focus changed.
 * This allows components to respond appropriately:
 * - 'keyboard': User explicitly navigated via keyboard (Cmd+1/2/3, Tab, Arrow keys)
 * - 'click': User clicked within a zone
 * - 'programmatic': Code triggered the focus change (e.g., search activation)
 */
export type FocusIntent = 'keyboard' | 'click' | 'programmatic';
/**
 * Options for focusZone calls
 */
export interface FocusZoneOptions {
    /** Why the focus is changing - affects default moveFocus behavior */
    intent?: FocusIntent;
    /** Whether to move DOM focus to the zone. Defaults: keyboard=true, click=false, programmatic=true */
    moveFocus?: boolean;
}
interface FocusZone {
    id: FocusZoneId;
    ref: React.RefObject<HTMLElement>;
    focusFirst?: () => void;
}
/**
 * Focus state - tracks both the active zone and the intent behind the change
 */
interface FocusState {
    zone: FocusZoneId | null;
    intent: FocusIntent | null;
    shouldMoveDOMFocus: boolean;
}
interface FocusContextValue {
    /** Currently focused zone */
    currentZone: FocusZoneId | null;
    /** Current focus state with intent information */
    focusState: FocusState;
    /** Register a zone (call on mount) */
    registerZone: (zone: FocusZone) => void;
    /** Unregister a zone (call on unmount) */
    unregisterZone: (id: FocusZoneId) => void;
    /** Focus a specific zone with optional intent/moveFocus control */
    focusZone: (id: FocusZoneId, options?: FocusZoneOptions) => void;
    /** Focus next zone (Tab) */
    focusNextZone: () => void;
    /** Focus previous zone (Shift+Tab) */
    focusPreviousZone: () => void;
    /** Check if a zone is focused */
    isZoneFocused: (id: FocusZoneId) => boolean;
}
export declare function FocusProvider({ children }: {
    children: React.ReactNode;
}): React.JSX.Element;
export declare function useFocusContext(): FocusContextValue;
export {};
