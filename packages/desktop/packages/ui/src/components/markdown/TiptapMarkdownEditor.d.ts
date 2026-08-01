import * as React from 'react';
import 'katex/dist/katex.min.css';
import './tiptap-editor.css';
import './extensions/animated-task-item.css';
export type MarkdownEngine = 'legacy' | 'official';
/**
 * Normalize markdown for official TipTap parser:
 * - Keep product policy: users write math with $$...$$
 * - Convert same-line $$...$$ to inline $...$ (TipTap inline math)
 * - Escape currency-like dollars ($100, $2M...) so they don't become inline math nodes
 */
export declare function preprocessMarkdownForOfficial(markdown: string): string;
/** Undo parser-safety escaping in serialized markdown. */
export declare function postprocessMarkdownFromOfficial(markdown: string): string;
export declare function isMermaidFilename(fileName: string): boolean;
export declare function extractMermaidSource(text: string): string | null;
export interface TiptapMarkdownEditorProps {
    /** Markdown string content */
    content: string;
    /** Called when content changes */
    onUpdate?: (markdown: string) => void;
    /** Placeholder text when empty */
    placeholder?: string;
    className?: string;
    /** Whether the editor is editable */
    editable?: boolean;
    /**
     * Migration flag for markdown engine foundations.
     * - `legacy`: tiptap-markdown (default for safe rollout)
     * - `official`: @tiptap/markdown + mathematics extension
     */
    markdownEngine?: MarkdownEngine;
}
export declare function TiptapMarkdownEditor({ content, onUpdate, placeholder, className, editable, markdownEngine, }: TiptapMarkdownEditorProps): React.JSX.Element;
