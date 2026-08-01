/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type { DaemonFollowupSuggestionData } from '@hoptrendy/sdk/daemon';
export declare function getSidechannelFollowupSuggestion(): DaemonFollowupSuggestionData | undefined;
export declare function subscribeSidechannelFollowupSuggestion(listener: () => void): () => void;
export declare function publishSidechannelFollowupSuggestion(suggestion: DaemonFollowupSuggestionData): void;
export declare function clearSidechannelFollowupSuggestion(): void;
export declare function parseSidechannelFollowupSuggestion(event: unknown): DaemonFollowupSuggestionData | undefined;
