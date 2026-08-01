/**
 * Status CRUD Operations
 *
 * Create, Read, Update, Delete operations for status configurations.
 * Enforces business rules (fixed statuses, default statuses, uniqueness).
 */
import type { StatusConfig, CreateStatusInput, UpdateStatusInput } from './types.ts';
/**
 * Create a new custom status
 * @throws Error if ID conflicts or validation fails
 */
export declare function createStatus(workspaceRootPath: string, input: CreateStatusInput): StatusConfig;
/**
 * Update a status (label, color, icon, category)
 * Cannot change ID or isFixed/isDefault flags
 * @throws Error if status is fixed and trying to change protected fields
 */
export declare function updateStatus(workspaceRootPath: string, statusId: string, updates: UpdateStatusInput): StatusConfig;
/**
 * Delete a status
 * @throws Error if status is fixed or default
 * @returns Number of sessions that were auto-migrated to 'todo'
 */
export declare function deleteStatus(workspaceRootPath: string, statusId: string): {
    migrated: number;
};
/**
 * Reorder statuses
 */
export declare function reorderStatuses(workspaceRootPath: string, orderedIds: string[]): void;
/**
 * Reset to default configuration
 * WARNING: Deletes all custom statuses
 */
export declare function resetToDefaults(workspaceRootPath: string): void;
