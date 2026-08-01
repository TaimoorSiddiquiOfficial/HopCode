import * as React from 'react';
import type { AnnotationV1 } from '@craft-agent/core';
import type { AnnotationOverlayRect } from './annotation-core';
import type { AnnotationOverlayChip } from './annotation-overlay-geometry';
export interface AnnotationOverlayLayerProps {
    rects: AnnotationOverlayRect[];
    chips: AnnotationOverlayChip[];
    annotations?: AnnotationV1[];
    getTooltipText?: (annotation: AnnotationV1, index: number) => string;
    /** Whether clicking a chip should open the annotation island/details view. */
    allowChipOpen?: boolean;
    onChipOpen: (params: {
        annotationId: string;
        index: number;
        anchorX: number;
        anchorY: number;
        mode: 'view';
    }) => void;
}
export declare function AnnotationOverlayLayer({ rects, chips, annotations, getTooltipText, allowChipOpen, onChipOpen, }: AnnotationOverlayLayerProps): React.JSX.Element | null;
