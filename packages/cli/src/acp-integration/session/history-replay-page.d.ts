/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type { ChatRecord, Config, HistoryGap, SessionTranscriptCursorState, SessionTranscriptRecordPage } from '@hoptrendy/hopcode-core';
import type { SessionUpdate } from '@agentclientprotocol/sdk';
import type { CumulativeUsage } from './types.js';
interface ReplayLogger {
    warn(message: string, ...args: unknown[]): void;
}
export declare function createReplayCumulativeUsage(): CumulativeUsage;
export declare function copyCumulativeUsage(target: CumulativeUsage, source: CumulativeUsage): void;
export declare function collectHistoryReplayUpdates({ sessionId, config, records, gaps, cumulativeUsage, logger, supersedeUnrestorableGoal, }: {
    sessionId: string;
    config?: Config;
    records: ChatRecord[];
    gaps?: HistoryGap[];
    cumulativeUsage: CumulativeUsage;
    logger?: ReplayLogger;
    /**
     * Forwarded to `HistoryReplayer`. Only the resume path, where
     * `#restoreGoalOnResume` follows, sets this. Reading another session's
     * history must render it as it was, not editorialize a goal it won't restore.
     */
    supersedeUnrestorableGoal?: boolean;
}): Promise<{
    updates: SessionUpdate[];
    replayError?: string;
}>;
export declare function liftSessionUpdateTimestamps(updates: SessionUpdate[]): SessionUpdate[];
export interface ReplayedTranscriptPage {
    updates: SessionUpdate[];
    nextCursor?: string;
    hasMore: boolean;
    startTime: string;
    lastUpdated: string;
    partial?: true;
    replayError?: string;
}
export declare function replayTranscriptRecordPage({ sessionId, page, config, encodeCursor, logger, }: {
    sessionId: string;
    page: SessionTranscriptRecordPage;
    config?: Config;
    encodeCursor: (state: SessionTranscriptCursorState) => string;
    logger?: ReplayLogger;
}): Promise<ReplayedTranscriptPage>;
export {};
