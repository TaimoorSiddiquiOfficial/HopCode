/**
 * @license
 * Copyright 2025 Qwen
 * SPDX-License-Identifier: Apache-2.0
 */
import type { Content } from '@google/genai';
import type { Config, ChatRecord, HistoryGap, AutoModeDecision, AutoModeOutcome } from '@hoptrendy/hopcode-core';
import type { AvailableCommand, PromptRequest, PromptResponse, RequestPermissionRequest, RequestPermissionResponse, SessionUpdate, SetSessionModeRequest, SetSessionModeResponse, SetSessionModelRequest, SetSessionModelResponse, AgentSideConnection } from '@agentclientprotocol/sdk';
import { type LoadedSettings } from '../../config/settings.js';
import { type HistoryItemGoalStatus } from '../../ui/types.js';
import type { CumulativeUsage, SessionContext } from './types.js';
import { MessageRewriteMiddleware } from './rewrite/index.js';
export declare function isExistingFile(resolved: string, fileExists?: (path: string) => boolean, statFile?: (path: string) => {
    isFile(): boolean;
}): boolean;
export declare function resolveHomeLoopResolverRoots({ homeQwenDir, homeDir, qwenHome, }?: {
    homeQwenDir?: string;
    homeDir?: string;
    qwenHome?: string;
}): {
    homeConfineRoot: string;
    homeQwenDir: string;
};
export declare function computeInitialTurnFromHistory(records: ChatRecord[], sessionId: string): number;
export declare function fireSessionPermissionDeniedForAutoMode(config: Config, decision: AutoModeDecision, outcome: AutoModeOutcome, toolName: string, toolParams: Record<string, unknown>, callId: string, signal?: AbortSignal): Promise<void>;
export interface AvailableCommandsSnapshot {
    availableCommands: AvailableCommand[];
    availableSkills?: string[];
    availableSkillDetails?: Array<{
        name: string;
        description?: string;
        body?: string;
        filePath?: string;
        level?: string;
        modelInvocable?: boolean;
    }>;
}
export declare function buildAvailableCommandsSnapshot(config: Config, abortSignal?: AbortSignal, settings?: LoadedSettings): Promise<AvailableCommandsSnapshot>;
/**
 * Session represents an active conversation session with the AI model.
 * It uses modular components for consistent event emission:
 * - HistoryReplayer for replaying past conversations
 * - ToolCallEmitter for tool-related session updates
 * - PlanEmitter for todo/plan updates
 * - SubAgentTracker for tracking sub-agent tool calls
 */
export declare class Session implements SessionContext {
    #private;
    readonly config: Config;
    private readonly client;
    private readonly settings;
    private pendingPrompt;
    /**
     * Tracks the completion of the current prompt so that the next prompt
     * can await it.  This prevents a new prompt from reading chat history
     * before the previous prompt's tool results have been added —
     * a race condition that causes malformed history on Windows where
     * process termination is slow.
     */
    private pendingPromptCompletion;
    /**
     * Per-turn AbortController for the fire-and-forget follow-up suggestion
     * generation. Aborted on the top of the next `prompt()` and on
     * `cancelPendingPrompt()` so a stale suggestion never lands after the
     * user has moved on. Null when no suggestion generation is in flight.
     */
    private followupAbort;
    private turn;
    private readonly createdAt;
    /**
     * Running cumulative usage for this session, snapshotted onto each todo/plan
     * update by PlanEmitter so the web-shell can show per-task token/API spend.
     */
    readonly cumulativeUsage: CumulativeUsage;
    private readonly runtimeBaseDir;
    private cronQueue;
    private cronProcessing;
    private cronAbortController;
    private loopTickResolver;
    private loopTickResolverRoot;
    private cronCompletion;
    private cronDisabledByTokenLimit;
    private lastPromptTokenCount;
    private lastPromptTokenCountChat;
    private midTurnDrainUnavailable;
    private midTurnDrainTimeoutStrikes;
    private readonly duplicateProviderToolCallResponseIds;
    private midTurnRecoveredMessages;
    private readonly todoStopGuard;
    private todoStopGuardBackgroundBaseline;
    private todoStopGuardQueuedPromptPriority;
    private todoStopGuardDrainAutomaticQueuesWhenIdle;
    private notificationQueue;
    private notificationProcessing;
    private notificationAbortController;
    private notificationCompletion;
    private disposed;
    private unsubscribeChatRecordingFailure?;
    private readonly historyReplayer;
    private readonly toolCallEmitter;
    private readonly planEmitter;
    private readonly messageEmitter;
    messageRewriter?: MessageRewriteMiddleware;
    /**
     * Phase C worktree restore notice. Set by acpAgent.loadSession when a
     * resumed session has a live worktree sidecar; prepended to the next
     * #executePrompt call as a <system-reminder>, then cleared.
     *
     * One-shot by design — after the first prompt the worktree path is
     * already in the conversation context (the reminder we just sent + any
     * subsequent tool calls), so re-injecting on every turn would clutter
     * the history without adding signal. TUI uses historyManager.addItem(INFO)
     * for the equivalent UX hint and headless prepends to the single shot
     * prompt; all three modes share the `restoreWorktreeContext` helper
     * that produces this string.
     */
    pendingWorktreeNotice: string | null;
    readonly sessionId: string;
    constructor(id: string, config: Config, client: AgentSideConnection, settings: LoadedSettings);
    releaseTodoStopGuardQueuedPromptWait(): boolean;
    clearTodoStopGuardTrust(): void;
    getId(): string;
    /**
     * Starts the cron scheduler at session creation. Durable tasks live on
     * disk; waiting for the end of the first prompt (the in-turn start at
     * the bottom of prompt()) would leave them invisible to cron_list /
     * cron_delete for the whole first turn and unfired while the session
     * idles before any prompt — the TUI equivalent enables durable cron on
     * mount.
     */
    startCronScheduler(): void;
    getConfig(): Config;
    isIdle(): boolean;
    getTurnCount(): number;
    getCreatedAt(): number;
    dispose(): void;
    /**
     * Install the message rewrite middleware if configured.
     * Must be called AFTER history replay to avoid rewriting historical messages.
     */
    installRewriter(): void;
    /**
     * Installs (or replaces) this session's goal-terminal observer.
     *
     * Public because it does not stay installed: `registerGoalHook` and
     * `unregisterGoalHook` both clear the observer table for the session, so any
     * caller that (re-)registers a goal outside `#processSlashCommandResult` —
     * notably goal restore on resume — has to put it back. Idempotent.
     */
    installGoalTerminalObserver(): void;
    /**
     * Emits a goal card and persists it to the transcript. Both `set` and
     * `cleared` reach the client this way — from `#emitGoalStatusItems` for a
     * `/goal` prompt, and from the `sessionGoalClear` ext method — so recording
     * here (rather than at each call site) keeps the transcript in step with the
     * hook. Replay goes through `messageEmitter.emitGoalStatus` directly and so
     * does not re-record.
     */
    emitGoalStatus(status: Omit<HistoryItemGoalStatus, 'id' | 'type'>): void;
    /**
     * Replays conversation history to the client using modular components.
     * Delegates to HistoryReplayer for consistent event emission.
     */
    primeTurnFromHistory(records: ChatRecord[]): void;
    replayHistory(records: ChatRecord[], gaps?: HistoryGap[]): Promise<void>;
    rewindToTurn(targetTurnIndex: number, opts?: {
        rewindFiles?: boolean;
    }): {
        targetTurnIndex: number;
        apiTruncateIndex: number;
    };
    captureHistorySnapshot(): Content[];
    getRewindableUserTurnCount(): number;
    restoreHistory(history: Content[]): void;
    cancelPendingPrompt(): Promise<void>;
    prompt(params: PromptRequest): Promise<PromptResponse>;
    /**
     * Classify whether an unfinished previous turn can be resumed — an
     * interrupted prompt (the model never answered) or a turn left with dangling
     * tool calls — without injecting a synthetic "continue" user message.
     * Classifies from persisted history. Idempotent no-op (accepted:false) when
     * the last turn ended cleanly or a prompt is already in flight.
     *
     * This is the accept/reject pre-check only — it does NOT fire the turn. When
     * accepted, the daemon bridge drives the continuation through the normal
     * prompt-admission path (`sendPrompt` with the trusted continue meta) so it is
     * tracked like any other prompt; `prompt()` then re-detects/strips
     * authoritatively. Powers `qwen/control/session/continue`.
     */
    continueLastTurn(): Promise<{
        accepted: boolean;
        interruption: 'none' | 'interrupted_prompt' | 'interrupted_turn';
    }>;
    sendUpdate(update: SessionUpdate): Promise<void>;
    sendAvailableCommandsUpdate(): Promise<void>;
    refreshSkillsFromSettings(): Promise<void>;
    private sendAvailableCommandsUpdateOrThrow;
    /**
     * Requests permission from the client for a tool call.
     * Used by SubAgentTracker for sub-agent approval requests.
     */
    requestPermission(params: RequestPermissionRequest): Promise<RequestPermissionResponse>;
    /**
     * Sets the approval mode for the current session.
     * Maps ACP approval mode values to core ApprovalMode enum.
     */
    setMode(params: SetSessionModeRequest): Promise<SetSessionModeResponse | void>;
    /**
     * Sets the model for the current session.
     * Validates the model ID and switches the model via Config.
     */
    setModel(params: SetSessionModelRequest, options?: {
        persistDefault?: boolean;
    }): Promise<SetSessionModelResponse | void>;
    /**
     * Sends a current_mode_update notification to the client.
     * Called after the agent switches modes (e.g., from exit_plan_mode tool).
     */
    private sendCurrentModeUpdateNotification;
    /**
     * Execute a batch of model-returned tool calls, running Agent calls
     * concurrently while keeping other tools sequential.
     *
     * Mirrors the partition logic in `coreToolScheduler.partitionToolCalls`:
     * consecutive Agent calls form a parallel batch (they spawn independent
     * sub-agents with no shared mutable state); any other tool forms its own
     * sequential batch to preserve the implicit ordering the model may rely
     * on. Response-part ordering matches the original `functionCalls` order.
     */
    private runToolCalls;
    private runTool;
    debug(msg: string): void;
    private emitHookArtifactsNotification;
    /**
     * Fire a notification hook and forward any terminalSequence to the ACP
     * client as an extNotification. Fire-and-forget — errors are logged at
     * debug level.
     */
    private fireNotificationHookWithTerminalSequence;
}
