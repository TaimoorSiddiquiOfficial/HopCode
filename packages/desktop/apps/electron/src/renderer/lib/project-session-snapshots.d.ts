import type { Session, Workspace } from '../../shared/types';
import { type SessionMeta } from '@/atoms/sessions';
interface ProjectSessionSnapshotApi {
    getSessionsForWorkspace(workspaceId: string, options?: {
        refreshExternal?: boolean;
    }): Promise<Session[]>;
    invokeOnServer(url: string, token: string, channel: string, ...args: unknown[]): Promise<unknown>;
}
export declare function loadProjectWorkspaceSessionSnapshot(workspace: Workspace, api?: ProjectSessionSnapshotApi): Promise<SessionMeta[]>;
export {};
