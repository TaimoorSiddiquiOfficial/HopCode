import type { AnnotationV1 } from '@craft-agent/core';
export interface ResolvedTextAnnotation {
    annotation: AnnotationV1;
    range: {
        start: number;
        end: number;
    };
    method: 'text-position' | 'text-quote';
}
export interface UnresolvedTextAnnotation {
    annotation: AnnotationV1;
    reason: 'missing-selectors' | 'invalid-position' | 'quote-not-found';
}
export interface ResolveTextAnnotationResult {
    resolved: ResolvedTextAnnotation[];
    unresolved: UnresolvedTextAnnotation[];
}
export declare function resolveTextAnnotations(fullText: string, annotations: AnnotationV1[] | undefined): ResolveTextAnnotationResult;
