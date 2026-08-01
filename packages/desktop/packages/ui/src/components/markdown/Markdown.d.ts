import * as React from 'react';
import 'katex/dist/katex.min.css';
/**
 * Render modes for markdown content:
 *
 * - 'terminal': Raw output with minimal formatting, control chars visible
 *   Best for: Debug output, raw logs, when you want to see exactly what's there
 *
 * - 'minimal': Clean rendering with syntax highlighting but no extra chrome
 *   Best for: Chat messages, inline content, when you want readability without clutter
 *
 * - 'full': Rich rendering with beautiful tables, styled code blocks, proper typography
 *   Best for: Documentation, long-form content, when presentation matters
 */
export type RenderMode = 'terminal' | 'minimal' | 'full';
export interface MarkdownProps {
    children: string;
    /**
     * Render mode controlling formatting level
     * @default 'minimal'
     */
    mode?: RenderMode;
    className?: string;
    /**
     * Message ID for memoization (optional)
     * When provided, memoizes parsed blocks to avoid re-parsing during streaming
     */
    id?: string;
    /**
     * Callback when a URL is clicked
     */
    onUrlClick?: (url: string) => void;
    /**
     * Callback when a file path is clicked
     */
    onFileClick?: (path: string) => void;
    /**
     * Enable collapsible headings
     * Requires wrapping in CollapsibleMarkdownProvider
     * @default false
     */
    collapsible?: boolean;
    /**
     * Hide expand button on first mermaid block (when message starts with mermaid)
     * Used in chat to avoid overlap with TurnCard's fullscreen button
     * @default true
     */
    hideFirstMermaidExpand?: boolean;
}
/**
 * Markdown - Customizable markdown renderer with multiple render modes
 *
 * Features:
 * - Three render modes: terminal, minimal, full
 * - Syntax highlighting via Shiki
 * - GFM support (tables, task lists, strikethrough)
 * - Clickable links and file paths
 * - Memoization for streaming performance
 */
export declare function Markdown({ children, mode, className, id, onUrlClick, onFileClick, collapsible, hideFirstMermaidExpand, }: MarkdownProps): React.JSX.Element;
/**
 * MemoizedMarkdown - Optimized for streaming scenarios
 *
 * Splits content into blocks and memoizes each block separately,
 * so only new/changed blocks re-render during streaming.
 */
export declare const MemoizedMarkdown: React.MemoExoticComponent<typeof Markdown>;
export { CodeBlock, InlineCode } from './CodeBlock';
export { CollapsibleMarkdownProvider } from './CollapsibleMarkdownContext';
