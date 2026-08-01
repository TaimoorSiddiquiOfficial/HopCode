import type { Workspace } from '../../../shared/types';
interface WorkspaceCreationScreenProps {
    /** Callback when a workspace is created successfully */
    onWorkspaceCreated: (workspace: Workspace) => void;
    /** Callback when the screen is dismissed */
    onClose: () => void;
    className?: string;
    /** When set, skip choice step and open ConnectRemote in reconnect mode */
    reconnectWorkspace?: Workspace;
    /** Reconnect an existing remote workspace and resolve only on real success. */
    onReconnectWorkspace?: (workspaceId: string, remoteServer: {
        url: string;
        token: string;
        remoteWorkspaceId: string;
    }) => Promise<void>;
}
/**
 * WorkspaceCreationScreen - Full-screen overlay for creating workspaces
 *
 * Obsidian-style flow:
 * 1. Choice: Create new workspace OR Open existing folder
 * 2a. Create: Enter name + choose location (default or custom)
 * 2b. Open: Browse folder OR create new folder at location
 */
export declare function WorkspaceCreationScreen({ onWorkspaceCreated, onClose, className, reconnectWorkspace, onReconnectWorkspace, }: WorkspaceCreationScreenProps): import("react").JSX.Element;
export {};
