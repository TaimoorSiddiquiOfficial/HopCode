/**
 * DiffIcons - SVG icons for diff viewer controls
 *
 * Icons sourced from diffs.com for visual consistency with @pierre/diffs
 */
import * as React from 'react';
interface IconProps {
    className?: string;
}
/**
 * Split view icon - shows two panels side by side
 * Used when currently in unified mode, click to switch to split
 */
export declare function DiffSplitIcon({ className }: IconProps): React.JSX.Element;
/**
 * Unified view icon - shows stacked panels (additions below deletions)
 * Used when currently in split mode, click to switch to unified
 */
export declare function DiffUnifiedIcon({ className }: IconProps): React.JSX.Element;
/**
 * Background toggle icon - lines with a highlighted box in the middle
 * Toggles background highlighting on changed lines
 */
export declare function DiffBackgroundIcon({ className }: IconProps): React.JSX.Element;
export {};
