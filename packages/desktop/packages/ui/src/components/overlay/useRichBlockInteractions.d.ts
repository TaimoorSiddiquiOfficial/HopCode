import { type MouseEvent as ReactMouseEvent, type RefObject } from 'react';
import { type RichBlockInteractionOptions } from './rich-block-interaction-spec';
export declare function clampScale(value: number, min: number, max: number): number;
export declare function zoomStepScale(current: number, direction: 'in' | 'out', factor: number, min: number, max: number): number;
export declare function cursorAnchoredTranslate(translate: {
    x: number;
    y: number;
}, cursor: {
    x: number;
    y: number;
}, scaleRatio: number): {
    x: number;
    y: number;
};
export declare function computeFitScale(container: {
    width: number;
    height: number;
}, content: {
    width: number;
    height: number;
}, min: number, max: number): number;
interface UseRichBlockInteractionsOptions extends RichBlockInteractionOptions {
    containerRef: RefObject<HTMLDivElement | null>;
}
export declare function useRichBlockInteractions({ isOpen, containerRef, minScale, maxScale, zoomStepFactor, wheelSensitivity, keyboardShortcuts, }: UseRichBlockInteractionsOptions): {
    scale: number;
    translate: {
        x: number;
        y: number;
    };
    isDragging: boolean;
    isAnimating: boolean;
    setIsAnimating: import("react").Dispatch<import("react").SetStateAction<boolean>>;
    zoomByStep: (direction: "in" | "out") => void;
    zoomToPreset: (percent: number) => void;
    zoomToFit: (content: {
        width: number;
        height: number;
    } | null) => void;
    reset: () => void;
    onMouseDown: (e: ReactMouseEvent) => void;
    onDoubleClick: () => void;
};
export {};
