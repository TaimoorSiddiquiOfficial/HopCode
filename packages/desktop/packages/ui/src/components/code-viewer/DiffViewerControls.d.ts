/**
 * DiffViewerControls - Header controls for diff viewer
 *
 * Displays:
 * - Change statistics (-X +Y with colored text)
 * - Diff style toggle (unified/split)
 * - Background toggle (enable/disable highlighting)
 *
 * Styled to match diffs.com controls
 */
import * as React from 'react';
export interface DiffViewerControlsProps {
    /** Number of added lines */
    additions: number;
    /** Number of deleted lines */
    deletions: number;
    /** Current diff style */
    diffStyle: 'unified' | 'split';
    /** Callback when diff style changes */
    onDiffStyleChange: (style: 'unified' | 'split') => void;
    /** Whether background highlighting is disabled */
    disableBackground: boolean;
    /** Callback when background toggle changes */
    onBackgroundChange: (disabled: boolean) => void;
    /** Additional className */
    className?: string;
}
/**
 * DiffViewerControls - Compact control bar for diff viewer settings
 *
 * Button styling matches diffs.com: opacity-60 hover:opacity-100
 */
export declare function DiffViewerControls({ additions, deletions, diffStyle, onDiffStyleChange, disableBackground, onBackgroundChange, className, }: DiffViewerControlsProps): React.JSX.Element;
