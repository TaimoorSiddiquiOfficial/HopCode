/**
 * Unified Auth State Management
 *
 * HopCode is the only built-in backend and does not require app-managed LLM
 * credentials. Source and workspace OAuth still use their dedicated auth flows.
 */
import type { AuthType, Workspace } from '../config/types.ts';
export interface MigrationInfo {
    reason: 'legacy_token';
    message: string;
}
export interface AuthState {
    billing: {
        type: AuthType | null;
        hasCredentials: boolean;
        apiKey: string | null;
        migrationRequired?: MigrationInfo;
    };
    workspace: {
        hasWorkspace: boolean;
        active: Workspace | null;
    };
}
export interface SetupNeeds {
    needsBillingConfig: boolean;
    needsCredentials: boolean;
    isFullyConfigured: boolean;
    needsMigration?: MigrationInfo;
}
export declare function getAuthState(): Promise<AuthState>;
export declare function getSetupNeeds(_state: AuthState, _setupDeferred?: boolean): SetupNeeds;
export declare function _resetRefreshMutex(): void;
