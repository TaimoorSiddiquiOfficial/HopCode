import * as React from 'react';
import { type RenderMode } from '@craft-agent/ui';
interface StreamingMarkdownProps {
    content: string;
    isStreaming: boolean;
    mode?: RenderMode;
    onUrlClick?: (url: string) => void;
    onFileClick?: (path: string) => void;
}
/**
 * StreamingMarkdown - Optimized markdown renderer for streaming content
 *
 * Splits content into blocks (paragraphs, code blocks) and memoizes each block
 * independently. Only the last (active) block re-renders during streaming.
 *
 * Key insight: Completed blocks get a content-hash as their React key.
 * Same content = same key = React skips re-render entirely.
 *
 * @example
 * Content: "Hello\n\n```js\ncode\n```\n\nMore..."
 *
 * Block 1: "Hello"           → key="block-abc123" → memoized ✓
 * Block 2: "```js\ncode\n```" → key="block-xyz789" → memoized ✓
 * Block 3: "More..."         → key="active-2"     → re-renders
 */
export declare function StreamingMarkdown({ content, isStreaming, mode, onUrlClick, onFileClick, }: StreamingMarkdownProps): React.JSX.Element;
export {};
