/**
 * Label Tree Utilities
 *
 * The label config IS a nested JSON tree — no conversion from flat list needed.
 * These utilities provide recursive operations on the tree:
 * - flattenLabels: collect all labels into a flat array (for ID lookups, validation)
 * - sortLabelsForDisplay: recursively alphabetize a copy of the tree for UI display
 * - flattenLabelsWithParentPath: flatten labels while preserving parent breadcrumbs
 * - findLabelById: locate a label node anywhere in the tree
 * - getDescendantIds: get all child/grandchild IDs (for hierarchical filtering)
 * - findParent: find the parent label of a given label ID
 *
 * Sessions reference labels by simple slug IDs (e.g., ["react", "bug"]).
 * Filtering by a parent includes all descendants.
 */
import type { LabelConfig } from './types.ts';
/**
 * Compare label display names consistently for UI ordering.
 * Uses case-insensitive locale-aware comparison so all label surfaces can share
 * the same rule instead of mixing lowercase normalization and raw localeCompare.
 */
export declare function compareLabelNamesForDisplay(a: Pick<LabelConfig, 'name'>, b: Pick<LabelConfig, 'name'>): number;
/**
 * Flatten the entire label tree into a one-dimensional array.
 * Useful for ID lookups, uniqueness validation, and session label checks.
 * Traverses depth-first (parent before children).
 */
export declare function flattenLabels(labels: LabelConfig[]): LabelConfig[];
/**
 * Return a recursively sorted copy of the label tree for user-facing display.
 * Does not mutate the original config tree.
 */
export declare function sortLabelsForDisplay(labels: LabelConfig[]): LabelConfig[];
export interface FlattenedLabelWithParentPath {
    label: LabelConfig;
    parentNames: string[];
    parentPath?: string;
}
/**
 * Flatten labels while preserving parent breadcrumb names for display/search UIs.
 * Ordering follows the provided tree order so callers can choose whether to feed
 * raw config order or a recursively display-sorted tree.
 */
export declare function flattenLabelsWithParentPath(labels: LabelConfig[]): FlattenedLabelWithParentPath[];
/**
 * Find a label by ID anywhere in the tree.
 * Returns the label config or undefined if not found.
 */
export declare function findLabelById(labels: LabelConfig[], id: string): LabelConfig | undefined;
/**
 * Get all descendant label IDs for a given label.
 * Used for hierarchical filtering — clicking a parent label shows sessions
 * tagged with it OR any of its descendants.
 * Does NOT include the label itself, only its children/grandchildren.
 */
export declare function getDescendantIds(labels: LabelConfig[], parentId: string): string[];
/**
 * Find the parent of a given label ID in the tree.
 * Returns the parent LabelConfig or undefined if the label is at root level.
 */
export declare function findParent(labels: LabelConfig[], targetId: string): LabelConfig | undefined;
/**
 * Collect all IDs that exist in the tree.
 * Convenience wrapper around flattenLabels for quick membership checks.
 */
export declare function collectAllIds(labels: LabelConfig[]): Set<string>;
/**
 * UI-friendly tree node wrapping LabelConfig.
 * Used by the sidebar to render hierarchical label navigation.
 */
export interface LabelTreeNode {
    /** Full unique identifier (same as label.id in tree-based config) */
    fullId: string;
    /** The slug segment of this node */
    segment: string;
    /** Associated LabelConfig (always present in tree-based config) */
    label: LabelConfig;
    /** Child tree nodes */
    children: LabelTreeNode[];
}
/**
 * Convert a LabelConfig[] tree into LabelTreeNode[] for the UI.
 * Since the config is already a nested tree, this maps each node
 * to the UI shape with fullId/segment fields.
 */
export declare function buildLabelTree(labels: LabelConfig[]): LabelTreeNode[];
/**
 * Get the display name for a label by its ID.
 * Falls back to titlecased slug if label not found in the tree.
 */
export declare function getLabelDisplayName(labels: LabelConfig[], labelId: string): string;
