import * as React from "react";
/**
 * Creates the gradient style for a horizontal resize indicator.
 * The gradient follows the cursor along the X-axis of the handle.
 */
export declare function getHorizontalResizeGradientStyle(mouseX: number | null): React.CSSProperties;
/**
 * useHorizontalResizeGradient - Hook for horizontal resize handle gradient that follows cursor
 *
 * Similar to useResizeGradient but tracks X position for horizontal (row) resizing.
 *
 * Returns:
 * - ref: Attach to the touch area element
 * - mouseX: Current X position (null when not hovering)
 * - isDragging: Whether currently dragging
 * - handlers: onMouseMove, onMouseLeave, onMouseDown for the touch area
 * - gradientStyle: CSS style object for the visual indicator
 */
export declare function useHorizontalResizeGradient(): {
    ref: React.RefObject<HTMLDivElement | null>;
    mouseX: number | null;
    isDragging: boolean;
    handlers: {
        onMouseMove: (e: React.MouseEvent) => void;
        onMouseLeave: () => void;
        onMouseDown: () => void;
    };
    gradientStyle: React.CSSProperties;
};
