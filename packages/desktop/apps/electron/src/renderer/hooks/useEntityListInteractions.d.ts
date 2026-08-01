/**
 * useEntityListInteractions — Convenience hook that wires together:
 * - useRovingTabIndex (keyboard navigation)
 * - useMultiSelect (pure selection state)
 * - Optional search filtering
 *
 * Returns props to spread onto EntityList and EntityRow.
 *
 * NOTE: Does NOT include useFocusZone — that requires app-level FocusContext.
 * Consumers who need zone integration compose it externally (see SessionList).
 */
import * as MultiSelect from '@/hooks/useMultiSelect';
export interface UseEntityListInteractionsOptions<T> {
    /** List of items (pre-filtering) */
    items: T[];
    /** Unique ID extractor */
    getId: (item: T) => string;
    /** Keyboard navigation (opt-in) */
    keyboard?: {
        /** Called when Enter/Space is pressed on the active item */
        onActivate?: (item: T, index: number) => void;
        /** Called when arrow keys move to a new item */
        onNavigate?: (item: T, index: number) => void;
        /** Whether keyboard navigation is enabled (default: true) */
        enabled?: boolean;
        /** Keep DOM focus elsewhere (e.g. search input) while navigating (default: false) */
        virtualFocus?: boolean;
    };
    /** Multi-select (opt-in — set to true to enable) */
    multiSelect?: boolean;
    /** Search filtering (opt-in) */
    search?: {
        /** Current search query */
        query: string;
        /** Filter function — return true to include the item */
        fn: (item: T, query: string) => boolean;
    };
    /**
     * External selection store (opt-in).
     * When provided, the hook uses this instead of its own internal useState.
     * This enables atom-backed selection shared with other components (e.g. Jotai).
     *
     * @example
     * const [state, setState] = useAtom(sessionSelectionAtom)
     * const interactions = useEntityListInteractions({ ..., selectionStore: { state, setState } })
     */
    selectionStore?: {
        state: MultiSelect.MultiSelectState;
        setState: (fn: MultiSelect.MultiSelectState | ((prev: MultiSelect.MultiSelectState) => MultiSelect.MultiSelectState)) => void;
    };
    /**
     * Override which item ID is considered "selected" for highlighting.
     * When provided, `getRowProps` uses this instead of `selectionState.selected`.
     * Used by multi-panel focus tracking where the focused panel determines selection.
     */
    selectedIdOverride?: string | null;
}
export interface EntityListInteractions<T> {
    /** Filtered items (after search). Use this as EntityList's items prop. */
    items: T[];
    /** Props to spread on EntityList */
    listProps: {
        containerRef?: React.Ref<HTMLDivElement>;
        containerProps: Record<string, string>;
    };
    /** Get props to spread on each EntityRow */
    getRowProps: (item: T, index: number) => {
        buttonProps: Record<string, unknown>;
        isSelected: boolean;
        isInMultiSelect: boolean;
        onMouseDown: (e: React.MouseEvent) => void;
    };
    /** Keyboard state */
    keyboard: {
        activeIndex: number;
        setActiveIndex: (index: number) => void;
        focusActiveItem: () => void;
    };
    /** Props to spread on a search <input> — forwards ArrowDown/Up to the list */
    searchInputProps: {
        onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    };
    /** Selection state (only meaningful when multiSelect is enabled) */
    selection: {
        state: MultiSelect.MultiSelectState;
        isMultiSelectActive: boolean;
        selectedIds: Set<string>;
        toggle: (id: string, index: number) => void;
        range: (toIndex: number) => void;
        selectAll: () => void;
        clear: () => void;
    };
}
export declare function useEntityListInteractions<T>({ items: rawItems, getId, keyboard: keyboardOpts, multiSelect: multiSelectEnabled, search, selectionStore, selectedIdOverride, }: UseEntityListInteractionsOptions<T>): EntityListInteractions<T>;
