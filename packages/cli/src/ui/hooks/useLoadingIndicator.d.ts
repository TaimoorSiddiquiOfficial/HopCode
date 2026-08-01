/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { StreamingState } from '../types.js';
export declare const useLoadingIndicator: (streamingState: StreamingState, customWittyPhrases?: string[], currentCandidatesTokens?: number, currentStreamingChars?: number, isToolExecuting?: boolean) => {
    elapsedTime: number;
    currentLoadingPhrase: string;
    taskStartTokens: number;
    taskStartStreamingChars: number;
};
