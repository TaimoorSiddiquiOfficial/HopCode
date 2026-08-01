/**
 * useStatuses Hook
 *
 * React hook to load and manage workspace statuses.
 * Auto-refreshes when workspace changes.
 */
import type { StatusConfig } from '@craft-agent/shared/statuses';
export interface UseStatusesResult {
    statuses: StatusConfig[];
    isLoading: boolean;
    error: string | null;
    refresh: () => Promise<void>;
}
/**
 * Load statuses for a workspace via IPC
 * Auto-refreshes when workspaceId changes
 *
 * To detect agent edits to status config files, you could:
 * - Poll periodically (simple)
 * - Use file watcher in main process (more complex but real-time)
 */
export declare function useStatuses(workspaceId: string | null): UseStatusesResult;
