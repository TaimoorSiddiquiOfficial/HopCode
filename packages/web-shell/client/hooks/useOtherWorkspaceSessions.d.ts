/**
 * @license
 * Copyright 2025 Qwen Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type { DaemonSessionSummary } from '@hoptrendy/sdk/daemon';
export interface OtherWorkspaceSessionsResult {
    /**
     * Active sessions from every non-primary, trusted registered workspace,
     * merged into one flat list. Each summary carries its own `workspaceCwd`.
     */
    sessions: DaemonSessionSummary[];
    /** Re-fetch every target workspace. Stable identity (safe in effect deps). */
    reload: () => Promise<void>;
}
/**
 * Collect the active sessions of the daemon's other workspaces so the split
 * view and session overview can list and open sessions that are not in the
 * primary workspace. The primary workspace's own sessions still come from
 * `useSessions()`; callers merge the two (see `mergeSessionsById`).
 *
 * Scope & guarantees:
 * - Targets only `capabilities.workspaces` entries that are non-primary **and**
 *   trusted. Untrusted workspaces expose a persisted read-only catalog, but
 *   those rows are not openable and therefore do not belong in this hook; the
 *   primary is already covered by `useSessions`.
 * - Trusted non-primary active lists merge persisted rows with matching live
 *   summaries. This hook asks for `archiveState: 'active'`; archived and
 *   organized views are handled by their dedicated surfaces.
 * - Fans out with `Promise.allSettled`: one workspace failing (e.g. transiently
 *   unreachable) drops only its own rows, never the others'.
 * - Returns an empty, stable list on a single-workspace daemon (no
 *   `capabilities.workspaces`, or only the primary), so merging it is a no-op
 *   and the single-workspace UI is byte-identical.
 */
export declare function useOtherWorkspaceSessions(enabled?: boolean): OtherWorkspaceSessionsResult;
