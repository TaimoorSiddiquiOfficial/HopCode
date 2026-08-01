/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type { ChatRecord, HistoryGap } from '@hoptrendy/hopcode-core';
import { type TranscriptReplayStateV1 } from '@hoptrendy/acp-bridge/transcriptReplay';
import type { SessionEmitterContext } from './types.js';
export declare const MISSING_TOOL_RESULT_MESSAGE: string;
export interface PendingReplayToolCall {
    callId: string;
    toolName: string;
    timestamp?: string;
    recordId: string;
}
export interface HistoryReplayPageOptions {
    pendingToolCalls?: PendingReplayToolCall[];
    finalizeDangling?: boolean;
    gaps?: HistoryGap[];
}
export interface HistoryReplayPageState {
    pendingToolCalls: PendingReplayToolCall[];
    replay: TranscriptReplayStateV1;
}
/**
 * Handles replaying session history on session load.
 *
 * Uses the unified emitters to ensure consistency with normal flow.
 * This ensures that replayed history looks identical to how it would
 * have appeared during the original session.
 */
export interface HistoryReplayerOptions {
    /**
     * Emit a trailing `cleared` card when the transcript ends on an active goal
     * this session will refuse to restore. Only meaningful where goal restore
     * actually follows the replay — i.e. resuming a session into a live agent.
     *
     * Off by default. A replay that merely renders a transcript (export, or
     * reading another session's history) must reproduce what happened, not
     * editorialize about a Stop hook it was never going to register. It also has
     * no business asking `config` for trust and hook policy: the export path
     * supplies a config stub that throws on any method it does not implement.
     */
    supersedeUnrestorableGoal?: boolean;
}
export declare class HistoryReplayer {
    private readonly ctx;
    private readonly messageEmitter;
    private readonly toolCallEmitter;
    private readonly options;
    private machine;
    constructor(ctx: SessionEmitterContext, options?: HistoryReplayerOptions);
    replay(records: ChatRecord[], gaps?: HistoryGap[]): Promise<void>;
    replayPage(records: ChatRecord[], options?: HistoryReplayPageOptions): Promise<HistoryReplayPageState>;
    getPendingToolCalls(): PendingReplayToolCall[];
    getReplayState(): TranscriptReplayStateV1;
    private createMachine;
    private presentationAdapter;
    private sendUpdate;
    private copyCumulativeUsage;
    /**
     * Emits a trailing `cleared` card when the transcript ends on an active goal
     * that `restoreGoalFromHistory` is about to refuse.
     *
     * A client reads "there is an active goal" off the newest goal card it has
     * seen, so replaying a `set` card that no Stop hook will drive leaves the UI
     * claiming a goal is running when the loop is dead. The gates are pure
     * functions of `config`, so the answer is known here, before restore runs.
     *
     * This card is emitted, not recorded: the transcript keeps its `set` card, so
     * a later resume in a trusted folder (or with hooks re-enabled) restores the
     * goal instead of finding it destroyed. Emitting from inside replay is also
     * what puts the card *after* the `set` card — `loadSession` batches replay
     * updates into its response, and a notification sent afterwards would reach
     * the client first.
     *
     * Gated on `supersedeUnrestorableGoal`: only a resume registers a hook, and
     * only a resume has a `config` that answers trust and hook-policy questions.
     */
    private supersedeUnrestorableGoal;
    private setActiveRecordId;
}
