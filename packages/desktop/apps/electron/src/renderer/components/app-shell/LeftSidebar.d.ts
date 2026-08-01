import type { LucideIcon } from "lucide-react";
import * as React from "react";
import { type SidebarMenuType } from './SidebarMenu';
/** Context menu configuration for sidebar items */
export interface SidebarContextMenuConfig {
    /** Type of sidebar item (determines available menu items) */
    type: SidebarMenuType;
    /** Status ID for status items (e.g., 'todo', 'done') - not currently used but kept for future */
    statusId?: string;
    /** Label ID — when set, this is an individual label (enables Delete Label) */
    labelId?: string;
    /** Handler for "Configure Statuses" action - for allSessions/status/flagged types */
    onConfigureStatuses?: () => void;
    /** Handler for "Mark All Read" action - for allSessions type */
    onMarkAllRead?: () => void;
    /** Handler for "Configure Labels" action - receives labelId when triggered from a specific label */
    onConfigureLabels?: (labelId?: string) => void;
    /** Handler for "Add New Label" action - creates a label (parentId passed from labelId) */
    onAddLabel?: (parentId?: string) => void;
    /** Handler for "Delete Label" action - deletes the label by labelId */
    onDeleteLabel?: (labelId: string) => void;
    /** Handler for "Add Source" action - for sources type */
    onAddSource?: () => void;
    /** Handler for "Add Skill" action - for skills type */
    onAddSkill?: () => void;
    /** Handler for "Add Automation" action - for automations type */
    onAddAutomation?: () => void;
    /** Source type filter for "Learn More" link - determines which docs page to open */
    sourceType?: 'api' | 'mcp' | 'local';
    /** Handler for "Edit Views" action - for views type */
    onConfigureViews?: () => void;
    /** View ID — when set, this is an individual view (enables Delete) */
    viewId?: string;
    /** Handler for "Delete View" action */
    onDeleteView?: (id: string) => void;
}
/**
 * Sortable configuration for expandable sidebar items.
 * When present on an expandable LinkItem, its children become drag-sortable.
 */
export interface SortableConfig {
    /** Flat list reorder: called with new ordered array of item IDs after a drag-drop */
    onReorder: (orderedIds: string[]) => void;
}
export interface LinkItem {
    id: string;
    title: string;
    label?: string;
    icon: LucideIcon | React.ReactNode;
    iconColor?: string;
    /** Whether the icon responds to color (uses currentColor). Default true for Lucide icons. */
    iconColorable?: boolean;
    variant: "default" | "ghost";
    onClick?: () => void;
    expandable?: boolean;
    expanded?: boolean;
    onToggle?: () => void;
    items?: SidebarItem[];
    compact?: boolean;
    dataTutorial?: string;
    contextMenu?: SidebarContextMenuConfig;
    sortable?: SortableConfig;
    afterTitle?: React.ReactNode;
}
export interface SeparatorItem {
    id: string;
    type: 'separator';
}
export type SidebarItem = LinkItem | SeparatorItem;
export declare const isSeparatorItem: (item: SidebarItem) => item is SeparatorItem;
interface LeftSidebarProps {
    isCollapsed: boolean;
    links: SidebarItem[];
    className?: string;
    /** Get props for each item (from unified sidebar navigation) */
    getItemProps?: (id: string) => {
        tabIndex: number;
        'data-focused': boolean;
        ref: (el: HTMLElement | null) => void;
    };
    /** Currently focused item ID */
    focusedItemId?: string | null;
    /** Whether this is a nested sidebar (child of expandable item) */
    isNested?: boolean;
}
/**
 * LeftSidebar - Vertical list of navigation buttons with icons
 *
 * Navigation is managed by the parent component (Chat.tsx) for unified
 * sidebar keyboard navigation. This component just renders the items.
 *
 * Styling matches agent items in the sidebar for consistency:
 * - py-[7px] px-2 text-[13px] rounded-md
 * - Icon: h-3.5 w-3.5
 *
 * Link variants:
 * - "default": Highlighted style (used for active/selected items)
 * - "ghost": Subtle style (used for inactive items)
 *
 * Expandable items:
 * - Show a chevron toggle on hover (replaces icon position)
 * - Children are rendered with animated expand/collapse
 * - Nested items have left indentation with vertical line
 *
 * Drag-and-drop:
 * - Expandable items can opt-in to sortable (flat) or sortableTree (hierarchical) DnD
 * - Uses @dnd-kit with DragOverlay portaled to document.body (no clipping)
 * - Two-phase drop animation: overlay fades out, ghost fades in
 */
export declare function LeftSidebar({ links, isCollapsed, className, getItemProps, focusedItemId, isNested }: LeftSidebarProps): React.JSX.Element;
export {};
