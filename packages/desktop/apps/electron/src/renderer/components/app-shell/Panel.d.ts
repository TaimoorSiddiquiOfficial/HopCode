/**
 * Panel - Base container component for app panels
 *
 * Provides consistent styling for panel containers including:
 * - Background color (theme-aware)
 * - Overflow handling
 *
 * Note: Corner radius and shadow are handled by parent containers (AppShell)
 * to avoid visual artifacts from nested rounded corners.
 *
 * Usage:
 * ```tsx
 * <Panel variant="grow">
 *   <PanelHeader title="Title" subtitle="Subtitle" />
 *   <Separator />
 *   {content}
 * </Panel>
 * ```
 */
import * as React from 'react';
export interface PanelProps {
    /** Panel sizing behavior */
    variant?: 'shrink' | 'grow';
    /** Fixed width in pixels (only for shrink variant) */
    width?: number;
    /** Optional className for additional styling */
    className?: string;
    /** Optional inline styles */
    style?: React.CSSProperties;
    /** Panel content */
    children: React.ReactNode;
}
/**
 * Base panel container with consistent styling
 */
export declare function Panel({ variant, width, className, style, children, }: PanelProps): React.JSX.Element;
