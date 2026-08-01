/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Tracks in-flight and recently-finished workflow runs spawned via the
 * `Workflow` tool. Sibling of `BackgroundTaskRegistry` (agents),
 * `BackgroundShellRegistry` (shells), and `MonitorRegistry` (monitors).
 * Each entry holds the metadata that the footer pill, the `/workflows`
 * slash command, and the Background tasks dialog use to query, observe,
 * or cancel a running workflow.
 *
 * State machine: register → running → { completed | failed | cancelled }.
 * Transitions out of running are one-shot — complete / fail / cancel
 * become no-ops once the entry has settled.
 *
 * Unlike `BackgroundTaskRegistry`, the workflow registry does NOT emit
 * any `<task-notification>` XML or model-facing prose — `WorkflowTool`
 * already returns its own llmContent + returnDisplay payload to the
 * model when the run terminates, so a second envelope would duplicate
 * the signal. The registry is UI-only: its callbacks drive the pill
 * counts, the dialog roster, and the per-phase detail body.
 */
import type { TaskBase, TaskRegistration } from './tasks/types.js';
import type { WorkflowMeta } from './runtime/workflow-sandbox.js';
/**
 * Cap on terminal entries retained for dialog history. Picked smaller
 * than `MAX_RETAINED_TERMINAL_AGENTS` (32) because workflow rows carry
 * the heavier label (workflow name + phase tree) and because users
 * typically run far fewer workflows than agents per session.
 */
export declare const MAX_RETAINED_TERMINAL_WORKFLOWS = 10;
export type WorkflowStatus = 'running' | 'completed' | 'failed' | 'cancelled';
/**
 * Workflow kind of `TaskState`. Tracks one orchestrator run — the
 * top-level `Workflow` tool call, not its internal subagent dispatches
 * (those are routed through the regular subagent path and recorded by
 * `BackgroundTaskRegistry` when backgrounded). The `phases` array is
 * the sandbox's `getPhases()` snapshot; `currentPhase` is the head of
 * the most recent `phase()` call.
 */
export interface WorkflowTask extends TaskBase {
    kind: 'workflow';
    /** Run identifier (e.g. `wf_<8hex>`); aliased to `TaskBase.id`. */
    runId: string;
    /**
     * Parsed `export const meta = {...}` from the workflow script, or
     * `null` if the script had no meta declaration. The pill / dialog
     * row label falls back to `runId` when meta is null.
     */
    meta: WorkflowMeta | null;
    status: WorkflowStatus;
    /** Title of the most recent `phase(...)` call, or `null` before the first phase. */
    currentPhase: string | null;
    /**
     * All phase titles seen so far (deduplicated against the previous
     * entry — matches the sandbox's `safePhase` collapse). Capped at
     * `MAX_PHASE_ENTRIES` (10_000) by the sandbox.
     */
    phases: string[];
    /** Cumulative `agent()` dispatches issued by this run. */
    agentsDispatched: number;
    /** Cumulative `agent()` dispatches that have resolved (success or thrown). */
    agentsCompleted: number;
    /** Most recent log lines from the sandbox's `getLogs()`. Capped at 100 for the UI. */
    recentLogs: string[];
    /**
     * P5: cumulative output tokens spent by this run's `agent()` dispatches.
     * Mirrored from `budget.spent()` after each successful completion via
     * the `budgetUpdated` emitter event. Stays at `0` for runs without a
     * budget (legacy callers) and for the period between register and the
     * first dispatch settling.
     */
    tokensSpent: number;
    /**
     * P5: per-run token cap from `HOPCODE_MAX_TOKENS_PER_WORKFLOW`. `null`
     * when no cap is set — the dialog renders `tokensSpent` alone in that
     * case rather than the `M / N` form. Set at register time from
     * `budget.total` and re-affirmed by every `budgetUpdated` fire (the
     * budget's `total` is immutable so the value never changes mid-run).
     */
    tokenBudgetTotal: number | null;
    /**
     * P5: per-phase token attribution. Delta tokens are attributed to the
     * entry's `currentPhase` at the moment `budgetUpdated` fires. A
     * workflow that dispatches an agent before its first `phase()` call
     * accumulates that agent's tokens under a sentinel `null` phase, which
     * the UI surfaces as `(no phase)` so the share is observable rather
     * than hidden.
     */
    perPhaseTokens: Map<string | null, number>;
    /**
     * P7b: the workflow script source (verbatim, as the tool received it).
     * Used by the run-snapshot writer (so a persisted run carries its
     * script) and the save-to-disk dialog (so a completed run can be saved
     * to `.hopcode/workflows/<name>.js`). Empty string for legacy callers that
     * don't supply it.
     */
    script: string;
    /**
     * P7b: the path the script was loaded from, when the run was launched
     * from a saved workflow (`Workflow({scriptPath})` or a `/workflow-name`
     * slash command). `undefined` for inline scripts. Recorded as run
     * provenance (e.g. for the snapshot).
     */
    scriptPath?: string;
    /** Final script return value once the run completes (success path). */
    result?: unknown;
    /** Error message on `failed` (terminal). */
    error?: string;
}
/**
 * Shape callers pass to `register()`. The four `TaskBase` fields the
 * registry derives — `id`, `kind`, `outputOffset`, `notified` — are
 * omitted; everything else (including `outputFile`) is supplied by the
 * caller. `currentPhase` / `phases` / `agentsDispatched` /
 * `agentsCompleted` / `recentLogs` all default to their empty
 * counterparts at register time and become observable via subsequent
 * `onPhaseStarted` / `onAgentDispatched` / etc.
 */
export type WorkflowTaskRegistration = Omit<TaskRegistration<WorkflowTask>, 'currentPhase' | 'phases' | 'agentsDispatched' | 'agentsCompleted' | 'recentLogs' | 'tokensSpent' | 'tokenBudgetTotal' | 'perPhaseTokens' | 'script' | 'description'> & {
    description?: string;
    /**
     * P5: optional per-run token cap at register time. Defaults to `null`
     * (no cap). Persists for the life of the entry — `onBudgetUpdated`
     * does NOT re-write it because the budget's `total` is immutable.
     */
    tokenBudgetTotal?: number | null;
    /**
     * P7b: the workflow script source. Defaults to `''` when omitted (legacy
     * callers / tests). Needed for run snapshots + the save-to-disk dialog.
     */
    script?: string;
};
/** Fires when a new entry is registered. */
export type WorkflowRunRegisterCallback = (entry: WorkflowTask) => void;
/**
 * Fires whenever the entry's `status`, `currentPhase`, or dispatch
 * counts change. Symmetric with the other registries' `statusChange`
 * callback so the unified `useBackgroundTaskView` hook can subscribe
 * to all four with the same shape.
 */
export type WorkflowRunStatusChangeCallback = (entry?: WorkflowTask) => void;
/**
 * P-notif: fires once when a run reaches a terminal state worth surfacing to
 * the user — `completed` / `failed`, but NOT a user-initiated `cancel` (the
 * user already knows). The CLI wires this to the terminal-bell notification
 * service. A separate slot from `statusChangeCallback` (which the dialog's
 * `useBackgroundTaskView` owns), so the two never clobber each other.
 */
export type WorkflowRunNotificationCallback = (entry: WorkflowTask) => void;
export declare class WorkflowRunRegistry {
    private readonly entries;
    private registerCallback;
    private statusChangeCallback;
    private notificationCallback;
    /**
     * P5 T7: one-time usage-warning latch. The first `Workflow` tool
     * invocation per session checks `shouldShowUsageWarning()`; if true,
     * the tool prepends a one-line banner to the result describing the
     * token-budget knob (`HOPCODE_MAX_TOKENS_PER_WORKFLOW`) and how to
     * suppress (`skipWorkflowUsageWarning` setting). The latch flips on
     * the same call so subsequent runs are quiet. Survives `reset()` —
     * the warning is per-session, not per-clear.
     */
    private usageWarningShown;
    /**
     * P5 T7: gate the one-time usage warning. Returns `true` exactly once
     * per session, flipping the latch as a side effect. Settings-level
     * suppression (`skipWorkflowUsageWarning`) is enforced upstream by
     * the caller (`WorkflowTool`) before invoking — the registry only
     * tracks session-scoped freshness.
     */
    shouldShowUsageWarning(): boolean;
    setRegisterCallback(cb: WorkflowRunRegisterCallback | undefined): void;
    setStatusChangeCallback(cb: WorkflowRunStatusChangeCallback | undefined): void;
    setNotificationCallback(cb: WorkflowRunNotificationCallback | undefined): void;
    /** Fire the terminal-completion notification (best-effort). */
    private emitNotification;
    /**
     * Register a new run. Mutates the registration in place to graduate
     * it to a `WorkflowTask` (sets `id`, `kind`, derived counters), so
     * callers can keep using their local reference post-register and
     * observers see updates without an extra `get()`.
     */
    register(registration: WorkflowTaskRegistration): WorkflowTask;
    /**
     * Append a phase title. Mirrors the sandbox's `safePhase` collapse:
     * a phase identical to the most recent entry is treated as the same
     * phase and not re-appended. `currentPhase` is set unconditionally.
     *
     * @param runId  the run to update
     * @param title  the phase title from the sandbox `phase()` call
     */
    onPhaseStarted(runId: string, title: string): void;
    /** Cumulative dispatch counter — incremented before each `agent()` call resolves. */
    onAgentDispatched(runId: string): void;
    /** Cumulative completion counter — incremented after each `agent()` call settles. */
    onAgentCompleted(runId: string): void;
    /**
     * P5: mirror a `budgetUpdated` emitter event into the entry. Attributes
     * the cumulative delta (`spent - entry.tokensSpent`) to the entry's
     * `currentPhase`. Per-phase attribution is best-effort: agents in
     * flight when the script issues a new `phase()` will attribute their
     * tokens to whichever phase was current when `budgetUpdated` fires —
     * the orchestrator fires immediately after `agentCompleted`, so the
     * race window is bounded but not zero. Tasks before the first
     * `phase()` call attribute to the sentinel `null` key.
     */
    onBudgetUpdated(runId: string, spent: number, total: number | null): void;
    /**
     * Replace the recent-log tail. The sandbox owns the source-of-truth
     * `getLogs()` array; we mirror it here for the UI so the dialog
     * doesn't have to thread a sandbox reference. Capped at 100 entries
     * (the tail) so a chatty workflow doesn't bloat the registry.
     *
     * R7 (wenshao): allowed after a `'cancelled'` transition too. The
     * dialog-initiated cancel path calls `registry.cancel()` first
     * (status flips to `'cancelled'` synchronously), then the abort
     * propagates to the tool's catch arm which calls `setRecentLogs`.
     * Without this, dialog-cancelled runs always showed an empty Logs
     * section. `'completed'` / `'failed'` are still rejected — those
     * terminal states ARE final (no late-arriving logs to absorb).
     */
    setRecentLogs(runId: string, logs: readonly string[]): void;
    complete(runId: string, result: unknown, endTime: number): void;
    fail(runId: string, message: string, endTime: number): void;
    /**
     * Mark a running entry as cancelled and abort its controller. No-op
     * if the entry has already settled — protects against an explicit
     * dialog cancel racing with the natural complete/fail path.
     */
    cancel(runId: string, endTime: number): void;
    get(runId: string): WorkflowTask | undefined;
    /** All entries (running + terminal, no filter). Iteration order = registration order. */
    list(): WorkflowTask[];
    /**
     * R7 (wenshao): true if any entry is still `'running'`. Mirrors the
     * three sibling registries' `hasUnfinalizedTasks()` /
     * `hasRunningEntries()` / `getRunning().length > 0` so the unified
     * `hasBlockingBackgroundWork()` helper (the gate `/clear` and session-
     * resume both use to refuse a switch with live work) can count
     * workflow runs the same way.
     */
    hasRunningEntries(): boolean;
    /**
     * R7 (wenshao): drop every in-memory entry without touching
     * controllers. Mirrors `BackgroundShellRegistry.reset()` and the
     * other siblings' contract — callers (`/clear`, session-resume)
     * MUST verify via `hasRunningEntries()` first that no still-running
     * work exists before invoking. The companion path that aborts
     * controllers is `abortAll()`.
     */
    reset(): void;
    /**
     * R7 (wenshao): cancel every still-running entry. Called on session/
     * Config shutdown so workflow runs don't outlive the CLI process and
     * leak orphaned dispatches. Symmetric with `BackgroundShellRegistry.
     * abortAll()` and `BackgroundTaskRegistry.abortAll()`.
     *
     * Settles each entry inline (status → 'cancelled', abort the
     * controller) and fires the status-change callback exactly once
     * after the loop — the per-entry `cancel()` path would have fired
     * the callback for every running entry, wasteful on shutdown.
     */
    abortAll(): void;
    /**
     * Sweep terminal entries when they exceed `MAX_RETAINED_TERMINAL_WORKFLOWS`.
     * Running entries are always retained. Oldest terminal entries
     * (by `endTime`) are evicted first.
     */
    private evictTerminal;
    private emitStatusChange;
}
