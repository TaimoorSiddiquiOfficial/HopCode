import * as React from 'react';
export interface ZoomControlsProps {
    scale: number;
    minScale: number;
    maxScale: number;
    zoomPresets: readonly number[];
    onZoomIn: () => void;
    onZoomOut: () => void;
    onZoomToPreset: (preset: number) => void;
    onZoomToFit: () => void;
    onReset: () => void;
    resetDisabled: boolean;
    className?: string;
}
export declare function ZoomControls({ scale, minScale, maxScale, zoomPresets, onZoomIn, onZoomOut, onZoomToPreset, onZoomToFit, onReset, resetDisabled, className, }: ZoomControlsProps): React.JSX.Element;
