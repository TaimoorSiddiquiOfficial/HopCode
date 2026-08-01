interface AddWorkspaceStep_ConnectRemoteProps {
    onBack: () => void;
    onCreate: (folderPath: string, name: string, remoteServer: {
        url: string;
        token: string;
        remoteWorkspaceId: string;
    }) => Promise<void>;
    isCreating: boolean;
    /** Pre-fill the server URL (for reconnect flow) */
    initialUrl?: string;
    /** Pre-fill the token (for reconnect flow) */
    initialToken?: string;
    /** When set, updating an existing workspace's remote config instead of creating */
    reconnectWorkspace?: {
        id: string;
        name: string;
        remoteWorkspaceId: string;
    };
    /** Called when reconnect updates the remote server config */
    onUpdate?: (workspaceId: string, remoteServer: {
        url: string;
        token: string;
        remoteWorkspaceId: string;
    }) => Promise<void>;
}
/**
 * AddWorkspaceStep_ConnectRemote - Connect to a remote HopCode Server
 *
 * Two paths:
 * 1. Connect to existing workspace — select from dropdown, no name needed, auto-resolve local slug
 * 2. Create new workspace — type a name, creates on server, then connects
 */
export declare function AddWorkspaceStep_ConnectRemote({ onBack, onCreate, isCreating, initialUrl, initialToken, reconnectWorkspace, onUpdate, }: AddWorkspaceStep_ConnectRemoteProps): import("react").JSX.Element;
export {};
