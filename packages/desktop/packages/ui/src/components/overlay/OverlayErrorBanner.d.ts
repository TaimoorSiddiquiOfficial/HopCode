/**
 * OverlayErrorBanner - Shared error banner for preview overlays
 *
 * Styled to match the TurnCard tinted-shadow pattern:
 * - 5% destructive color-mixed background
 * - shadow-tinted with --shadow-color: var(--destructive-rgb)
 * - Center-aligned, max-width matching ContentFrame card (850px)
 *
 * Rendered ABOVE the content container in each overlay.
 */
import type React from 'react';
export interface OverlayErrorBannerProps {
    /** Short label describing the error type (e.g. "Write Failed", "Read Failed") */
    label: string;
    /** Full error message */
    message: string;
}
export declare function OverlayErrorBanner({ label, message }: OverlayErrorBannerProps): React.JSX.Element;
