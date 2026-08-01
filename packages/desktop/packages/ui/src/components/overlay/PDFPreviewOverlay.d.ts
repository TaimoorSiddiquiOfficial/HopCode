/**
 * PDFPreviewOverlay - In-app PDF preview using Mozilla's pdf.js via react-pdf.
 *
 * Renders PDFs using the react-pdf library, which wraps pdfjs-dist.
 * Supports multiple items with arrow navigation in the header.
 *
 * The PDF is loaded from a Uint8Array (via IPC) and rendered to canvas.
 * The pdf.js worker handles decoding and rendering in a background thread.
 */
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
interface PreviewItem {
    src: string;
    label?: string;
}
export interface PDFPreviewOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    /** Absolute file path for the PDF (single item / backward compat) */
    filePath: string;
    /** Multiple items for arrow navigation */
    items?: PreviewItem[];
    /** Initial active item index (defaults to 0) */
    initialIndex?: number;
    /** Async loader that returns PDF data as Uint8Array */
    loadPdfData: (path: string) => Promise<Uint8Array>;
    theme?: 'light' | 'dark';
    /** Render inline inside a docked side panel instead of taking over the viewport */
    embedded?: boolean;
}
export declare function PDFPreviewOverlay({ isOpen, onClose, filePath, items, initialIndex, loadPdfData, theme, embedded, }: PDFPreviewOverlayProps): import("react").JSX.Element;
export {};
