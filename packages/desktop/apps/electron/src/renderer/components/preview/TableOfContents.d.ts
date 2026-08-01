import * as React from 'react';
interface TableOfContentsProps {
    content: string;
    cursorLine: number;
    onHeadingClick: (line: number) => void;
    className?: string;
}
/**
 * TableOfContents - TOC with cursor-based highlighting
 *
 * Features:
 * - Extracts headings from markdown content with line numbers
 * - Highlights heading based on cursor position
 * - Click heading to scroll editor to that line
 */
export declare function TableOfContents({ content, cursorLine, onHeadingClick, className, }: TableOfContentsProps): React.JSX.Element;
export {};
