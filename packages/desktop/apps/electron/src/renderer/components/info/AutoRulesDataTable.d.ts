/**
 * AutoRulesDataTable
 *
 * Flat data table displaying all auto-label rules across all labels.
 * Each row shows which label a rule belongs to, the regex pattern, flags,
 * value template, and description.
 *
 * Rules are collected by recursively traversing the label tree and flattening
 * all autoRules into a single list.
 */
import * as React from 'react';
import type { LabelConfig } from '@craft-agent/shared/labels';
interface AutoRulesDataTableProps {
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
export declare function AutoRulesDataTable({ data, searchable, maxHeight, fullscreen, fullscreenTitle, className, }: AutoRulesDataTableProps): React.JSX.Element;
export {};
