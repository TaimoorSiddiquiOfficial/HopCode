/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type { ChatRecord } from '@hoptrendy/hopcode-core';
import type { ExportConfig, ExportSessionData } from './types.js';
/**
 * Collects session data from ChatRecord[] using HistoryReplayer.
 * Returns the raw ExportSessionData (SSOT) without normalization.
 */
export declare function collectSessionData(conversation: {
    sessionId: string;
    startTime: string;
    messages: ChatRecord[];
}, config: ExportConfig): Promise<ExportSessionData>;
