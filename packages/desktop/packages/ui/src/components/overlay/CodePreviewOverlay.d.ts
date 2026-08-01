/**
 * CodePreviewOverlay - Overlay for code file preview (Read/Write tools)
 *
 * Uses PreviewOverlay for presentation and ShikiCodeViewer for syntax highlighting.
 * File path badge provides "Open" / "Reveal in {file manager}" via PlatformContext.
 */
import * as React from 'react';
export interface CodePreviewOverlayProps {
    /** Whether the overlay is visible */
    isOpen: boolean;
    /** Callback when the overlay should close */
    onClose: () => void;
    /** The code content to display */
    content: string;
    /** File path for language detection and display */
    filePath: string;
    /** Language for syntax highlighting (auto-detected if not provided) */
    language?: string;
    /** Mode: 'read' or 'write' */
    mode?: 'read' | 'write';
    /** Starting line number (default: 1) */
    startLine?: number;
    /** Total lines in original file (for display) */
    totalLines?: number;
    /** Number of lines shown */
    numLines?: number;
    /** Theme mode */
    theme?: 'light' | 'dark';
    /** Error message if tool failed */
    error?: string;
    /** Render inline without dialog (for playground) */
    embedded?: boolean;
    /** Original shell command (for Codex reads) - shown above code */
    command?: string;
}
export declare function CodePreviewOverlay({ isOpen, onClose, content, filePath, language, mode, startLine, totalLines, numLines, theme, error, embedded, command, }: CodePreviewOverlayProps): React.JSX.Element;
