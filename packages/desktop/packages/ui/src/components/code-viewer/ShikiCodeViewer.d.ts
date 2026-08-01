/**
 * ShikiCodeViewer - Read-only code viewer using Shiki syntax highlighting
 *
 * Platform-agnostic component for displaying code with:
 * - Line numbers
 * - Syntax highlighting via Shiki
 * - Light/dark theme support
 * - Scrollable with custom scrollbar styling
 */
import * as React from 'react';
export interface ShikiCodeViewerProps {
    /** The code content to display */
    code: string;
    /** Language for syntax highlighting (auto-detected from filePath if not provided) */
    language?: string;
    /** File path - used for language detection if language not specified */
    filePath?: string;
    /** Starting line number (default: 1) */
    startLine?: number;
    /** Theme mode */
    theme?: 'light' | 'dark';
    /** Shiki theme name (e.g., 'github-dark', 'dracula'). Defaults to github-dark/github-light based on theme mode */
    shikiTheme?: string;
    /** Callback when ready */
    onReady?: () => void;
    /** Additional class names */
    className?: string;
}
/**
 * ShikiCodeViewer - Syntax highlighted code viewer with line numbers
 */
export declare function ShikiCodeViewer({ code, language, filePath, startLine, theme, shikiTheme, onReady, className, }: ShikiCodeViewerProps): React.JSX.Element;
