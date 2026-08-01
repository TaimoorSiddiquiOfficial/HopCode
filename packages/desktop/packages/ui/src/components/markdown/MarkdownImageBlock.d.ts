/**
 * MarkdownImageBlock - Renders ```image-preview code blocks as inline image previews.
 *
 * Loads image(s) from file(s) (via `src` or `items` field) using data URLs.
 * Supports multiple items with a swipeable card stack preview.
 *
 * Expected JSON shapes:
 * Single item:
 * {
 *   "src": "/absolute/path/to/image.png",
 *   "title": "Optional title"
 * }
 *
 * Multiple items:
 * {
 *   "title": "Before/After",
 *   "items": [
 *     { "src": "/path/to/before.png", "label": "Before" },
 *     { "src": "/path/to/after.png", "label": "After" }
 *   ]
 * }
 */
import * as React from 'react';
export interface MarkdownImageBlockProps {
    code: string;
    className?: string;
    onCreateRegionAnnotation?: (region: {
        x: number;
        y: number;
        w: number;
        h: number;
        unit: 'pixel' | 'percent';
    }) => void;
}
export declare function MarkdownImageBlock({ code, className, onCreateRegionAnnotation: _onCreateRegionAnnotation }: MarkdownImageBlockProps): React.JSX.Element;
