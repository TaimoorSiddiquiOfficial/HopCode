/**
 * HTMLPreviewOverlay - Fullscreen overlay for viewing rendered HTML content.
 *
 * Uses PreviewOverlay as the base for consistent modal/fullscreen behavior.
 * Renders HTML in a sandboxed iframe (no script execution).
 * Links open in the system browser via Electron's will-navigate handler.
 *
 * Supports multiple items with arrow navigation in the header.
 * The iframe auto-sizes to its content height by reading contentDocument.scrollHeight
 * on load (possible because allow-same-origin is set).
 */
import * as React from 'react';
interface PreviewItem {
    src: string;
    label?: string;
}
export interface HTMLPreviewOverlayProps {
    /** Whether the overlay is visible */
    isOpen: boolean;
    /** Callback when the overlay should close */
    onClose: () => void;
    /** Single HTML content (backward compat for link interceptor usage) */
    html?: string;
    /** Multiple items for tabbed navigation */
    items?: PreviewItem[];
    /** Pre-loaded content cache (src → html string) */
    contentCache?: Record<string, string>;
    /** Callback to load content for uncached items */
    onLoadContent?: (src: string) => Promise<string>;
    /** Initial active item index (defaults to 0) */
    initialIndex?: number;
    /** Optional title for the overlay header */
    title?: string;
    /** Theme mode for dark/light styling */
    theme?: 'light' | 'dark';
}
export declare function HTMLPreviewOverlay({ isOpen, onClose, html, items, contentCache: externalCache, onLoadContent, initialIndex, title, theme, }: HTMLPreviewOverlayProps): React.JSX.Element;
export {};
