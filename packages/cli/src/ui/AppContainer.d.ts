/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { type Dispatch, type SetStateAction } from 'react';
import { type UIState } from './contexts/UIStateContext.js';
import { ToolCallStatus } from './types.js';
import { StreamingState } from './types.js';
import { type Config } from '@hoptrendy/hopcode-core';
import { type LoadedSettings } from '../config/settings.js';
import { type InitializationResult } from '../core/initializer.js';
import { ExtensionRefreshState } from '../config/extension-refresh-state.js';
import { type Key } from './hooks/useKeypress.js';
import { type RenderMode } from './contexts/RenderModeContext.js';
export declare function isRenderModeToggleKey(key: Key): boolean;
export declare function getNextRenderMode(current: RenderMode): RenderMode;
export declare function handleRenderModeToggleKey(key: Key, setRenderMode: Dispatch<SetStateAction<RenderMode>>): boolean;
export declare function isInputActiveForState({ initError, isProcessing, hasPendingCompression, streamingState, }: {
    initError: unknown;
    isProcessing: boolean;
    hasPendingCompression: boolean;
    streamingState: StreamingState;
}): boolean;
export declare function shouldDrainMessageQueue({ isConfigInitialized, streamingState, isProcessing, dialogsVisible, messageQueueLength, }: {
    isConfigInitialized: boolean;
    streamingState: StreamingState;
    isProcessing: boolean;
    dialogsVisible: boolean;
    messageQueueLength: number;
}): boolean;
export declare function getSpeculativeToolResult(response: unknown): {
    text: string;
    status: ToolCallStatus;
};
export declare function dedupeNewestFirst(messages: readonly string[]): string[];
export declare function mergeStartupWarnings(currentWarnings: readonly string[], nextWarnings: readonly string[]): string[];
/**
 * Whether the skill-review dialog should auto-open. Exported for tests.
 *
 * Auto-open requires an undismissed pending batch while the app is idle, the
 * auto-skill feature enabled (live flag — the dialog's turn-off must keep the
 * batch from re-popping, while re-enabling from /memory lets it resurface),
 * and /memory itself closed (the review dialog must not pop over the dialog
 * where the flag is being toggled).
 */
export declare function shouldAutoOpenSkillReview(args: {
    pending: UIState['skillReviewPending'];
    streamingState: StreamingState;
    isMemoryDialogOpen: boolean;
    autoSkillEnabled: boolean;
    dismissedTaskIds: ReadonlySet<string>;
}): boolean;
interface AppContainerProps {
    config: Config;
    settings: LoadedSettings;
    startupWarnings?: string[];
    version: string;
    initializationResult: InitializationResult;
    extensionRefreshState?: ExtensionRefreshState;
}
export declare const AppContainer: (props: AppContainerProps) => import("react").JSX.Element;
export {};
