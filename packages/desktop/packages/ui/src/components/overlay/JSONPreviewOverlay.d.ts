/**
 * JSONPreviewOverlay - Interactive JSON tree viewer overlay
 *
 * Uses @uiw/react-json-view for expand/collapse tree navigation.
 * Wraps PreviewOverlay for consistent presentation with other overlays.
 */
import * as React from 'react';
export interface JSONPreviewOverlayProps {
    /** Whether the overlay is visible */
    isOpen: boolean;
    /** Callback when the overlay should close */
    onClose: () => void;
    /** Parsed JSON data to display */
    data: unknown;
    /** File path — shows dual-trigger menu badge with "Open" + "Reveal in {file manager}" */
    filePath?: string;
    /** Title to display in header (fallback when no filePath) */
    title?: string;
    /** Theme mode */
    theme?: 'light' | 'dark';
    /** Optional error message */
    error?: string;
    /** Render inline without dialog (for playground) */
    embedded?: boolean;
}
export declare function JSONPreviewOverlay({ isOpen, onClose, data, filePath, title, theme, error, embedded, }: JSONPreviewOverlayProps): React.JSX.Element;
