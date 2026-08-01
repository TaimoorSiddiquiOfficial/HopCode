/**
 * GenericOverlay - Fallback overlay for unknown tool content
 *
 * Uses PreviewOverlay for presentation and CodeBlock for syntax highlighting.
 * Auto-detects language from content patterns or file path.
 * Supports optional diff mode for side-by-side comparison.
 */
import * as React from 'react';
export interface GenericOverlayProps {
    /** Content to display (used when not in diff mode) */
    content: string;
    /** Language for syntax highlighting (auto-detected if not provided) */
    language?: string;
    /** Whether the overlay is visible */
    isOpen: boolean;
    /** Callback when the overlay should close */
    onClose: () => void;
    /** Optional title to display in the header */
    title?: string;
    /** Theme mode for dark/light styling (defaults to 'light') */
    theme?: 'light' | 'dark';
    /** Enable diff mode for side-by-side comparison */
    diffMode?: boolean;
    /** Original content (left side) for diff mode */
    originalContent?: string;
    /** Modified content (right side) for diff mode */
    modifiedContent?: string;
    /** Render inline without dialog (for playground) */
    embedded?: boolean;
    /** Error message if the tool failed */
    error?: string;
}
/**
 * Auto-detect language from content patterns.
 * Checks for JSON, code blocks, then defaults to markdown.
 */
export declare function detectLanguage(content: string): string;
/**
 * Detect language from file path extension.
 */
export declare function detectLanguageFromPath(filePath: string): string;
export declare function GenericOverlay({ content, language, isOpen, onClose, title, theme, diffMode, originalContent, modifiedContent, embedded, error, }: GenericOverlayProps): React.JSX.Element;
