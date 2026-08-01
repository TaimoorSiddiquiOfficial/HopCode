/**
 * useViews Hook
 *
 * React hook that loads view configs, compiles their Filtrex expressions,
 * and provides an evaluator function to match sessions against views.
 *
 * Compilation happens once on config load (useMemo). The compiled functions
 * run at native JS speed — no parsing overhead per evaluation.
 *
 * Re-compiles on LABELS_CHANGED events (views changes trigger same broadcast).
 */
import type { ViewConfig } from '@craft-agent/shared/views';
import type { SessionMeta } from '../atoms/sessions';
export interface UseViewsResult {
    /** Raw view configs (for display in sidebar, settings, etc.) */
    viewConfigs: ViewConfig[];
    /** Loading state */
    isLoading: boolean;
    /**
     * Evaluate a session against all compiled views.
     * Returns the configs of matching views.
     * Fast: runs compiled native JS functions, no parsing.
     */
    evaluateSession: (meta: SessionMeta) => ViewConfig[];
    /** Force re-fetch from IPC */
    refresh: () => Promise<void>;
}
/**
 * Load and compile views for a workspace.
 * Expressions are compiled once on load, then evaluated per-session per-render.
 * Subscribes to live changes via LABELS_CHANGED event (views trigger same broadcast).
 */
export declare function useViews(workspaceId: string | null): UseViewsResult;
