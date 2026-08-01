/**
 * ImagePreviewOverlay - In-app image preview for the link interceptor and markdown blocks.
 */
import * as React from 'react';
interface PreviewItem {
    src: string;
    label?: string;
}
export interface ImagePreviewOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    filePath: string;
    items?: PreviewItem[];
    initialIndex?: number;
    title?: string;
    loadDataUrl: (path: string) => Promise<string>;
    theme?: 'light' | 'dark';
    /** Render inline inside a docked side panel instead of taking over the viewport */
    embedded?: boolean;
}
export declare function ImagePreviewOverlay({ isOpen, onClose, filePath, items, initialIndex, title, loadDataUrl, theme, embedded, }: ImagePreviewOverlayProps): React.JSX.Element;
export {};
