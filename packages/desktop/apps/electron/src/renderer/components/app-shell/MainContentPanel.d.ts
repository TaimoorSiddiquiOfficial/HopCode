/**
 * MainContentPanel - Right panel component for displaying content
 *
 * Renders content based on the unified NavigationState:
 * - Chats navigator: ChatPage for selected session, or empty state
 * - Sources navigator: SourceInfoPage for selected source, or empty state
 * - Settings navigator: Settings, Preferences, or Shortcuts page
 *
 * The NavigationState is the single source of truth for what to display.
 *
 * In focused mode (single window), wraps content with StoplightProvider
 * so PanelHeader components automatically compensate for macOS traffic lights.
 *
 * When multiple sessions are selected (multi-select mode), shows the
 * MultiSelectPanel with batch action buttons instead of a single chat.
 */
import * as React from 'react';
export interface MainContentPanelProps {
    /** Whether both sidebar and navigator are hidden (focus mode / CMD+.) */
    isSidebarAndNavigatorHidden?: boolean;
    /** Optional className for the container */
    className?: string;
    /**
     * Override the navigation state for this panel.
     * When provided, this panel renders based on the override instead of the global NavigationState.
     * Used by PanelSlot to render panels in the panel stack.
     */
    navStateOverride?: import('../../../shared/types').NavigationState | null;
}
export declare function MainContentPanel({ isSidebarAndNavigatorHidden, className, navStateOverride, }: MainContentPanelProps): React.JSX.Element;
