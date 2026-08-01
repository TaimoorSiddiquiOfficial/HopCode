import type { AnnotationInteractionState } from './interaction-state-machine';
export declare function getAnnotationInteractionSourceKey(state: AnnotationInteractionState, messageId?: string): string;
export declare function getAnnotationInteractionAnchor(state: AnnotationInteractionState): {
    x: number;
    y: number;
} | null;
export declare function hasAnnotationInteraction(state: AnnotationInteractionState): boolean;
