import type { AnnotationV1 } from '@craft-agent/core';
export declare const ANNOTATION_PREFIX_SUFFIX_WINDOW = 24;
export declare const SELECTION_POINTER_MAX_AGE_MS = 1500;
export type TextAnnotationSelection = {
    start: number;
    end: number;
    selectedText: string;
    prefix: string;
    suffix: string;
};
export declare function clamp(value: number, min: number, max: number): number;
export declare function hasExistingTextRangeAnnotation(annotations: AnnotationV1[] | undefined, start: number, end: number): boolean;
export declare function createSelectionPreviewAnnotation(messageId: string, selection: TextAnnotationSelection, sessionId?: string): AnnotationV1;
export declare function createTextSelectionAnnotation(messageId: string, selection: TextAnnotationSelection, followUpNote?: string, sessionId?: string): AnnotationV1;
export declare function collectTextSegments(root: HTMLElement): Array<{
    node: Text;
    start: number;
    end: number;
}>;
export declare function getCanonicalText(root: HTMLElement): string;
export declare function resolveNodeOffset(root: HTMLElement, targetNode: Node, nodeOffset: number): number | null;
export declare function resolveRangeFromOffsets(root: HTMLElement, start: number, end: number): Range | null;
export declare function getClientRectsForOffsets(root: HTMLElement, start: number, end: number): DOMRect[];
export type AnnotationOverlayRect = {
    id: string;
    left: number;
    top: number;
    width: number;
    height: number;
    color: string;
    pendingFollowUp?: boolean;
    sentFollowUp?: boolean;
};
export declare function consolidateRectsByLine(rects: AnnotationOverlayRect[]): AnnotationOverlayRect[];
