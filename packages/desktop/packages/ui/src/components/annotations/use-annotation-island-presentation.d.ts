import * as React from 'react';
export interface UseAnnotationIslandPresentationOptions {
    anchor: {
        x: number;
        y: number;
    } | null;
    sourceKey: string;
    closeGraceMs?: number;
}
export interface AnnotationIslandPresentationState {
    renderAnchor: {
        x: number;
        y: number;
    } | null;
    renderSourceKey: string;
    isVisible: boolean;
    openedAtRef: React.MutableRefObject<number>;
    handleExitComplete: () => void;
    resetPresentation: () => void;
}
export type AnnotationIslandPresentationDecision = {
    kind: 'open';
} | {
    kind: 'close-now';
} | {
    kind: 'defer-close';
    afterMs: number;
};
export interface DecidePresentationInput {
    hasAnchor: boolean;
    hasRenderAnchor: boolean;
    now: number;
    openedAt: number;
    closeGraceMs: number;
}
export declare function decideAnnotationIslandPresentation(input: DecidePresentationInput): AnnotationIslandPresentationDecision;
export declare function useAnnotationIslandPresentation({ anchor, sourceKey, closeGraceMs, }: UseAnnotationIslandPresentationOptions): AnnotationIslandPresentationState;
