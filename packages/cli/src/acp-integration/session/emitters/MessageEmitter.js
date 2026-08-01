/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { createTranscriptMessageUpdate, createTranscriptUsageUpdate, } from '@hoptrendy/acp-bridge/transcriptReplay';
import { apiActivityTracker, getActiveGoal, } from '@hoptrendy/hopcode-core';
import { BaseEmitter } from './base-emitter.js';
/**
 * Handles emission of text message chunks (user, agent, thought).
 *
 * This emitter is responsible for sending message content to the ACP client
 * in a consistent format, regardless of whether the message comes from
 * normal flow, history replay, or other sources.
 */
export class MessageEmitter extends BaseEmitter {
    /**
     * Emits a StopHookLoop event when Stop hooks create a loop.
     * This informs the client that Stop hooks have been executed multiple times.
     *
     * @param iterationCount - The current iteration count
     * @param reasons - Array of reasons from each Stop hook execution
     * @param stopHookCount - Number of Stop hooks that were executed
     */
    async emitStopHookLoop(iterationCount, reasons, stopHookCount) {
        const activeGoal = getActiveGoal(this.sessionId);
        await this.sendUpdate({
            sessionUpdate: 'agent_message_chunk',
            content: { type: 'text', text: '' },
            _meta: {
                stopHookLoop: {
                    iterationCount,
                    reasons,
                    stopHookCount,
                    ...(activeGoal
                        ? {
                            goal: {
                                condition: activeGoal.condition,
                                iterations: activeGoal.iterations,
                                setAt: activeGoal.setAt,
                                lastReason: activeGoal.lastReason,
                            },
                        }
                        : {}),
                },
            },
        });
    }
    async emitGoalTerminal(event) {
        await this.sendUpdate({
            sessionUpdate: 'agent_message_chunk',
            content: { type: 'text', text: '' },
            _meta: {
                goalTerminal: event,
            },
        });
    }
    async emitGoalStatus(status) {
        await this.sendUpdate({
            sessionUpdate: 'agent_message_chunk',
            content: { type: 'text', text: '' },
            _meta: {
                goalStatus: status,
            },
        });
    }
    /**
     * Emits a user message chunk.
     *
     * @param text - The user message text content
     * @param timestamp - Optional server-side timestamp (ISO string or ms) for message ordering
     */
    async emitUserMessage(text, timestamp, options = {}) {
        await this.sendUpdate(createTranscriptMessageUpdate({
            role: 'user',
            text,
            timestamp,
            ...(options.source ? { extra: { source: options.source } } : {}),
        }));
    }
    /**
     * Emits an agent thought chunk.
     *
     * @param text - The thought text content
     * @param timestamp - Optional server-side timestamp (ISO string or ms) for message ordering
     */
    async emitAgentThought(text, timestamp, subagentMeta) {
        await this.sendUpdate(createTranscriptMessageUpdate({
            role: 'assistant',
            thought: true,
            text,
            timestamp,
            ...(subagentMeta ? { extra: { ...subagentMeta } } : {}),
        }));
    }
    /**
     * Emits an agent message chunk.
     *
     * @param text - The agent message text content
     * @param timestamp - Optional server-side timestamp (ISO string or ms) for message ordering
     */
    async emitAgentMessage(text, timestamp, subagentMeta) {
        await this.sendUpdate(createTranscriptMessageUpdate({
            role: 'assistant',
            text,
            timestamp,
            ...(subagentMeta ? { extra: { ...subagentMeta } } : {}),
        }));
    }
    async emitSlashCommandOutput(text, timestamp) {
        const epochMs = BaseEmitter.toEpochMs(timestamp);
        await this.sendUpdate({
            sessionUpdate: 'agent_message_chunk',
            content: { type: 'text', text },
            _meta: {
                source: 'slash_command',
                ...(epochMs != null ? { timestamp: epochMs } : {}),
            },
        });
    }
    /**
     * Emits usage metadata.
     */
    async emitUsageMetadata(usageMetadata, text = '', durationMs, subagentMeta) {
        // ORDERING INVARIANT: this runs before PlanEmitter.emitPlan within a turn —
        // usage advances the cumulative accumulator, then the plan update snapshots
        // it. Reordering or batching emissions so a plan is sent before its turn's
        // usage would zero out that task's per-task stats.
        //
        // Only fold in finite values: a NaN/Infinity from a provider (or a NaN that
        // slips through `?? 0`, since `NaN ?? 0 === NaN`) would poison the running
        // total forever (`NaN + x === NaN`), so every later snapshot would fail
        // extractTodoStats's Number.isFinite check and silently show "not captured"
        // for the rest of the session. apiTimeMs only advances on the live path
        // (a per-turn duration is present), keeping API time live-only on replay.
        const cumulative = this.ctx.cumulativeUsage;
        if (cumulative) {
            const addFinite = (total, value) => typeof value === 'number' && Number.isFinite(value)
                ? total + value
                : total;
            cumulative.promptTokens = addFinite(cumulative.promptTokens, usageMetadata.promptTokenCount);
            cumulative.candidateTokens = addFinite(cumulative.candidateTokens, usageMetadata.candidatesTokenCount);
            cumulative.cachedTokens = addFinite(cumulative.cachedTokens, usageMetadata.cachedContentTokenCount);
            cumulative.apiTimeMs = addFinite(cumulative.apiTimeMs, durationMs);
        }
        // A live model round is discriminated by a present `durationMs` (replay
        // frames omit it). Only then do we drain the model-API-error / auto-retry
        // counters onto this frame's `_meta`, so the daemon host's metrics ring
        // windows the increments alongside token burn and LLM latency. Draining on
        // a replayed frame would consume real pending counts the bridge ignores for
        // replay, silently dropping them — hence the `durationMs` guard. Absent /
        // zero keys keep no-error frames byte-identical to before.
        let activityMeta = {};
        if (typeof durationMs === 'number') {
            const activity = apiActivityTracker.drain();
            activityMeta = {
                ...(activity.errors > 0 ? { apiErrors: activity.errors } : {}),
                ...(activity.retries > 0 ? { apiRetries: activity.retries } : {}),
            };
        }
        await this.sendUpdate(createTranscriptUsageUpdate(usageMetadata, {
            text,
            extra: {
                ...(typeof durationMs === 'number' ? { durationMs } : {}),
                ...activityMeta,
                ...subagentMeta,
            },
        }));
    }
    /**
     * Emits a message chunk based on role and thought flag.
     * This is the unified method that handles all message types.
     *
     * @param text - The message text content
     * @param role - Whether this is a user or assistant message
     * @param isThought - Whether this is an assistant thought (only applies to assistant role)
     * @param timestamp - Optional server-side timestamp (ISO string or ms) for message ordering
     */
    async emitMessage(text, role, isThought = false, timestamp, subagentMeta) {
        if (role === 'user') {
            return this.emitUserMessage(text, timestamp);
        }
        return isThought
            ? this.emitAgentThought(text, timestamp, subagentMeta)
            : this.emitAgentMessage(text, timestamp, subagentMeta);
    }
}
//# sourceMappingURL=MessageEmitter.js.map