import type { AnnotationV1 } from '@craft-agent/core';
import { resolveTextAnnotations } from '../markdown/annotation-resolver';
import { type AnnotationOverlayRect } from './annotation-core';
export type AnnotationOverlayChip = {
    id: string;
    index: number;
    left: number;
    top: number;
    pendingFollowUp?: boolean;
    sentFollowUp?: boolean;
};
export interface ComputeAnnotationOverlayGeometryOptions {
    root: HTMLElement;
    renderedAnnotations: AnnotationV1[];
    persistedAnnotations?: AnnotationV1[];
    /** Override per-message indices with session-level indices (e.g. for pending follow-ups) */
    annotationIndexOverrides?: Map<string, number>;
}
export declare function computeAnnotationOverlayGeometry({ root, renderedAnnotations, persistedAnnotations, annotationIndexOverrides, }: ComputeAnnotationOverlayGeometryOptions): {
    rects: AnnotationOverlayRect[];
    chips: AnnotationOverlayChip[];
    unresolved: ReturnType<typeof resolveTextAnnotations>['unresolved'];
};
