import type { AnnotationV1 } from '@craft-agent/core';
import { type ActiveAnnotationDetail, type AnchoredSelection, type AnnotationIslandMode } from './interaction-state-machine';
export type ExternalOpenAnnotationRequest = {
    messageId: string;
    annotationId: string;
    mode: AnnotationIslandMode;
    anchorX?: number;
    anchorY?: number;
    nonce: number;
};
export declare function useAnnotationInteractionController(): {
    state: any;
    setDraft: (draft: string) => void;
    openFromSelection: (selection: AnchoredSelection) => void;
    openFollowUpFromSelection: () => void;
    openFromAnnotation: (detail: ActiveAnnotationDetail, noteText: string, mode: AnnotationIslandMode) => void;
    requestEdit: () => void;
    cancelFollowUp: () => {
        hadPendingSelection: boolean;
        pendingSelection: any;
    };
    closeAll: () => void;
    markSubmitSuccess: () => void;
    markDeleteSuccess: () => void;
    consumeExternalOpenRequest: (request: ExternalOpenAnnotationRequest | null | undefined, params: {
        messageId?: string;
        annotations?: AnnotationV1[];
        getNoteText: (annotation: AnnotationV1) => string;
        fallbackAnchor: {
            x: number;
            y: number;
        };
    }) => boolean;
};
