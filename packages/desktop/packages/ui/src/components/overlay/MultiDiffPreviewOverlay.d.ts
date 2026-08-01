/**
 * MultiDiffPreviewOverlay - Overlay for multiple file changes (Edit/Write tools)
 *
 * Layout: Stacked diffs using pierre's native file headers — GitHub PR-like view.
 * Each diff renders its own file header (filename + addition/deletion counts) via @pierre/diffs.
 * No card chrome or collapse — all diffs are visible in a single scrollable area.
 *
 * Features:
 * - Stacked diffs with native pierre file headers (no custom card wrappers)
 * - Consolidated view (group by file) or individual changes
 * - Unified/split diff viewer for each change
 * - Focused change support (scroll to specific change on open)
 * - Header shows file path for single file, "N edits" summary for multiple files
 */
import * as React from 'react';
/**
 * A single file change (Edit or Write)
 *
 * Supports two formats:
 * - Tool edit events: original/modified strings (computed diff)
 * - Codex: unifiedDiff string (pre-computed unified diff patch)
 */
export interface FileChange {
    /** Unique ID for this change */
    id: string;
    /** Absolute file path */
    filePath: string;
    /** Tool type: Edit or Write */
    toolType: 'Edit' | 'Write';
    /** For Edit: the old_string; For Write: empty or previous content if available */
    original: string;
    /** For Edit: the new_string; For Write: the written content */
    modified: string;
    /** Codex format: raw unified diff string (alternative to original/modified) */
    unifiedDiff?: string;
    /** Error message if the tool failed */
    error?: string;
}
/**
 * Diff viewer display preferences
 * Passed from parent to avoid localStorage usage - all settings stored in preferences.json
 */
export interface DiffViewerSettings {
    diffStyle: 'unified' | 'split';
    disableBackground: boolean;
}
export interface MultiDiffPreviewOverlayProps {
    /** Whether the overlay is visible */
    isOpen: boolean;
    /** Callback when the overlay should close */
    onClose: () => void;
    /** List of file changes to display */
    changes: FileChange[];
    /** Whether to consolidate changes by file path (default: true) */
    consolidated?: boolean;
    /** ID of change to focus on initially */
    focusedChangeId?: string;
    /** Theme mode */
    theme?: 'light' | 'dark';
    /** Render inline without dialog (for playground) */
    embedded?: boolean;
    /** Initial diff viewer settings (from user preferences) */
    diffViewerSettings?: Partial<DiffViewerSettings>;
    /** Callback when diff viewer settings change (to persist to preferences) */
    onDiffViewerSettingsChange?: (settings: DiffViewerSettings) => void;
}
export declare function MultiDiffPreviewOverlay({ isOpen, onClose, changes, consolidated, focusedChangeId, theme, embedded, diffViewerSettings, onDiffViewerSettingsChange, }: MultiDiffPreviewOverlayProps): React.JSX.Element;
