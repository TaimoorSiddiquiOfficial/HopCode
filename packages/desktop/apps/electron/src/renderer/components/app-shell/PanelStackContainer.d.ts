/**
 * PanelStackContainer
 *
 * Horizontal layout container for ALL panels:
 * Sidebar → Navigator → Content Panel(s) with resize sashes.
 *
 * Content panels use CSS flex-grow with their proportions as weights:
 * - Each panel gets `flex: <proportion> 1 0px` with `min-width: PANEL_MIN_WIDTH`
 * - Flex distributes available space proportionally — panels fill the viewport
 * - When panels hit min-width, overflow-x: auto kicks in naturally
 *
 * Sidebar and Navigator are NOT part of the proportional layout —
 * they have their own fixed/user-resizable widths managed by AppShell.
 * They just reduce the available width for content panels and scroll with everything else.
 *
 * The right sidebar stays OUTSIDE this container.
 */
interface PanelStackContainerProps {
    sidebarSlot: React.ReactNode;
    sidebarWidth: number;
    navigatorSlot: React.ReactNode;
    navigatorWidth: number;
    isSidebarAndNavigatorHidden: boolean;
    isRightSidebarVisible?: boolean;
    /** Compact mode: single-panel, list/content toggle (mobile or narrow window) */
    isCompact?: boolean;
    isResizing?: boolean;
}
export declare function PanelStackContainer({ sidebarSlot, sidebarWidth, navigatorSlot, navigatorWidth, isSidebarAndNavigatorHidden, isRightSidebarVisible, isCompact, isResizing, }: PanelStackContainerProps): import("react").JSX.Element;
export {};
