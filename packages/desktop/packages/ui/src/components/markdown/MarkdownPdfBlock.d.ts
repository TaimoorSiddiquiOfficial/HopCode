/**
 * MarkdownPdfBlock - Renders ```pdf-preview code blocks as inline PDF previews.
 *
 * Loads PDF(s) from file(s) (via `src` or `items` field) and renders the first page
 * using react-pdf. Supports multiple items with a tab bar for switching between them.
 *
 * Expected JSON shapes:
 * Single item:
 * {
 *   "src": "/absolute/path/to/file.pdf",
 *   "title": "Optional title"
 * }
 *
 * Multiple items:
 * {
 *   "title": "Quarterly Reports",
 *   "items": [
 *     { "src": "/path/to/q1.pdf", "label": "Q1 Report" },
 *     { "src": "/path/to/q2.pdf", "label": "Q2 Report" }
 *   ]
 * }
 *
 * Only one Document is mounted at a time. The content area uses a fixed height
 * container to prevent layout shift when switching between items.
 *
 * Inline: Shows first page in a fixed 400px container with bottom fade + expand button.
 * Fullscreen: Opens PDFPreviewOverlay with full page-by-page navigation.
 */
import * as React from 'react';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
export interface MarkdownPdfBlockProps {
    code: string;
    className?: string;
    onCreateRegionAnnotation?: (region: {
        page?: number;
        x: number;
        y: number;
        w: number;
        h: number;
        unit: 'pixel' | 'percent';
    }) => void;
}
export declare function MarkdownPdfBlock({ code, className, onCreateRegionAnnotation: _onCreateRegionAnnotation }: MarkdownPdfBlockProps): React.JSX.Element;
