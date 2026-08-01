/**
 * SessionFilesSection - Displays files in the session directory as a tree view
 *
 * Features:
 * - Recursive tree view with expandable folders (matches sidebar styling)
 * - File watcher for auto-refresh when files change
 * - Click to preview in-app, double-click to open
 * - Right-click context menu with "Open" / "Show in {file manager}" actions
 * - Persisted expanded folder state per session
 *
 * Styling matches LeftSidebar patterns:
 * - Chevron hidden by default, shown on hover
 * - Vertical connector lines for nested items
 * - 14x14px icons, 8px gaps, 6px radius
 */
import * as React from 'react';
export interface SessionFilesSectionProps {
    sessionId?: string;
    className?: string;
    /** Absolute session folder path for header actions (e.g. View in Finder) */
    sessionFolderPath?: string;
    /** Hide section header when embedded inside compact containers (e.g. popovers) */
    hideHeader?: boolean;
}
/**
 * Section displaying session files as a tree
 */
export declare function SessionFilesSection({ sessionId, className, sessionFolderPath, hideHeader }: SessionFilesSectionProps): React.JSX.Element | null;
