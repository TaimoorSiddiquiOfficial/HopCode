/**
 * LabelsDataTable
 *
 * Hierarchical data table for displaying label configurations.
 * Uses TanStack Table's built-in expand/collapse for tree rendering.
 * Columns: Color, Name (indented + chevron), Value Type.
 */
import * as React from 'react';
import type { LabelConfig } from '@craft-agent/shared/labels';
interface LabelsDataTableProps {
    /** Label tree (root-level nodes with nested children) */
    data: LabelConfig[];
    /** Show search input */
    searchable?: boolean;
    /** Max height with scroll */
    maxHeight?: number;
    /** Enable fullscreen button */
    fullscreen?: boolean;
    /** Title for fullscreen overlay */
    fullscreenTitle?: string;
    className?: string;
}
export declare function LabelsDataTable({ data, searchable, maxHeight, fullscreen, fullscreenTitle, className, }: LabelsDataTableProps): React.JSX.Element;
export {};
