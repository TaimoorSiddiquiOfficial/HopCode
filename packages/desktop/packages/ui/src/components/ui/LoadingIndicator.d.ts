import * as React from "react";
export interface SpinnerProps {
    /** Additional className */
    className?: string;
}
/**
 * Spinner - 3x3 grid spinner based on SpinKit Grid
 *
 * Features:
 * - Uses currentColor (inherits text color from parent)
 * - Uses em sizing (scales with font-size)
 * - 3x3 grid of cubes with staggered scale animation
 * - Pure CSS animation (no JS state)
 *
 * Usage:
 * ```tsx
 * // Inherits color and size from parent
 * <div className="text-muted-foreground text-sm">
 *   <Spinner />
 * </div>
 *
 * // Or override with className
 * <Spinner className="text-amber-500 text-lg" />
 * ```
 */
export declare function Spinner({ className }: SpinnerProps): React.JSX.Element;
export interface LoadingIndicatorProps {
    /** Optional label to show next to spinner */
    label?: string;
    /** Whether to animate the spinner */
    animated?: boolean;
    /** Show elapsed time (pass start timestamp or true to auto-track) */
    showElapsed?: boolean | number;
    /** Additional className for the container */
    className?: string;
    /** Additional className for the spinner (e.g., "text-xs" to make it smaller) */
    spinnerClassName?: string;
}
/**
 * LoadingIndicator - Spinner with optional label and elapsed time
 *
 * Inherits text color and size from parent element.
 *
 * Features:
 * - Animated 3x3 dot grid spinner (CSS-only)
 * - Optional label text
 * - Optional elapsed time display
 */
export declare function LoadingIndicator({ label, animated, showElapsed, className, spinnerClassName, }: LoadingIndicatorProps): React.JSX.Element;
