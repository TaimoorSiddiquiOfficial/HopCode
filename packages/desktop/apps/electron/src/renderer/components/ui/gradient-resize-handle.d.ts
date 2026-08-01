import * as React from "react";
interface GradientResizeHandleProps {
    className?: string;
    /** Height at which to place horizontal connector line (matches header separator) */
    headerHeight?: number;
}
/**
 * GradientResizeHandle - A resize handle with a gradient indicator that follows the cursor
 *
 * Features:
 * - 12px touch area (±6px from center) for easy grabbing
 * - 1px static separator line (always visible, connects panels)
 * - Gradient overlay that follows cursor on hover (fades in/out over 150ms)
 * - Horizontal connector line at header height to join panel separators
 *
 * Drop-in replacement for ResizableHandle from shadcn/ui
 */
export declare function GradientResizeHandle({ className, headerHeight }: GradientResizeHandleProps): React.JSX.Element;
export {};
