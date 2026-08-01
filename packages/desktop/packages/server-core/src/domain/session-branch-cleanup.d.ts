export interface BranchRollbackManagedSession {
    agent?: {
        destroy?: () => void;
    } | null;
    poolServer?: {
        stop?: () => void;
    };
}
interface RollbackParams {
    managed: BranchRollbackManagedSession;
    workspaceRootPath: string;
    sessionId: string;
    deleteFromRuntimeSessions: (sessionId: string) => void;
    deleteStoredSession: (workspaceRootPath: string, sessionId: string) => void | boolean | Promise<void | boolean>;
}
/**
 * Best-effort rollback when branch creation fails during backend preflight.
 * Ensures no orphan child session remains in memory or persistent storage.
 */
export declare function rollbackFailedBranchCreation(params: RollbackParams): Promise<void>;
export {};
