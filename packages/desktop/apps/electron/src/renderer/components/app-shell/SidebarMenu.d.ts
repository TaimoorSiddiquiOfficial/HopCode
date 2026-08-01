/**
 * SidebarMenu - Shared menu content for sidebar navigation items
 *
 * Used by:
 * - LeftSidebar (context menu via right-click on nav items)
 * - AppShell (context menu for New Chat button)
 *
 * Uses MenuComponents context to render with either DropdownMenu or ContextMenu
 * primitives, allowing the same component to work in both scenarios.
 *
 * Provides actions based on the sidebar item type:
 * - "Configure Statuses" (for allSessions/status/flagged items) - triggers EditPopover callback
 * - "Add Source" (for sources) - triggers EditPopover callback
 * - "Add Skill" (for skills) - triggers EditPopover callback
 * - "Open in New Window" (for newSession only) - uses deep link
 */
import * as React from 'react';
export type SidebarMenuType = 'allSessions' | 'flagged' | 'status' | 'sources' | 'skills' | 'automations' | 'labels' | 'views' | 'newSession';
export interface SidebarMenuProps {
    /** Type of sidebar item (determines available menu items) */
    type: SidebarMenuType;
    /** Status ID for status items (e.g., 'todo', 'done') - not currently used but kept for future */
    statusId?: string;
    /** Label ID — when set, this is an individual label item (enables Delete Label) */
    labelId?: string;
    /** Handler for "Configure Statuses" action - only for allSessions/status/flagged types */
    onConfigureStatuses?: () => void;
    /** Handler for "Mark All Read" action - only for allSessions type */
    onMarkAllRead?: () => void;
    /** Handler for "Configure Labels" action - receives labelId when triggered from a specific label */
    onConfigureLabels?: (labelId?: string) => void;
    /** Handler for "Add New Label" action - creates a label (parentId = labelId if set) */
    onAddLabel?: (parentId?: string) => void;
    /** Handler for "Delete Label" action - deletes the label identified by labelId */
    onDeleteLabel?: (labelId: string) => void;
    /** Handler for "Add Source" action - only for sources type */
    onAddSource?: () => void;
    /** Handler for "Add Skill" action - only for skills type */
    onAddSkill?: () => void;
    /** Handler for "Add Automation" action - only for automations type */
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
 * SidebarMenu - Renders the menu items for sidebar navigation actions
 * This is the content only, not wrapped in a DropdownMenu or ContextMenu
 */
export declare function SidebarMenu({ type, statusId, labelId, onConfigureStatuses, onMarkAllRead, onConfigureLabels, onAddLabel, onDeleteLabel, onAddSource, onAddSkill, onAddAutomation, sourceType, onConfigureViews, viewId, onDeleteView, }: SidebarMenuProps): React.JSX.Element | null;
