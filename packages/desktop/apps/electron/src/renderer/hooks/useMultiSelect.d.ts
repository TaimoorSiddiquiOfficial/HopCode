/**
 * Multi-select state management for session list.
 *
 * This module provides pure functions for managing multi-selection state,
 * enabling shift+click range selection, cmd/ctrl+click toggle, and keyboard
 * navigation with selection extension.
 */
export type MultiSelectState = {
    /** Currently active/focused session ID */
    selected: string | null;
    /** Set of all selected session IDs */
    selectedIds: Set<string>;
    /** Anchor ID for shift+click range selection */
    anchorId: string | null;
    /** Anchor index for range selection (index in flat list) */
    anchorIndex: number;
};
/**
 * Create initial empty multi-select state
 */
export declare function createInitialState(): MultiSelectState;
/**
 * Single select - clears all selection and selects only the given item.
 * Sets this item as the anchor for future shift+click operations.
 */
export declare function singleSelect(id: string, index: number): MultiSelectState;
/**
 * Toggle select - adds or removes an item from the selection (cmd/ctrl+click).
 * Updates the anchor to the toggled item.
 * Prevents deselecting the last item (minimum 1 must remain selected).
 */
export declare function toggleSelect(state: MultiSelectState, id: string, index: number): MultiSelectState;
/**
 * Range select - selects all items between the anchor and the target index (shift+click).
 * The anchor remains unchanged, but the active selection moves to the target.
 */
export declare function rangeSelect(state: MultiSelectState, toIndex: number, items: string[]): MultiSelectState;
/**
 * Extend selection - extends the current selection by one item (shift+arrow).
 * Unlike rangeSelect, this preserves existing selections outside the range
 * and just adds/adjusts the contiguous selection from anchor.
 */
export declare function extendSelection(state: MultiSelectState, toIndex: number, items: string[]): MultiSelectState;
/**
 * Select all - selects all provided items.
 * Sets the first item as the anchor.
 */
export declare function selectAll(items: string[]): MultiSelectState;
/**
 * Clear multi-select - reduces selection to only the currently active item.
 * If no active item, clears everything.
 */
export declare function clearMultiSelect(state: MultiSelectState): MultiSelectState;
/**
 * Remove items from selection - removes the given IDs from the selection.
 * Used when items are deleted.
 */
export declare function removeFromSelection(state: MultiSelectState, idsToRemove: string[]): MultiSelectState;
/**
 * Check if multi-select mode is active (more than one item selected)
 */
export declare function isMultiSelectActive(state: MultiSelectState): boolean;
/**
 * Get the count of selected items
 */
export declare function getSelectionCount(state: MultiSelectState): number;
/**
 * Check if a specific item is in the selection
 */
export declare function isItemSelected(state: MultiSelectState, id: string): boolean;
