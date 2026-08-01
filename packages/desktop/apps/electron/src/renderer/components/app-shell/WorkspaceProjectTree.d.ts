import * as React from "react";
import { type SessionMeta } from "@/atoms/sessions";
import type { Workspace } from "../../../shared/types";
import type { ViewRoute } from "../../../shared/routes";
import type { LabelConfig } from "@craft-agent/shared/labels";
import type { SessionStatus, SessionStatusId } from "@/config/session-status-config";
interface WorkspaceProjectTreeProps {
    workspaces: Workspace[];
    activeWorkspaceId: string | null;
    selectedSessionId?: string | null;
    workspaceSessions: Map<string, SessionMeta[]>;
    loadingWorkspaceSessionIds?: Set<string>;
    workspaceUnreadMap?: Record<string, boolean>;
    revealRequest?: WorkspaceSessionRevealRequest | null;
    onSelectWorkspace: (workspaceId: string, openInNewWindow?: boolean, options?: {
        route?: ViewRoute;
        suppressSessionListLoading?: boolean;
    }) => void | Promise<void>;
    onSelectSession: (workspaceId: string, sessionId: string) => void | Promise<void>;
    onNewSession: (workspaceId: string) => void | Promise<void>;
    onWorkspaceCreated?: (workspace: Workspace) => void;
    onWorkspaceChanged?: () => void;
    sessionStatuses?: SessionStatus[];
    labels?: LabelConfig[];
    onDeleteSession: (sessionId: string, skipConfirmation?: boolean, displayTitle?: string) => Promise<boolean>;
    onFlagSession?: (sessionId: string) => void;
    onUnflagSession?: (sessionId: string) => void;
    onArchiveSession?: (sessionId: string) => void;
    onUnarchiveSession?: (sessionId: string) => void;
    onMarkSessionUnread: (sessionId: string) => void;
    onSessionStatusChange: (sessionId: string, state: SessionStatusId) => void;
    onRenameSession: (sessionId: string, name: string) => void;
    onSessionLabelsChange?: (sessionId: string, labels: string[]) => void;
}
interface WorkspaceSessionRevealRequest {
    workspaceId: string;
    sessionId: string;
    nonce: number;
}
export declare function WorkspaceProjectTree({ workspaces, activeWorkspaceId, selectedSessionId, workspaceSessions, loadingWorkspaceSessionIds, revealRequest, onSelectWorkspace, onSelectSession, onNewSession, onWorkspaceCreated, onWorkspaceChanged, sessionStatuses, labels, onDeleteSession, onFlagSession, onUnflagSession, onArchiveSession, onUnarchiveSession, onMarkSessionUnread, onSessionStatusChange, onRenameSession, onSessionLabelsChange, }: WorkspaceProjectTreeProps): React.JSX.Element;
export {};
