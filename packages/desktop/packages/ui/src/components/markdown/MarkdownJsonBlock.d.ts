/**
 * MarkdownJsonBlock - Interactive JSON tree viewer for markdown code blocks
 *
 * When the markdown viewer encounters a ```json code block, this component
 * renders it with the same @uiw/react-json-view setup and styling used in
 * JSONPreviewOverlay, instead of static Shiki syntax highlighting.
 *
 * - Parses the raw code string as JSON
 * - Recursively expands stringified-JSON-within-JSON (deepParseJson)
 * - Uses craft themes (transparent bg, CSS variable fonts)
 * - Defaults to collapsed={2} for inline chat context
 * - Falls back to CodeBlock if JSON parsing or rendering fails
 */
import * as React from 'react';
export interface MarkdownJsonBlockProps {
    /** Raw JSON string from the markdown code block */
    code: string;
    className?: string;
}
export declare function MarkdownJsonBlock({ code, className }: MarkdownJsonBlockProps): React.JSX.Element;
