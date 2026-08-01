/**
 * useLabels Hook
 *
 * React hook to load and manage workspace labels.
 * Returns the label tree (nested structure with children) from config.
 * Also exposes a flattened version for components that need flat lookups.
 * Auto-refreshes when workspace changes or label config changes.
 */
import type { LabelConfig } from '@craft-agent/shared/labels';
export interface UseLabelsResult {
    /** Label tree (root-level nodes with nested children) */
    labels: LabelConfig[];
    /** Flattened label list for lookups and non-hierarchical display */
    flatLabels: LabelConfig[];
    isLoading: boolean;
    error: string | null;
    refresh: () => Promise<void>;
}
/**
 * Load labels for a workspace via IPC.
 * Returns the tree structure (labels with nested children).
 * Auto-refreshes when workspaceId changes.
 * Subscribes to live label config changes via LABELS_CHANGED event.
 */
export declare function useLabels(workspaceId: string | null): UseLabelsResult;
