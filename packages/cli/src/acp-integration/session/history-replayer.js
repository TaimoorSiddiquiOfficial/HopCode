/**
 * @license
 * Copyright 2025 Qwen
 * SPDX-License-Identifier: Apache-2.0
 */
import { createTranscriptReplayMachine, MISSING_TRANSCRIPT_TOOL_RESULT_MESSAGE, } from '@hoptrendy/acp-bridge/transcriptReplay';
import { hasFullSessionContext } from './types.js';
import { MessageEmitter } from './emitters/MessageEmitter.js';
import { buildToolResultContentPrefix, ToolCallEmitter, } from './emitters/tool-call-emitter.js';
import { formatHistoryGapNotice } from '../../ui/utils/history-gap-notice.js';
import { collectGoalStatusItemsFromRecords, findGoalToRestore, goalConditionBlockedBy, goalRestoreBlockedBy, } from '../../ui/utils/restoreGoal.js';
import { writeStderrLineSafe } from '../../utils/stdioHelpers.js';
/**
 * Shown on the `cleared` card that supersedes an active goal the resumed
 * session refuses to restore. `condition-invalid` never reaches here: such a
 * card is dropped from the replay outright.
 */
const GOAL_NOT_RESTORED_REASON = {
    'untrusted-folder': 'Goal not restored: this folder is not trusted, so its Stop hook cannot run.',
    'hooks-disabled': 'Goal not restored: hooks are disabled for this session.',
    'no-hook-system': 'Goal not restored: the hook system is unavailable.',
};
export const MISSING_TOOL_RESULT_MESSAGE = MISSING_TRANSCRIPT_TOOL_RESULT_MESSAGE;
export class HistoryReplayer {
    ctx;
    messageEmitter;
    toolCallEmitter;
    options;
    machine;
    constructor(ctx, options = {}) {
        this.ctx = ctx;
        this.options = options;
        this.messageEmitter = new MessageEmitter(ctx);
        this.toolCallEmitter = new ToolCallEmitter(ctx);
        this.machine = this.createMachine();
    }
    async replay(records, gaps) {
        try {
            await this.replayPage(records, { finalizeDangling: true, gaps });
            await this.supersedeUnrestorableGoal(records);
        }
        finally {
            this.setActiveRecordId(null);
        }
    }
    async replayPage(records, options = {}) {
        this.machine = this.createMachine(options);
        let replayError;
        try {
            for (const record of records) {
                for (const emission of this.machine.project(record)) {
                    this.setActiveRecordId(emission.sourceRecordId, emission.sourceTimestamp);
                    await this.sendUpdate(emission.update);
                }
            }
        }
        catch (error) {
            replayError = error;
        }
        let danglingError;
        if (options.finalizeDangling === true) {
            for (const emission of this.machine.finalize()) {
                this.setActiveRecordId(emission.sourceRecordId, emission.sourceTimestamp);
                try {
                    await this.sendUpdate(emission.update);
                }
                catch (error) {
                    danglingError ??= error;
                }
            }
        }
        const replay = this.machine.snapshot();
        this.copyCumulativeUsage(replay);
        const state = {
            pendingToolCalls: options.finalizeDangling === true
                ? []
                : replay.pendingToolCalls.map(toLegacyPendingToolCall),
            replay,
        };
        this.setActiveRecordId(null);
        if (replayError && danglingError) {
            throw new AggregateError([replayError, danglingError], 'Replay and dangling-cleanup both failed');
        }
        if (replayError)
            throw replayError;
        if (danglingError)
            throw danglingError;
        return state;
    }
    getPendingToolCalls() {
        return this.machine
            .snapshot()
            .pendingToolCalls.map(toLegacyPendingToolCall);
    }
    getReplayState() {
        return this.machine.snapshot();
    }
    createMachine(options = {}) {
        const cumulative = this.ctx.cumulativeUsage;
        const initialState = {
            v: 1,
            pendingToolCalls: (options.pendingToolCalls ?? []).map(toPendingTranscriptToolCall),
            cumulativeUsage: cumulative
                ? { ...cumulative }
                : {
                    promptTokens: 0,
                    cachedTokens: 0,
                    candidateTokens: 0,
                    apiTimeMs: 0,
                },
        };
        return createTranscriptReplayMachine({
            initialState,
            gaps: options.gaps,
            presentation: this.presentationAdapter(),
            onDiagnostic: (diagnostic) => {
                if (diagnostic.code === 'malformed_part' &&
                    diagnostic.path ===
                        'systemPayload.outputHistoryItems.goalStatus.condition') {
                    writeStderrLineSafe(`qwen: ${diagnostic.message}`);
                }
            },
        });
    }
    presentationAdapter() {
        return {
            resolveToolMetadata: (toolName, args) => this.toolCallEmitter.resolveToolMetadata(toolName, { ...args }),
            formatHistoryGap: (gap) => formatHistoryGapNotice(gap),
            buildToolResultContentPrefix,
        };
    }
    async sendUpdate(update) {
        if (this.ctx.messageRewriter) {
            await this.ctx.messageRewriter.interceptUpdate(update);
            return;
        }
        await this.ctx.sendUpdate(update);
    }
    copyCumulativeUsage(state) {
        const cumulative = this.ctx.cumulativeUsage;
        if (!cumulative)
            return;
        cumulative.promptTokens = state.cumulativeUsage.promptTokens;
        cumulative.cachedTokens = state.cumulativeUsage.cachedTokens;
        cumulative.candidateTokens = state.cumulativeUsage.candidateTokens;
        cumulative.apiTimeMs = state.cumulativeUsage.apiTimeMs;
    }
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
    async supersedeUnrestorableGoal(records) {
        if (!this.options.supersedeUnrestorableGoal)
            return;
        const active = findGoalToRestore(collectGoalStatusItemsFromRecords(records));
        // An invalid condition was never replayed, so no active card is on screen.
        if (!active || goalConditionBlockedBy(active.condition))
            return;
        // Goal restore only follows a resume, where the context carries a config.
        if (!hasFullSessionContext(this.ctx))
            return;
        const blockedBy = goalRestoreBlockedBy(this.ctx.config);
        if (!blockedBy)
            return;
        await this.messageEmitter.emitGoalStatus({
            kind: 'cleared',
            condition: active.condition,
            iterations: active.iterations,
            ...(active.setAt !== undefined ? { setAt: active.setAt } : {}),
            lastReason: GOAL_NOT_RESTORED_REASON[blockedBy],
        });
    }
    setActiveRecordId(recordId, timestamp) {
        this.ctx.setActiveRecordId?.(recordId, timestamp);
    }
}
function toPendingTranscriptToolCall(pending) {
    return {
        callId: pending.callId,
        toolName: pending.toolName,
        sourceRecordId: pending.recordId,
        ...(pending.timestamp ? { sourceTimestamp: pending.timestamp } : {}),
    };
}
function toLegacyPendingToolCall(pending) {
    return {
        callId: pending.callId,
        toolName: pending.toolName,
        recordId: pending.sourceRecordId,
        ...(pending.sourceTimestamp ? { timestamp: pending.sourceTimestamp } : {}),
    };
}
//# sourceMappingURL=history-replayer.js.map