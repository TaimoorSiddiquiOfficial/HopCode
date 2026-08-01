import * as React from 'react';
interface MarkdownLatexBlockProps {
    code: string;
    className?: string;
}
/**
 * MarkdownLatexBlock - Renders fenced ```latex / ```math code blocks as display math.
 *
 * Uses KaTeX to render LaTeX source into styled HTML.
 * On parse errors, shows the raw source with an error message.
 */
export declare function MarkdownLatexBlock({ code, className }: MarkdownLatexBlockProps): React.JSX.Element;
export {};
