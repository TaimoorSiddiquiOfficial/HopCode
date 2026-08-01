/**
 * BatchSessionMenu - Context menu content for batch operations on multi-selected sessions.
 *
 * Self-contained component that uses hooks to access selection state, session metadata,
 * and mutation callbacks. Renders polymorphic menu items via useMenuComponents() so it
 * works in both DropdownMenu and ContextMenu scenarios.
 *
 * Mirrors the actions from MultiSelectPanel (Status, Labels, Archive) with additions
 * for Flag and Delete that make sense in a context menu.
 */
import * as React from 'react';
export interface BatchSessionMenuProps {
    /** Callback to open Send to Workspace dialog for the selected sessions */
    onSendToWorkspace?: () => void;
    /** Hide status, labels, and flag actions for session context menus. */
    hideMetadataActions?: boolean;
}
export declare function BatchSessionMenu({ onSendToWorkspace, hideMetadataActions, }?: BatchSessionMenuProps): React.JSX.Element;
