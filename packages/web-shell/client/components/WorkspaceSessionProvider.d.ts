import { type WebShellProps } from '../App';
interface WorkspaceSessionProviderProps {
    sessionId?: string;
    workspaceId?: string;
    workspaceCwd?: string;
    lockWorkspaceCwd?: string;
    clientId?: string;
    restartSseOnPrompt?: boolean;
    webShellProps: WebShellProps;
}
export declare function WorkspaceSessionProvider({ sessionId, workspaceId, workspaceCwd, lockWorkspaceCwd, clientId, restartSseOnPrompt, webShellProps, }: WorkspaceSessionProviderProps): import("react").JSX.Element;
export {};
