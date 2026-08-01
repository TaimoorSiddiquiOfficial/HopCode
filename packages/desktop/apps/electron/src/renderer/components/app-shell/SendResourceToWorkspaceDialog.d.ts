/**
 * SendResourceToWorkspaceDialog — Copy a source, skill, or automation to another workspace.
 *
 * Uses the resources:export → resources:import RPC pipeline.
 * Supports both local and remote target workspaces:
 * - Local: both RPC calls go to the same server
 * - Remote: export runs locally, import runs via invokeOnServer on the target
 *
 * Adapted from SendToWorkspaceDialog (session transfer).
 */
import type { Workspace } from '../../../shared/types';
export type SendResourceType = 'source' | 'skill' | 'automation';
export interface SendResourceToWorkspaceDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    /** What kind of resource to send */
    resourceType: SendResourceType;
    /** Slug(s) or ID(s) of resources to send */
    resourceIds: string[];
    /** Display label for the dialog description (e.g., "Slack source") */
    resourceLabel: string;
    /** All workspaces */
    workspaces: Workspace[];
    /** Current workspace ID (excluded from picker) */
    activeWorkspaceId: string | null;
    /** Called after successful transfer */
    onTransferComplete?: () => void;
}
export declare function SendResourceToWorkspaceDialog({ open, onOpenChange, resourceType, resourceIds, resourceLabel, workspaces, activeWorkspaceId, onTransferComplete, }: SendResourceToWorkspaceDialogProps): import("react").JSX.Element;
