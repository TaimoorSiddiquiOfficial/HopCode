import type { AnnotationV1 } from '@craft-agent/core';
import { type AnnotationFollowUpState } from './follow-up-state';
export type AnnotationChipInteraction = {
    state: AnnotationFollowUpState;
    clickable: boolean;
    tooltipOnly: boolean;
    openMode: 'view';
};
/**
 * Unified annotation chip behavior:
 * - sent follow-up chips are tooltip-only (no island open on click)
 * - pending/unsent chips open annotation detail in view mode
 */
export declare function getAnnotationChipInteraction(annotation?: AnnotationV1 | null): AnnotationChipInteraction;
export declare function isAnnotationChipClickable(annotation?: AnnotationV1 | null): boolean;
export declare function getAnnotationChipOpenMode(): 'view';
/**
 * Mouse-up events that originate from annotation index badges must not trigger
 * text-selection follow-up flows. This keeps chip clicks and text selection
 * behavior consistent across inline and fullscreen renderers.
 */
export declare function shouldIgnoreSelectionMouseUpTarget(target: EventTarget | null): boolean;
