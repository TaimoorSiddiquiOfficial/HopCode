/**
 * Info_Markdown
 *
 * Markdown content with consistent styling and heading detection.
 * Auto-adjusts top padding based on whether content starts with a heading.
 * Supports optional fullscreen view using the shared DocumentFormattedMarkdownOverlay component.
 */
import * as React from 'react';
export interface Info_MarkdownProps {
    /** Markdown content */
    children: string;
    /** Optional max height with scroll */
    maxHeight?: number;
    /** Markdown rendering mode */
    mode?: 'minimal' | 'full';
    className?: string;
    /** Enable fullscreen button (shows Maximize2 icon on hover) */
    fullscreen?: boolean;
}
export declare function Info_Markdown({ children, maxHeight, mode, className, fullscreen, }: Info_MarkdownProps): React.JSX.Element;
