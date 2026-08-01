/**
 * SendToWorkspaceDialog — Transfer sessions to remote workspaces.
 *
 * Shows a workspace picker filtered to remote workspaces only (sending
 * between local workspaces on the same machine is pointless).
 * Disconnected remote workspaces are shown as disabled with a CloudOff icon.
 *
 * Uses invokeOnServer for cross-server transfer:
 * 1. Generate a mini-summary handoff payload from the current server
 * 2. Import that summarized payload on the target server via temporary connection
 */
import * as React from 'react';
import type { Workspace } from '../../../shared/types';
export interface SendToWorkspaceDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    /** Session IDs to transfer */
    sessionIds: string[];
    /** All workspaces */
    workspaces: Workspace[];
    /** Current workspace ID (excluded from picker) */
    activeWorkspaceId: string | null;
    /** Called after successful transfer with target workspace ID and new session IDs */
    onTransferComplete?: (targetWorkspaceId: string, newSessionIds: string[]) => void;
}
export declare function SendToWorkspaceDialog({ open, onOpenChange, sessionIds, workspaces, activeWorkspaceId, onTransferComplete, }: SendToWorkspaceDialogProps): React.JSX.Element;
