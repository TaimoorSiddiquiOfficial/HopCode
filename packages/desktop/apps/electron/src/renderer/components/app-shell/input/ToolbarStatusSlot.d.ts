/**
 * ToolbarStatusSlot
 *
 * Priority-based overlay slot for the input toolbar bottom row.
 * Shows contextual status indicators — escape-to-interrupt hint (highest priority),
 * browser session state, or future status types.
 *
 * Positioned absolute inset-0 over the toolbar's relative container.
 * Uses AnimatePresence for smooth fade transitions between states.
 *
 * Browser state is consumed directly from Jotai atoms (same pattern as BrowserTabStrip)
 * to avoid threading props through 4 component levels.
 */
import * as React from 'react';
interface ToolbarStatusSlotProps {
    /** Whether the escape interrupt overlay should be visible (highest priority) */
    showEscapeOverlay: boolean;
    /** Session ID to find the bound browser instance */
    sessionId?: string;
}
export declare function ToolbarStatusSlot({ showEscapeOverlay, sessionId, }: ToolbarStatusSlotProps): React.JSX.Element;
export {};
