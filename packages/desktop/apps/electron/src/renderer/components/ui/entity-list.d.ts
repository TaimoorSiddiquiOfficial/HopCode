/**
 * EntityList — Reusable container for rendering a scrollable list of EntityRow items.
 *
 * Handles:
 * - ScrollArea wrapping with proper padding
 * - Optional grouped layout with section headers
 * - Collapsible groups with chevron toggle and item count
 * - Empty state rendering (centered, outside ScrollArea)
 * - Header (e.g. search bar) and footer (e.g. infinite scroll sentinel) slots
 *
 * Domain-specific logic (filtering, keyboard nav, multi-select) lives in the consumer.
 */
import * as React from 'react';
export interface EntityListGroup<T> {
    /** Unique key for the group */
    key: string;
    /** Label shown in the section header */
    label: string;
    /** Items in this group (empty array for collapsed groups — items are excluded from the data pipeline) */
    items: T[];
    /** Whether this group supports collapse/expand (default: false) */
    collapsible?: boolean;
    /** Number of hidden items when collapsed. Present on collapsed placeholder groups (items will be []). */
    collapsedCount?: number;
}
export interface EntityListProps<T> {
    /** Flat item list (used when not grouped) */
    items?: T[];
    /** Grouped items with section headers (takes precedence over items) */
    groups?: EntityListGroup<T>[];
    /** Render function for each item */
    renderItem: (item: T, index: number, isFirstInGroup: boolean) => React.ReactNode;
    /** Unique key extractor */
    getKey: (item: T) => string;
    /** Empty state content — rendered centered, outside ScrollArea */
    emptyState?: React.ReactNode;
    /** Header content above the list (e.g. search bar) — rendered outside ScrollArea */
    header?: React.ReactNode;
    /** Footer content after all items (e.g. infinite scroll sentinel) — inside ScrollArea */
    footer?: React.ReactNode;
    /** Ref for the inner list container (for keyboard navigation zones) */
    containerRef?: React.Ref<HTMLDivElement>;
    /** Props spread on the inner list container (role, aria-label, data-focus-zone) */
    containerProps?: Record<string, string>;
    /** Ref to the ScrollArea viewport element (for scroll-based pagination) */
    viewportRef?: React.RefObject<HTMLDivElement>;
    /** Additional ScrollArea class */
    scrollAreaClassName?: string;
    className?: string;
    /** Set of collapsed group keys (for collapsible groups) */
    collapsedGroups?: Set<string>;
    /** Called when a collapsible group header is clicked */
    onToggleCollapse?: (groupKey: string) => void;
    /** Collapse all collapsible groups */
    onCollapseAll?: () => void;
    /** Expand all collapsible groups */
    onExpandAll?: () => void;
}
export declare function EntityList<T>({ items, groups, renderItem, getKey, emptyState, header, footer, containerRef, containerProps, viewportRef, scrollAreaClassName, className, collapsedGroups, onToggleCollapse, onCollapseAll, onExpandAll, }: EntityListProps<T>): React.JSX.Element;
