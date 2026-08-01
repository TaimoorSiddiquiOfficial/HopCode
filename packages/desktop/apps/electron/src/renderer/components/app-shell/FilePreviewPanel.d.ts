/**
 * FilePreviewPanel - Resizable, docked side panel that hosts the in-app file preview.
 *
 * Replaces the previous fullscreen file overlay: instead of taking over the whole window,
 * a clicked file opens in this panel on the right while the conversation / file tree stays
 * visible and interactive next to it (VS Code / Cursor style split layout).
 *
 * The panel width is user-adjustable via a drag handle on its left edge and is persisted
 * to localStorage so it survives reloads. The preview content itself (rendered as children)
 * uses each overlay's `embedded` mode to fill this panel.
 */
import * as React from 'react';
export declare function FilePreviewPanel({ children }: {
    children: React.ReactNode;
}): React.JSX.Element;
