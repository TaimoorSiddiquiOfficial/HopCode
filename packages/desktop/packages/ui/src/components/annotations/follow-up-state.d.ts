import type { AnnotationV1 } from '@craft-agent/core';
export type AnnotationFollowUpState = 'none' | 'pending' | 'sent';
export declare function asRecord(value: unknown): Record<string, unknown> | null;
export declare function normalizeFollowUpText(text: string): string;
export declare function getAnnotationNoteText(annotation: AnnotationV1): string;
export declare function getAnnotationFollowUpState(annotation: AnnotationV1): AnnotationFollowUpState;
export declare function isAnnotationFollowUpSent(annotation: AnnotationV1): boolean;
export declare function formatAnnotationFollowUpTooltipText(annotation: AnnotationV1, maxLength?: number): string;
