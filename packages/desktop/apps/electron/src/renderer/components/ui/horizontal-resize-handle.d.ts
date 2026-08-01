import * as React from "react";
interface HorizontalResizeHandleProps {
    /** Called during drag with the delta Y (positive = moving down) */
    onResize: (deltaY: number) => void;
    /** Called when drag ends */
    onResizeEnd?: () => void;
    className?: string;
}
/**
 * HorizontalResizeHandle - A horizontal resize handle with gradient indicator
 *
 * Used for splitting panels vertically (top/bottom). The handle is a horizontal
 * bar that can be dragged up/down to resize the panels.
 *
 * Features:
 * - 12px touch area (±6px from center) for easy grabbing
 * - 1px static separator line (always visible)
 * - Gradient overlay that follows cursor on hover (fades in/out over 150ms)
 * - cursor-row-resize for vertical splitting
 */
export declare function HorizontalResizeHandle({ onResize, onResizeEnd, className }: HorizontalResizeHandleProps): React.JSX.Element;
export {};
