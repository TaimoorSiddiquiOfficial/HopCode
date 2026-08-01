/**
 * Info_Badge
 *
 * Colored badge with optional icon for status indicators.
 * Features rounded-lg (8px) corners and tinted shadow based on color.
 */
import * as React from 'react';
export type BadgeColor = 'success' | 'warning' | 'destructive' | 'default' | 'muted';
export interface Info_BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    /** Badge color variant */
    color?: BadgeColor;
    /** Optional icon (renders before text) */
    icon?: React.ReactNode;
    /** Badge text */
    children: React.ReactNode;
}
export declare function Info_Badge({ color, icon, children, className, style, ...props }: Info_BadgeProps): React.JSX.Element;
