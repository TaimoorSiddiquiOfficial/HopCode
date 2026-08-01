/**
 * PanelSlot
 *
 * Renders a single content panel within the PanelStackContainer.
 *
 * When a panel is the only one (isOnly), it flex-grows to fill available space.
 * When multiple panels exist, each uses flex-grow with its proportion as the weight,
 * combined with min-width to prevent shrinking below PANEL_MIN_WIDTH.
 *
 * Each PanelSlot overrides AppShellContext to inject a per-panel close button
 * into PanelHeader's rightSidebarButton slot. All panels are equal — closing
 * any panel removes it from the stack. A reactive effect handles window close
 * when the stack becomes empty.
 */
import { type PanelStackEntry } from '@/atoms/panel-stack';
interface PanelSlotProps {
    entry: PanelStackEntry;
    isOnly: boolean;
    /** Whether this panel is the focused panel in a multi-panel layout */
    isFocusedPanel: boolean;
    isSidebarAndNavigatorHidden: boolean;
    /** Whether this panel's left corners touch the window edge (no sidebar/navigator before it) */
    isAtLeftEdge: boolean;
    /** Whether this panel's right corners touch the window edge (no right sidebar after it) */
    isAtRightEdge: boolean;
    /** Flex-grow weight for proportional sizing */
    proportion: number;
    /** Optional sash element rendered before this panel */
    sash?: React.ReactNode;
    /** Compact (mobile) mode — shows back button in panel header */
    isCompact?: boolean;
}
export declare function PanelSlot({ entry, isOnly, isFocusedPanel, isSidebarAndNavigatorHidden, isAtLeftEdge, isAtRightEdge, proportion, sash, isCompact, }: PanelSlotProps): import("react").JSX.Element;
export {};
