/**
 * @license
 * Copyright 2025 hopcode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { type BridgeEvent, type CompactionEngine, type SessionReplaySnapshot } from './eventBus.js';
export type { CompactionEngine, SessionReplaySnapshot };
export { DEFAULT_COMPACTED_REPLAY_MAX_BYTES, MAX_COMPACTED_REPLAY_MAX_BYTES, normalizeCompactedReplayMaxBytes, } from './replayWindowLimits.js';
export interface ReplayWindowEviction {
    droppedBytes: number;
    droppedEvents: number;
    droppedSegments: number;
    droppedTurns: number;
    maxBytes: number;
    retainedBytes: number;
    retainedEvents: number;
}
export interface TurnBoundaryCompactionEngineOptions {
    maxReplayBytes?: number;
    onReplayWindowEviction?: (eviction: ReplayWindowEviction) => void;
}
/**
 * Compaction engine that merges events at turn boundaries.
 *
 * On each `turn_complete` / `turn_error`, all accumulated events for that
 * turn are folded: consecutive text/thought chunks merge into single events,
 * tool call sequences fold to final state, transient signals are dropped.
 * The relative ordering of different event types is preserved.
 *
 * The result is a replay log whose size is O(conversation_turns), not
 * O(streaming_tokens). Typical compression: 25-30x for chatty sessions.
 */
export declare class TurnBoundaryCompactionEngine implements CompactionEngine {
    private readonly maxReplayBytes;
    private readonly onReplayWindowEviction;
    private replaySegments;
    private replaySegmentStart;
    private replayBytes;
    private liveJournal;
    private lastEventId;
    private closed;
    private truncatedEvents;
    private truncatedTurns;
    private slots;
    private toolSlotIndex;
    private textSlotIndex;
    constructor(opts?: TurnBoundaryCompactionEngineOptions);
    ingest(event: BridgeEvent): void;
    snapshot(): SessionReplaySnapshot;
    seed(snapshot: {
        compactedTurns: BridgeEvent[];
        lastEventId: number;
    }): void;
    seedReplayEvents(events: BridgeEvent[]): void;
    close(): void;
    private classifySessionUpdate;
    private mergeTextSlot;
    private compactCurrentTurn;
    private recordLastEventId;
    private addReplaySegment;
    private enforceReplayWindow;
    private flattenReplaySegments;
    private activeReplaySegmentCount;
    private compactReplaySegmentQueueIfNeeded;
    private notifyReplayWindowEviction;
    private makeHistoryTruncatedEvent;
    private resetReplayWindow;
    private clearTextSlotIndex;
}
