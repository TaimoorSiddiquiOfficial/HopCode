/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type { PromptImage } from '../adapters/promptTypes';
import type { DaemonInputAnnotation } from '@hoptrendy/sdk/daemon';
import type { getTranslator } from '../i18n';
export interface QueuedPrompt {
    id: number;
    sessionId?: string;
    text: string;
    images?: PromptImage[];
    inputAnnotations?: DaemonInputAnnotation[];
    onComplete?: () => void;
    serverPromptId?: string;
    serverState?: 'submitting' | 'queued' | 'running';
    isEditing?: boolean;
    isRemoving?: boolean;
}
export declare function QueuedPromptDisplay({ prompts, t, onDelete, onInsert, onEdit, }: {
    prompts: readonly QueuedPrompt[];
    t: ReturnType<typeof getTranslator>;
    onDelete: (id: number) => void;
    onInsert: (id: number) => void;
    onEdit: (id: number) => void;
}): import("react").JSX.Element | null;
