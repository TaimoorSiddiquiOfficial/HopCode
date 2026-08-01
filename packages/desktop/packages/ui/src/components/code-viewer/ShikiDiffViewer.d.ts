/**
 * ShikiDiffViewer - Diff viewer using @pierre/diffs (Shiki-based)
 *
 * Platform-agnostic component for displaying file diffs with:
 * - Unified or split diff view
 * - Syntax highlighting via Shiki
 * - Light/dark theme support
 * - Line-level diff highlighting
 */
import * as React from 'react';
import { type FileDiffMetadata } from '@pierre/diffs/react';
export interface ShikiDiffViewerProps {
    /** Original (before) content */
    original: string;
    /** Modified (after) content */
    modified: string;
    /** File path - used for language detection and display */
    filePath?: string;
    /** Language for syntax highlighting (auto-detected from filePath if not provided) */
    language?: string;
    /** Diff style: 'unified' (stacked) or 'split' (side-by-side) */
    diffStyle?: 'unified' | 'split';
    /** Theme mode */
    theme?: 'light' | 'dark';
    /** Shiki theme name (e.g., 'dracula', 'github-dark'). When provided, uses the matching
     *  Shiki theme natively. Falls back to craft-dark/craft-light (transparent bg) if not set. */
    shikiTheme?: string;
    /** Disable background highlighting on changed lines */
    disableBackground?: boolean;
    /** Whether to hide pierre's native file header (filename + stats). Default: true */
    disableFileHeader?: boolean;
    /** Callback when the file header is clicked (e.g. to open the file in an editor).
     *  When provided, the header becomes clickable with cursor: pointer. */
    onFileHeaderClick?: (filePath: string) => void;
    /** Callback when ready */
    onReady?: () => void;
    /** Additional class names */
    className?: string;
}
/**
 * Calculate addition/deletion stats from a FileDiffMetadata
 * Useful for displaying change counts in headers
 */
export declare function getDiffStats(fileDiff: FileDiffMetadata): {
    additions: number;
    deletions: number;
};
/**
 * ShikiDiffViewer - Shiki-based diff viewer component
 */
export declare function ShikiDiffViewer({ original, modified, filePath, language, diffStyle, theme, shikiTheme, disableBackground, disableFileHeader, onFileHeaderClick, onReady, className, }: ShikiDiffViewerProps): React.JSX.Element;
