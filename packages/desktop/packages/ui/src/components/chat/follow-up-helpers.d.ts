import type { AnnotationV1 } from '@craft-agent/core';
export { type AnnotationFollowUpState, asRecord, normalizeFollowUpText, getAnnotationNoteText, getAnnotationFollowUpState, isAnnotationFollowUpSent, } from '../annotations/follow-up-state';
export declare function extractAnnotationSelectedText(annotation: AnnotationV1, messageContent: string): string;
