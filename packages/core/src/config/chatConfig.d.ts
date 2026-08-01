/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type { ChatCompressionSettings } from './config.js';
import type { ClearContextOnIdleSettings } from './config.js';
export interface ChatConfigParams {
    maxSessionTurns?: number;
    clearContextOnIdle?: ClearContextOnIdleSettings;
    sessionTokenLimit?: number;
    embeddingModel?: string;
    chatCompression?: ChatCompressionSettings;
    interactive?: boolean;
}
/**
 * Chat behavior configuration extracted from the monolithic Config class.
 * Owns session limits, context window settings, compression, and
 * interactive-mode flags.
 *
 * This delegate is stateless — all inputs are provided at construction time.
 */
export declare class ChatConfig {
    private readonly maxSessionTurns;
    private readonly clearContextOnIdle;
    private readonly sessionTokenLimit;
    private readonly embeddingModel;
    private readonly chatCompression;
    private readonly interactive;
    constructor(params: ChatConfigParams);
    getMaxSessionTurns(): number;
    getClearContextOnIdle(): ClearContextOnIdleSettings;
    getSessionTokenLimit(): number;
    getEmbeddingModel(): string;
    getChatCompression(): ChatCompressionSettings | undefined;
    isInteractive(): boolean;
}
