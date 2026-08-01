/**
 * PreviewHeader - Unified header component for preview windows and overlays
 *
 * Works in two contexts:
 * - Electron windows: Traffic lights on left (handled by OS), badges centered
 * - Viewer overlays: Badges centered, close button on right
 *
 * Use `onClose` prop to show the close button on the right.
 */
import * as React from 'react';
import { type LucideIcon } from 'lucide-react';
/**
 * Badge variants using semantic colors
 */
export declare const PREVIEW_BADGE_VARIANTS: {
    readonly edit: "text-foreground/70";
    readonly write: "text-foreground/70";
    readonly read: "text-foreground/70";
    readonly bash: "text-foreground/70";
    readonly grep: "text-foreground/70";
    readonly glob: "text-foreground/70";
    readonly blue: "text-foreground/70";
    readonly amber: "text-foreground/70";
    readonly orange: "text-foreground/70";
    readonly green: "text-foreground/70";
    readonly purple: "text-foreground/70";
    readonly gray: "text-foreground/70";
    readonly default: "text-foreground/70";
};
export type PreviewBadgeVariant = keyof typeof PREVIEW_BADGE_VARIANTS;
export interface PreviewHeaderBadgeProps {
    /** Icon component to display */
    icon?: LucideIcon;
    /** Badge label text */
    label: string;
    /** Badge variant (default: 'default') */
    variant?: PreviewBadgeVariant;
    /** Click handler (makes it a clickable link-style button) */
    onClick?: () => void;
    /** Title for tooltip */
    title?: string;
    /** Additional className */
    className?: string;
    /** Allow badge to shrink (for long paths) - default: false */
    shrinkable?: boolean;
}
/**
 * PreviewHeaderBadge - Badge component for preview headers
 *
 * Style specs:
 * - Height: 26px
 * - Padding: 10px horizontal
 * - Border radius: 6px
 * - Font: Sans-serif, 13px, medium weight
 * - Truncation: CSS truncate, shrink, stay 1 line
 * - Clickable: underline on hover, pointer cursor
 */
export declare function PreviewHeaderBadge({ icon: Icon, label, variant, onClick, title, className, shrinkable, }: PreviewHeaderBadgeProps): React.JSX.Element;
export interface PreviewHeaderProps {
    /** Badge elements to render in center */
    children?: React.ReactNode;
    /** Close handler - when provided, shows X button on right */
    onClose?: () => void;
    /** Actions to render on the right, just before the close button */
    rightActions?: React.ReactNode;
    /** Height of the header (default: 50px for windows, 44px for overlays) */
    height?: number;
    /** Additional className for the header */
    className?: string;
    /** Inline styles */
    style?: React.CSSProperties;
}
/**
 * PreviewHeader - Header/toolbar for preview windows and overlays
 *
 * Layout:
 * - Left: 70px spacer (for macOS traffic lights in Electron)
 * - Center: Badges row
 * - Right: Close button (if onClose provided) or 70px spacer
 */
export declare function PreviewHeader({ children, onClose, rightActions, height, className, style, }: PreviewHeaderProps): React.JSX.Element;
