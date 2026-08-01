import { type FocusZoneId, type FocusIntent, type FocusZoneOptions } from "@/context/FocusContext";
interface UseFocusZoneOptions {
    /** Unique zone identifier */
    zoneId: FocusZoneId;
    /** Called when zone gains focus */
    onFocus?: () => void;
    /** Called when zone loses focus */
    onBlur?: () => void;
    /** Custom function to focus first element in zone */
    focusFirst?: () => void;
    /** Whether this zone should be registered. Useful when multiple instances share a logical zone. */
    enabled?: boolean;
}
interface UseFocusZoneReturn {
    /** Ref to attach to zone container */
    zoneRef: React.RefObject<HTMLDivElement>;
    /** Whether this zone currently has focus */
    isFocused: boolean;
    /** Whether DOM focus should move to this zone (true only for explicit keyboard navigation) */
    shouldMoveDOMFocus: boolean;
    /** The intent behind the current focus (keyboard, click, programmatic) - null if not this zone */
    intent: FocusIntent | null;
    /** Programmatically focus this zone */
    focus: (options?: FocusZoneOptions) => void;
}
/**
 * Hook for registering a component as a focus zone.
 * Zones can be navigated between using Tab/Shift+Tab or Cmd+1/2/3.
 */
export declare function useFocusZone({ zoneId, onFocus, onBlur, focusFirst, enabled, }: UseFocusZoneOptions): UseFocusZoneReturn;
export {};
