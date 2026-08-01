/**
 * EntityListBadge — Generic configurable pill badge for use inside EntityRow badge rows.
 *
 * Two variants:
 * - "text" (default): Fixed-height text pill (h-[18px]) with padding.
 * - "icon": 18×18 centered icon box (no text padding).
 *
 * Color is caller-controlled via `colorClass` or inline `style`.
 */
import * as React from 'react';
export interface EntityListBadgeProps {
    /** Badge content (text or icon) */
    children: React.ReactNode;
    /** "text" (default) = text pill, "icon" = 18×18 centered icon box */
    variant?: 'text' | 'icon';
    /** Color classes, e.g. "bg-accent/10 text-accent" */
    colorClass?: string;
    /** Inline styles — for runtime-computed colors (e.g. label color-mix) */
    style?: React.CSSProperties;
    /** Optional tooltip text (shown on hover) */
    tooltip?: string;
    /** Additional className */
    className?: string;
}
export declare function EntityListBadge({ children, variant, colorClass, style, tooltip, className }: EntityListBadgeProps): React.JSX.Element;
