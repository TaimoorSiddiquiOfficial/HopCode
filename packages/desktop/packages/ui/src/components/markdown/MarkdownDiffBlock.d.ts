/**
 * MarkdownDiffBlock - Renders diff code blocks using @pierre/diffs
 *
 * When the markdown viewer encounters a ```diff code block, this component
 * renders it with the same pierre/diffs setup (PatchDiff) and styling used
 * in the full-screen diff overlay (ShikiDiffViewer), instead of plain
 * Shiki syntax highlighting.
 *
 * Handles common diff code block formats:
 * 1. Proper unified diffs (with --- / +++ / @@ headers) — passed directly
 * 2. Numbered hunks without file headers — synthetic file headers are prepended
 * 3. Bare diff content or bare @@ markers — synthetic headers are prepended
 *
 * Falls back to the regular CodeBlock if PatchDiff rendering fails.
 */
import * as React from 'react';
export interface MarkdownDiffBlockProps {
    /** Raw diff text from the markdown code block */
    code: string;
    className?: string;
}
export declare function MarkdownDiffBlock({ code, className }: MarkdownDiffBlockProps): React.JSX.Element;
