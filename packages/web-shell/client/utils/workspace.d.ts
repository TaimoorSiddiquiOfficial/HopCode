/**
 * @license
 * Copyright 2025 Qwen Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type { DaemonCapabilities, DaemonSessionSummary } from '@hoptrendy/sdk/daemon';
/**
 * Last path segment of an absolute workspace cwd, for a compact per-workspace
 * label (e.g. `/home/me/projects/api` → `api`). Falls back to the full path when
 * it has no segments. Mirrors the sidebar's `WorkspaceSection` naming so the
 * split view / overview label a workspace the same way its sidebar section does.
 */
export declare function workspaceBasename(cwd: string): string;
/**
 * True when the daemon advertises more than one registered workspace — i.e. the
 * multi-workspace session surfaces (per-workspace labels/tags) should show.
 * A single-workspace daemon omits `workspaces` (or lists just the primary), so
 * every workspace-scoped affordance stays hidden and the UI is unchanged.
 */
export declare function hasMultipleWorkspaces(capabilities: DaemonCapabilities | undefined): boolean;
/**
 * Whether a session belongs to a workspace other than the primary one. Both cwds
 * are daemon-canonicalized, so a raw string compare is correct. Returns false
 * when either cwd is unknown (treat as primary) so single-workspace never tags.
 */
export declare function isNonPrimaryWorkspaceSession(workspaceCwd: string | undefined, primaryCwd: string | undefined): boolean;
/**
 * Merge the primary workspace's sessions with the sessions collected from other
 * workspaces into one list, keyed by `sessionId` (primary wins on the unlikely
 * id collision). Returns the primary list unchanged (same reference) when there
 * are no other-workspace sessions, so the single-workspace path is a no-op.
 */
export declare function mergeSessionsById(primary: DaemonSessionSummary[], others: DaemonSessionSummary[]): DaemonSessionSummary[];
