/**
 * PanelHeader - Standardized header component for panels
 *
 * Provides consistent header styling with:
 * - Fixed 50px height
 * - Title with optional badge
 * - Optional action buttons
 * - Optional title dropdown menu (renders chevron and makes title interactive)
 * - Automatic padding compensation for macOS traffic lights (via StoplightContext)
 *
 * Usage:
 * ```tsx
 * <PanelHeader
 *   title="Conversations"
 *   actions={<Button>Add</Button>}
 * />
 *
 * // With interactive title menu:
 * <PanelHeader
 *   title="Chat Name"
 *   titleMenu={<><MenuItem>Rename</MenuItem><MenuItem>Delete</MenuItem></>}
 * />
 * ```
 *
 * The header automatically compensates for macOS traffic lights when rendered
 * inside a StoplightProvider (e.g., in MainContentPanel during focused mode).
 * You can also explicitly control this with the `compensateForStoplight` prop.
 */
import type * as React from 'react';
export interface PanelHeaderProps {
    /** Header title (undefined hides with animation) */
    title?: string;
    /** Optional badge element (e.g., agent badge) */
    badge?: React.ReactNode;
    /** Optional dropdown menu content for interactive title (renders chevron when provided) */
    titleMenu?: React.ReactNode;
    /** Optional leading action rendered before the title (e.g., back button in compact mode) */
    leadingAction?: React.ReactNode;
    /** Optional center button rendered between title and right actions */
    centerButton?: React.ReactNode;
    /** Optional action buttons rendered on the right */
    actions?: React.ReactNode;
    /** Optional right sidebar button (rendered after actions) */
    rightSidebarButton?: React.ReactNode;
    /** When true, animates left margin to avoid macOS traffic lights (use when this is the first panel on screen) */
    compensateForStoplight?: boolean;
    /** Left padding override (e.g., for focused mode with traffic lights) */
    paddingLeft?: string;
    /** Optional className for additional styling */
    className?: string;
    /** Whether title is being regenerated (shows shimmer effect) */
    isRegeneratingTitle?: boolean;
}
/**
 * Standardized panel header with title and actions
 */
export declare function PanelHeader({ title, badge, titleMenu, leadingAction, centerButton, actions, rightSidebarButton, compensateForStoplight, paddingLeft, className, isRegeneratingTitle, }: PanelHeaderProps): React.JSX.Element;
