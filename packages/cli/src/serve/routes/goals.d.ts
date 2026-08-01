/**
 * @license
 * Copyright 2026 Qwen Team
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Workspace-wide `/goal` listing — the daemon-side surface behind the Web Shell
 * "Goals" page.
 *
 * A goal is a session-scoped Stop hook whose state (condition, judge turn count,
 * last verdict) lives only in the `qwen --acp` child's in-memory store. The serve
 * process holds no copy, so this route fans out one `sessionGoalGet` ext-method
 * call per live session and collects the answers. There is no durable goal store
 * to read instead: a goal only advances while its session is resident, so "the
 * live sessions" IS the complete set of goals that are actually running.
 *
 * A session whose child is wedged or dying rejects; those are dropped (and
 * logged) rather than failing the whole list, so one bad session can't hide the
 * others. The per-call timeout is the bridge's, and the calls run concurrently
 * (up to `PROBE_CONCURRENCY`), so a wedged child costs one timeout rather than
 * one per session.
 *
 * Read-only: clearing a goal stays on `POST /session/:id/goal/clear`, and
 * setting one stays a prompt (`/goal <condition>` registers the hook and kicks
 * off the first turn — it is not a pure write).
 */
import type { Application } from 'express';
import type { BridgeSessionGoal, BridgeSessionSummary } from '@hoptrendy/acp-bridge';
/**
 * The slice of the session bridge this route needs. Narrowed to a structural
 * type so tests can stub it without the full bridge.
 */
export interface GoalsSessionBridge {
    listWorkspaceSessions(workspaceCwd: string): BridgeSessionSummary[];
    getSessionGoal(sessionId: string): Promise<BridgeSessionGoal>;
}
export interface RegisterGoalsRoutesDeps {
    boundWorkspace: string;
    bridge: GoalsSessionBridge;
}
export declare function registerGoalsRoutes(app: Application, deps: RegisterGoalsRoutesDeps): void;
