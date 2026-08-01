/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type { DaemonTranscriptBlock } from '@hoptrendy/sdk/daemon';
import type { DaemonMessage } from './messageTypes.js';
interface TranscriptMessageLabels {
    promptCancelled?: string;
    branchSuccess?: (name: string) => string;
    midTurnInserted?: (message: string) => string;
    modelStreamInterrupted?: string;
}
interface TranscriptMessageOptions {
    labels?: TranscriptMessageLabels;
}
export declare function transcriptBlocksToDaemonMessages(blocks: readonly DaemonTranscriptBlock[], options?: TranscriptMessageOptions): DaemonMessage[];
export {};
