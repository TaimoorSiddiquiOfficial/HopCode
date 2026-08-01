/**
 * UnifiedDiffViewer - Diff viewer for pre-computed unified diff strings
 *
 * Used for Codex file operations which provide unified diff patches
 * instead of original/modified content strings.
 *
 * Uses @pierre/diffs parsePatchFiles to parse the unified diff string
 * and renders via the FileDiff component with proper theming.
 */
import * as React from 'react';
export interface UnifiedDiffViewerProps {
    /** Raw unified diff string (e.g., from Codex fileChange.diff) */
    unifiedDiff: string;
    /** File path - used for display in header */
    filePath?: string;
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
 * UnifiedDiffViewer - Renders pre-computed unified diff strings
 */
export declare function UnifiedDiffViewer({ unifiedDiff, filePath, diffStyle, theme, shikiTheme, disableBackground, disableFileHeader, onFileHeaderClick, onReady, className, }: UnifiedDiffViewerProps): React.JSX.Element;
/**
 * Calculate addition/deletion stats from a unified diff string.
 * Useful for displaying change counts in headers without full rendering.
 */
export declare function getUnifiedDiffStats(unifiedDiff: string, filePath?: string): {
    additions: number;
    deletions: number;
} | null;
