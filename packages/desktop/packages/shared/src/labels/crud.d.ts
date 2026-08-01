/**
 * Label CRUD Operations
 *
 * Create, Read, Update, Delete, Move, Reorder operations for the label tree.
 * All operations work on the nested JSON tree structure.
 * Delete cascade strips the label (and descendants) from all sessions.
 */
import type { LabelConfig, CreateLabelInput, UpdateLabelInput } from './types.ts';
/**
 * Create a new label.
 * Inserts into the specified parent's children array, or at root level.
 * Generates a globally unique slug from the name.
 */
export declare function createLabel(workspaceRootPath: string, input: CreateLabelInput): LabelConfig;
/**
 * Ensure all label entries reference labels that exist in the workspace config.
 * For each entry, if the label ID doesn't exist, auto-creates it with a
 * titlecased name derived from the slug. Returns resolved entries with the
 * actual created IDs (handles any slug mismatch from createLabel).
 *
 * Entries with invalid ID format are passed through unchanged.
 */
export declare function ensureLabelsExist(workspaceRootPath: string, labels: string[]): string[];
/**
 * Update an existing label (name, color, valueType).
 * Cannot change the ID or hierarchy position.
 * @throws Error if label not found
 */
export declare function updateLabel(workspaceRootPath: string, labelId: string, updates: UpdateLabelInput): LabelConfig;
/**
 * Delete a label and all its descendants.
 * Strips removed labels from all sessions that reference them.
 * @returns Number of sessions that had labels stripped
 */
export declare function deleteLabel(workspaceRootPath: string, labelId: string): {
    stripped: number;
};
/**
 * Reorder labels within a parent's children (or root level).
 * Provide the full ordered list of sibling IDs at that level.
 * @param parentId - null for root level, or the parent label's ID
 * @param orderedIds - New order of child IDs at that level
 */
export declare function reorderLabels(workspaceRootPath: string, parentId: string | null, orderedIds: string[]): void;
/**
 * Move a label to a different parent (or to root level).
 * The label keeps its ID and children intact.
 * @param newParentId - null to move to root, or target parent's ID
 */
export declare function moveLabel(workspaceRootPath: string, labelId: string, newParentId: string | null): void;
