import type { TextAnnotationSelection } from './annotation-core';
export type AnnotationIslandView = 'compact' | 'confirm-follow-up';
export type AnnotationIslandMode = 'edit' | 'view';
export type AnchoredSelection = TextAnnotationSelection & {
    anchorX: number;
    anchorY: number;
};
export type ActiveAnnotationDetail = {
    annotationId: string;
    index: number;
    anchorX: number;
    anchorY: number;
};
export type AnnotationInteractionState = {
    pendingSelection: AnchoredSelection | null;
    activeAnnotationDetail: ActiveAnnotationDetail | null;
    selectionMenuView: AnnotationIslandView;
    followUpMode: AnnotationIslandMode;
    followUpDraft: string;
    selectionMenuAnchor: {
        x: number;
        y: number;
    } | null;
};
export declare const initialAnnotationInteractionState: AnnotationInteractionState;
type AnnotationInteractionAction = {
    type: 'SET_DRAFT';
    draft: string;
} | {
    type: 'OPEN_FROM_SELECTION';
    selection: AnchoredSelection;
} | {
    type: 'OPEN_FOLLOW_UP_FROM_SELECTION';
} | {
    type: 'OPEN_FROM_ANNOTATION';
    detail: ActiveAnnotationDetail;
    noteText: string;
    mode: AnnotationIslandMode;
} | {
    type: 'REQUEST_EDIT';
} | {
    type: 'CANCEL_FOLLOW_UP';
} | {
    type: 'SUBMIT_SUCCESS';
} | {
    type: 'DELETE_SUCCESS';
} | {
    type: 'CLOSE_ALL';
};
export declare function annotationInteractionReducer(state: AnnotationInteractionState, action: AnnotationInteractionAction): AnnotationInteractionState;
export declare const annotationInteractionActions: {
    setDraft: (draft: string) => AnnotationInteractionAction;
    openFromSelection: (selection: AnchoredSelection) => AnnotationInteractionAction;
    openFollowUpFromSelection: () => AnnotationInteractionAction;
    openFromAnnotation: (detail: ActiveAnnotationDetail, noteText: string, mode: AnnotationIslandMode) => AnnotationInteractionAction;
    requestEdit: () => AnnotationInteractionAction;
    cancelFollowUp: () => AnnotationInteractionAction;
    submitSuccess: () => AnnotationInteractionAction;
    deleteSuccess: () => AnnotationInteractionAction;
    closeAll: () => AnnotationInteractionAction;
};
export {};
