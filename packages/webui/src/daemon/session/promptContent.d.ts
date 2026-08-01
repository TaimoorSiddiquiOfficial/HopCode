/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type { PromptContentBlock } from '@hoptrendy/sdk/daemon';
import type { DaemonPromptImage } from './types.js';
export declare function toDaemonPromptContent(text: string, images?: readonly DaemonPromptImage[]): PromptContentBlock[];
