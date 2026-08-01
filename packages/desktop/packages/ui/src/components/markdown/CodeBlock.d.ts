import * as React from 'react';
export interface CodeBlockProps {
    code: string;
    language?: string;
    className?: string;
    /**
     * Render mode affects code block styling:
     * - 'terminal': Minimal, keeps control chars visible
     * - 'minimal': Clean code, basic styling
     * - 'full': Rich styling with background, copy button, etc.
     */
    mode?: 'terminal' | 'minimal' | 'full';
    /**
     * Force a specific theme. If not provided, detects from document.documentElement.classList
     */
    forcedTheme?: 'light' | 'dark';
}
/**
 * CodeBlock - Syntax highlighted code block using Shiki
 *
 * Uses VS Code's syntax highlighting engine for accurate highlighting.
 * Lazy-loads highlighting and caches results for performance.
 */
export declare function CodeBlock({ code, language, className, mode, forcedTheme }: CodeBlockProps): React.JSX.Element;
/**
 * InlineCode - Styled inline code span
 * Features: subtle background (3%), no border, 75% opacity text
 */
export declare function InlineCode({ children, className }: {
    children: React.ReactNode;
    className?: string;
}): React.JSX.Element;
