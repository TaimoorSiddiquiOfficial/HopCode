interface UseRovingTabIndexOptions<T> {
    /** List of items to navigate */
    items: T[];
    /** Get unique ID for each item (item, index) => id */
    getId: (item: T, index: number) => string;
    /** Navigation direction (affects arrow key behavior) */
    orientation?: 'vertical' | 'horizontal' | 'both';
    /** Wrap around at ends */
    wrap?: boolean;
    /** Called when user navigates with arrow keys - use for scrolling into view */
    onNavigate?: (item: T, index: number) => void;
    /** Called when Enter/Space is pressed on focused item - use for selection */
    onActivate?: (item: T, index: number) => void;
    /** Called when Delete/Backspace is pressed */
    onDelete?: (item: T, index: number) => void;
    /** Initial active index */
    initialIndex?: number;
    /** Whether navigation is enabled (typically when zone is focused) */
    enabled?: boolean;
    /** Called to open context menu on focused item */
    onContextMenu?: (item: T, index: number, element: HTMLElement) => void;
    /** Whether to move focus to items on navigation (default: true). Set false to keep focus elsewhere (e.g., search input) */
    moveFocus?: boolean;
    /** Called when Shift+Arrow extends selection (for multi-select support) */
    onExtendSelection?: (toIndex: number) => void;
}
interface UseRovingTabIndexReturn<T> {
    /** Currently active index */
    activeIndex: number;
    /** Set active index programmatically */
    setActiveIndex: (index: number) => void;
    /** Get props to spread on each item */
    getItemProps: (item: T, index: number) => {
        id: string;
        tabIndex: number;
        ref: (el: HTMLElement | null) => void;
        onKeyDown: (e: React.KeyboardEvent) => void;
        onFocus: () => void;
        'aria-selected': boolean;
        role: string;
    };
    /** Get props for the container */
    getContainerProps: () => {
        role: string;
        'aria-activedescendant': string | undefined;
        onKeyDown: (e: React.KeyboardEvent) => void;
    };
    /** Focus the currently active item */
    focusActiveItem: () => void;
}
/**
 * Implements roving tabindex pattern for list navigation.
 *
 * Key design: Navigation (focus) is separate from Selection
 * - Arrow keys move focus via onNavigate (use for scrolling into view)
 * - Enter/Space triggers onActivate (use for selection)
 * - Clicks are handled externally by the component
 *
 * Features:
 * - Only active item has tabIndex=0, others have tabIndex=-1
 * - Arrow keys navigate and call onNavigate
 * - Enter/Space triggers onActivate callback
 * - Tab exits the list to next zone
 * - Home/End jump to first/last item
 * - Shift+Arrow calls onExtendSelection for multi-select
 * - Context menu key (or Shift+F10) opens context menu
 */
export declare function useRovingTabIndex<T>({ items, getId, orientation, wrap, onNavigate, onActivate, onDelete, initialIndex, enabled, onContextMenu, moveFocus, onExtendSelection, }: UseRovingTabIndexOptions<T>): UseRovingTabIndexReturn<T>;
export {};
