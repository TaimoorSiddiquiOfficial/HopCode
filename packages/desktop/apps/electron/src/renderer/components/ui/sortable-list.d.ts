/**
 * Sortable List - Flat list drag-and-drop reordering
 *
 * Uses @dnd-kit for polished DnD with:
 * - SmartPointerSensor (5px activation distance, skips data-no-dnd elements)
 * - KeyboardSensor for accessibility
 * - DragOverlay (position:fixed) for proper z-index layering above all panels
 * - Crossfade drop animation: overlay fades out while ghost fades in
 * - Smooth sibling reflow via CSS transforms
 *
 * Usage:
 *   <SortableList items={items} onReorder={handleReorder} renderItem={renderItem} />
 */
import * as React from 'react';
import { PointerSensor } from '@dnd-kit/core';
export declare class SmartPointerSensor extends PointerSensor {
    static activators: {
        eventName: "onPointerDown";
        handler: ({ nativeEvent }: {
            nativeEvent: PointerEvent;
        }) => boolean;
    }[];
}
export interface SortableItemData {
    /** Unique ID for this item (used as sortable key) */
    id: string;
}
interface SortableListProps<T extends SortableItemData> {
    /** Array of items to render (must have unique `id` fields) */
    items: T[];
    /** Called with the new ordered array after a drop */
    onReorder: (items: T[]) => void;
    /** Render function for each item. `isDragging` is true for the active ghost, `isSorting` while any drag is active. */
    renderItem: (item: T, isDragging: boolean, isSorting: boolean) => React.ReactNode;
    /** Render the drag overlay content (floating clone). Falls back to renderItem. */
    renderOverlay?: (item: T) => React.ReactNode;
    /** Show DragOverlay clone while dragging (default: true) */
    showOverlay?: boolean;
    /** Additional className for the list container */
    className?: string;
}
export declare function SortableList<T extends SortableItemData>({ items, onReorder, renderItem, renderOverlay, showOverlay, className, }: SortableListProps<T>): React.JSX.Element;
export { arrayMove } from '@dnd-kit/sortable';
