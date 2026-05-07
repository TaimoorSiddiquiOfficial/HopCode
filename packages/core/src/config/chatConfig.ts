/**
 * @license
 * Copyright 2025 Google LLC
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
export class ChatConfig {
  private readonly maxSessionTurns: number;
  private readonly clearContextOnIdle: ClearContextOnIdleSettings;
  private readonly sessionTokenLimit: number;
  private readonly embeddingModel: string;
  private readonly chatCompression: ChatCompressionSettings | undefined;
  private readonly interactive: boolean;

  constructor(params: ChatConfigParams) {
    this.maxSessionTurns = params.maxSessionTurns ?? -1;
    this.clearContextOnIdle = params.clearContextOnIdle ?? {};
    this.sessionTokenLimit = params.sessionTokenLimit ?? -1;
    this.embeddingModel = params.embeddingModel ?? '';
    this.chatCompression = params.chatCompression;
    this.interactive = params.interactive ?? false;
  }

  getMaxSessionTurns(): number {
    return this.maxSessionTurns;
  }

  getClearContextOnIdle(): ClearContextOnIdleSettings {
    return this.clearContextOnIdle;
  }

  getSessionTokenLimit(): number {
    return this.sessionTokenLimit;
  }

  getEmbeddingModel(): string {
    return this.embeddingModel;
  }

  getChatCompression(): ChatCompressionSettings | undefined {
    return this.chatCompression;
  }

  isInteractive(): boolean {
    return this.interactive;
  }
}
