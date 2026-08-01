/**
 * SourceMenu - Shared menu content for source actions
 *
 * Used by:
 * - SourcesListPanel (dropdown via "..." button, context menu via right-click)
 * - SourceInfoPage (title dropdown menu)
 *
 * Uses MenuComponents context to render with either DropdownMenu or ContextMenu
 * primitives, allowing the same component to work in both scenarios.
 *
 * Provides consistent source actions:
 * - Open in New Window
 * - Show in file manager
 * - Delete
 */
import * as React from 'react';
export interface SourceMenuProps {
    /** Source slug */
    sourceSlug: string;
    /** Source name for display */
    sourceName: string;
    /** Callbacks */
    onOpenInNewWindow: () => void;
    onShowInFinder: () => void;
    onDelete: () => void;
    /** Send to another workspace (omit to hide the option) */
    onSendToWorkspace?: () => void;
}
/**
 * SourceMenu - Renders the menu items for source actions
 * This is the content only, not wrapped in a DropdownMenu or ContextMenu
 */
export declare function SourceMenu({ sourceSlug, sourceName, onOpenInNewWindow, onShowInFinder, onDelete, onSendToWorkspace, }: SourceMenuProps): React.JSX.Element;
