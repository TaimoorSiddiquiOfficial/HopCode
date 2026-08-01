/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Chat behavior configuration extracted from the monolithic Config class.
 * Owns session limits, context window settings, compression, and
 * interactive-mode flags.
 *
 * This delegate is stateless — all inputs are provided at construction time.
 */
export class ChatConfig {
    maxSessionTurns;
    clearContextOnIdle;
    sessionTokenLimit;
    embeddingModel;
    chatCompression;
    interactive;
    constructor(params) {
        this.maxSessionTurns = params.maxSessionTurns ?? -1;
        this.clearContextOnIdle = params.clearContextOnIdle ?? {};
        this.sessionTokenLimit = params.sessionTokenLimit ?? -1;
        this.embeddingModel = params.embeddingModel ?? '';
        this.chatCompression = params.chatCompression;
        this.interactive = params.interactive ?? false;
    }
    getMaxSessionTurns() {
        return this.maxSessionTurns;
    }
    getClearContextOnIdle() {
        return this.clearContextOnIdle;
    }
    getSessionTokenLimit() {
        return this.sessionTokenLimit;
    }
    getEmbeddingModel() {
        return this.embeddingModel;
    }
    getChatCompression() {
        return this.chatCompression;
    }
    isInteractive() {
        return this.interactive;
    }
}
//# sourceMappingURL=chatConfig.js.map