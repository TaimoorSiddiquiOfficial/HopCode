import type { SessionFilter } from '../../shared/types';
export interface CollapsedGroupScopeOptions {
    workspaceId?: string;
    currentFilter?: SessionFilter;
    groupingMode: 'none' | 'date' | 'status';
}
export declare function serializeSessionFilterForScope(filter?: SessionFilter): string;
/**
 * Build a deterministic scope suffix for collapsed group persistence.
 * This prevents collapse state from bleeding across workspaces, filters, and grouping modes.
 */
export declare function buildCollapsedGroupsScopeSuffix({ workspaceId, currentFilter, groupingMode, }: CollapsedGroupScopeOptions): string;
