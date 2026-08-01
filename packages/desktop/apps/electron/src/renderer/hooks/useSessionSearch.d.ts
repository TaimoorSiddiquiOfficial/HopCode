import { type SessionMeta } from "@/atoms/sessions";
import type { ViewConfig } from "@craft-agent/shared/views";
import type { SessionFilter } from "@/contexts/NavigationContext";
/** Filter mode for tri-state filtering: include shows only matching, exclude hides matching */
export type FilterMode = 'include' | 'exclude';
export interface DateGroup {
    date: Date;
    label: string;
    sessions: SessionMeta[];
}
export interface ContentSearchResult {
    matchCount: number;
    snippet: string;
}
/** Metadata for a collapsed group — emitted by the data pipeline so the renderer can show header-only groups */
export interface CollapsedGroupMeta {
    key: string;
    count: number;
}
export interface UseSessionSearchOptions {
    items: SessionMeta[];
    searchActive: boolean;
    searchQuery: string;
    workspaceId?: string;
    currentFilter?: SessionFilter;
    evaluateViews?: (meta: SessionMeta) => ViewConfig[];
    statusFilter?: Map<string, FilterMode>;
    labelFilterMap?: Map<string, FilterMode>;
    /** Collapsed group keys — collapsed items are excluded from pagination and flatItems */
    collapsedGroups?: Set<string>;
    /** Grouping mode — needed to compute group keys for collapse-aware pagination */
    groupingMode?: 'none' | 'date' | 'status';
    /** Ref to the ScrollArea viewport element — used for scroll-based pagination */
    scrollViewportRef?: React.RefObject<HTMLDivElement>;
}
export interface UseSessionSearchResult {
    isSearchMode: boolean;
    highlightQuery: string | undefined;
    isSearchingContent: boolean;
    /** Whether the search service is unavailable (e.g. ripgrep not found on remote server) */
    isSearchUnavailable: boolean;
    /** Raw content search results — needed by SessionItem for `chatMatchCount` */
    contentSearchResults: Map<string, ContentSearchResult>;
    matchingFilterItems: SessionMeta[];
    otherResultItems: SessionMeta[];
    exceededSearchLimit: boolean;
    flatItems: SessionMeta[];
    dateGroups: DateGroup[];
    sessionIndexMap: Map<string, number>;
    hasMore: boolean;
    /** Metadata for collapsed groups (key + item count) — used to build header-only placeholder groups */
    collapsedGroupsMeta: CollapsedGroupMeta[];
    searchInputRef: React.RefObject<HTMLInputElement>;
}
export interface CollapsedPaginationResult {
    paginatedItems: SessionMeta[];
    hasMore: boolean;
    collapsedGroupsMeta: CollapsedGroupMeta[];
}
export declare function computeCollapsedPagination(items: SessionMeta[], displayLimit: number, collapsedGroups?: Set<string>, groupingMode?: 'none' | 'date' | 'status'): CollapsedPaginationResult;
interface FilterMatchOptions {
    evaluateViews?: (meta: SessionMeta) => ViewConfig[];
    statusFilter?: Map<string, 'include' | 'exclude'>;
    labelFilterMap?: Map<string, 'include' | 'exclude'>;
}
export declare function sessionMatchesCurrentFilter(session: SessionMeta, currentFilter: SessionFilter | undefined, options?: FilterMatchOptions): boolean;
export declare function useSessionSearch({ items, searchActive, searchQuery, workspaceId, currentFilter, evaluateViews, statusFilter, labelFilterMap, collapsedGroups, groupingMode, scrollViewportRef, }: UseSessionSearchOptions): UseSessionSearchResult;
export {};
