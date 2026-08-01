import { type DaemonApprovalMode } from '@hoptrendy/webui/daemon-react-sdk';
type PromptSessionActions = {
    createSession: (options?: {
        workspaceCwd?: string;
        approvalMode?: DaemonApprovalMode;
        sourceType?: string;
    }) => Promise<{
        sessionId: string;
    }>;
    attachSession: () => Promise<void>;
    clearSession: () => Promise<void>;
    releaseSession: (sessionId: string) => Promise<void>;
    setModel: (modelId: string) => Promise<unknown>;
};
export declare function isDaemonApprovalMode(mode: string): mode is DaemonApprovalMode;
export declare function createAndAttachSessionForPrompt({ sessionActions, modelId, modeId, workspaceCwd, onSessionCreated, onSessionAllocated, getCurrentSessionId, warn, }: {
    sessionActions: PromptSessionActions;
    modelId?: string;
    modeId?: string;
    workspaceCwd?: string;
    onSessionCreated?: (sessionId: string) => Promise<void> | void;
    onSessionAllocated?: (sessionId: string) => void;
    getCurrentSessionId: () => string | undefined;
    warn?: (message?: unknown, ...optionalParams: unknown[]) => void;
}): Promise<void>;
export {};
