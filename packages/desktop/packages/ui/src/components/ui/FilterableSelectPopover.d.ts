import * as React from 'react';
export interface FilterableSelectRenderState {
    selected: boolean;
    highlighted: boolean;
}
export interface FilterableSelectPopoverProps<T> {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    anchorRef: React.RefObject<HTMLElement | null>;
    items: T[];
    getKey: (item: T) => string;
    getLabel: (item: T) => string;
    isSelected: (item: T) => boolean;
    onToggle: (item: T) => void;
    renderItem?: (item: T, state: FilterableSelectRenderState, index: number) => React.ReactNode;
    filterPlaceholder?: string;
    emptyState?: React.ReactNode;
    noResultsState?: React.ReactNode;
    closeOnSelect?: boolean;
    minWidth?: number;
    maxWidth?: number;
}
/**
 * Reusable flat list selector with:
 * - text filtering
 * - keyboard navigation (↑/↓, Enter, Esc)
 * - click-outside dismissal
 * - anchor-based portal positioning
 */
export declare function FilterableSelectPopover<T>({ open, onOpenChange, anchorRef, items, getKey, getLabel, isSelected, onToggle, renderItem, filterPlaceholder, emptyState, noResultsState, closeOnSelect, minWidth, maxWidth, }: FilterableSelectPopoverProps<T>): React.ReactPortal | null;
