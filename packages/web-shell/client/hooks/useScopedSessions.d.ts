import type { DaemonSessionArchiveState, DaemonSessionSummary } from '@hoptrendy/sdk/daemon';
import { WEB_SHELL_SESSION_SOURCE_TYPE } from '../constants/sessions';
interface ScopedSessionsOptions {
    autoLoad?: boolean;
    enabled?: boolean;
    pageSize?: number;
    archiveState?: DaemonSessionArchiveState;
    view?: 'organized';
    group?: string;
}
export declare function useScopedSessions(workspaceCwd: string | undefined, options?: ScopedSessionsOptions): {
    data: WEB_SHELL_SESSION_SOURCE_TYPE[] | undefined;
    reload: () => Promise<WEB_SHELL_SESSION_SOURCE_TYPE[] | undefined>;
    sessions: WEB_SHELL_SESSION_SOURCE_TYPE[];
    nextCursor: string | undefined;
    liveMergeFailed: boolean;
    truncated: boolean;
    loadSession: ((sessionId: string, options?: {
        workspaceCwd?: string;
    }) => Promise<void>) | undefined;
    resumeSession: ((sessionId: string, options?: {
        workspaceCwd?: string;
    }) => Promise<void>) | undefined;
    newSession: (() => Promise<void>) | undefined;
    releaseSession: ((sessionId: string) => Promise<void>) | undefined;
    deleteSession: (sessionId: string) => Promise<boolean>;
    deleteSessions: (sessionIds: string[]) => Promise<{
        removed: string[];
        notFound: string[];
        errors: Array<{
            sessionId: string;
            error: string;
        }>;
    }>;
    exportSession: (sessionId: string, format?: WEB_SHELL_SESSION_SOURCE_TYPE) => Promise<WEB_SHELL_SESSION_SOURCE_TYPE>;
    archiveSession: (sessionId: string) => Promise<boolean>;
    unarchiveSession: (sessionId: string) => Promise<boolean>;
    loading: boolean;
    error: Error | undefined;
} | {
    sessions: DaemonSessionSummary[];
    loading: boolean;
    error: Error | undefined;
    reload: () => Promise<any>;
    deleteSession: (sessionId: string) => Promise<boolean>;
    deleteSessions: (sessionIds: string[]) => Promise<any>;
    releaseSession: ((sessionId: string) => Promise<void>) | undefined;
};
export {};
