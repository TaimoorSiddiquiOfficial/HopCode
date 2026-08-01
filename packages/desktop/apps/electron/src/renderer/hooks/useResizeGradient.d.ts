import * as React from "react";
/**
 * Creates the gradient style for the resize indicator.
 *
 * Behavior:
 * - Fade always resolves to transparent at the very top/bottom edges.
 * - Gradient center follows cursor Y, but is clamped to stay at least
 *   RESIZE_GRADIENT_EDGE_BUFFER_PX from either edge (when height allows).
 */
export declare function getResizeGradientStyle(mouseY: number | null, handleHeight: number | null): React.CSSProperties;
/**
 * useResizeGradient - Hook for resize handle gradient that follows cursor
 *
 * Returns:
 * - ref: Attach to the touch area element
 * - mouseY: Current Y position (null when not hovering)
 * - handlers: onMouseMove, onMouseLeave, onMouseDown for the touch area
 * - gradientStyle: CSS style object for the visual indicator
 */
export declare function useResizeGradient(): {
    ref: React.RefObject<HTMLDivElement | null>;
    mouseY: number | null;
    isDragging: boolean;
    handlers: {
        onMouseMove: (e: React.MouseEvent) => void;
        onMouseLeave: () => void;
        onMouseDown: () => void;
    };
    gradientStyle: React.CSSProperties;
};
