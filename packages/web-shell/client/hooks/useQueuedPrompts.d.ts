/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { type DaemonSessionActions, type DaemonStreamingState } from '@hoptrendy/webui/daemon-react-sdk';
import type { DaemonInputAnnotation, DaemonTranscriptStore } from '@hoptrendy/sdk/daemon';
import type { PromptImage } from '../adapters/promptTypes';
import type { EditorHandle } from './useComposerCore';
import type { getTranslator } from '../i18n';
import type { QueuedPrompt } from '../components/QueuedPromptDisplay';
interface RefBox<T> {
    current: T;
}
interface UseQueuedPromptsArgs {
    connected: boolean;
    sessionId?: string;
    clientId?: string;
    streamingState: DaemonStreamingState;
    sessionActions: DaemonSessionActions;
    store: DaemonTranscriptStore;
    editorRef: RefBox<EditorHandle | null>;
    reportError: (error: unknown, fallback: string) => void;
    notifySuccess: (message: string) => void;
    t: ReturnType<typeof getTranslator>;
}
/**
 * Merge a restored prompt's text into the editor content. Restoration paths
 * (failed submits, failed mid-turn inserts, queue clears) prepend the prompt
 * above whatever the user is currently typing — but several of them can fire
 * for the same prompt across reconnects/refreshes, and a user retrying an
 * identical message produces the same text twice. Stacking those copies is
 * what #7128 reports as "inputs concatenated after refresh", so restoring
 * text that is already present at the top of the editor is a no-op.
 */
export declare function mergeRestoredPromptText(current: string, text: string): string;
export interface UseQueuedPromptsResult {
    queuedPrompts: QueuedPrompt[];
    queuedTexts: string[];
    enqueuePrompt: (text: string, images?: PromptImage[], onComplete?: () => void, inputAnnotations?: DaemonInputAnnotation[]) => boolean;
    removeQueuedPrompt: (id: number) => void;
    insertQueuedPrompt: (id: number) => Promise<void>;
    editQueuedPrompt: (id: number) => Promise<void>;
    editLastQueuedPrompt: () => boolean;
    clearQueuedPrompts: () => boolean;
}
export declare function useQueuedPrompts({ connected, sessionId, clientId, streamingState, sessionActions, store, editorRef, reportError, notifySuccess, t, }: UseQueuedPromptsArgs): UseQueuedPromptsResult;
export {};
