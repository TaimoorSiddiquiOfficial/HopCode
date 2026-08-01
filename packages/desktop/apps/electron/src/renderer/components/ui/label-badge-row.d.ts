/**
 * LabelBadgeRow - Renders a flex-wrap row of metadata-style label chips.
 *
 * Positioned above the RichTextInput in FreeFormInput. Each badge shows
 * the label's color, name, and optional typed value. Clicking a badge
 * opens a LabelValuePopover for editing or removing.
 *
 * Data flow:
 * - sessionLabels: string[] (e.g., ["bug", "priority::3", "due::2026-01-30"])
 * - labels: LabelConfig[] (workspace label tree for resolving colors/valueTypes)
 * - Parses each entry via parseLabelEntry() to extract id + rawValue
 * - Resolves LabelConfig from flat tree for color and valueType
 */
import * as React from 'react';
import type { LabelConfig } from '@craft-agent/shared/labels';
export interface LabelBadgeRowProps {
    /** Applied session labels (encoded strings like "bug" or "priority::3") */
    sessionLabels: string[];
    /** Full label config tree (for resolving colors, names, valueTypes) */
    labels: LabelConfig[];
    /** Called when a label value is changed — receives the updated full sessionLabels array */
    onLabelsChange?: (updatedLabels: string[]) => void;
    /** Additional className for the container */
    className?: string;
}
export declare function LabelBadgeRow({ sessionLabels, labels, onLabelsChange, className, }: LabelBadgeRowProps): React.JSX.Element | null;
