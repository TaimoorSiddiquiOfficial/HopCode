import type { LabelConfig } from '@craft-agent/shared/labels';
export interface LabelMenuItem {
    id: string;
    label: string;
    config: LabelConfig;
    /** Breadcrumb path for nested labels (e.g. "Priority / ") */
    parentPath?: string;
}
export declare function compareLabelMenuItems(a: LabelMenuItem, b: LabelMenuItem): number;
/**
 * Build flat label menu items with parent breadcrumbs for searchable label menus.
 * Exclusion is handled here so both the inline # menu and AppShell filter search
 * can share the same flattening/path-building logic.
 */
export declare function createLabelMenuItems(labels: LabelConfig[], excludedLabelIds?: Iterable<string>): LabelMenuItem[];
/**
 * Score how well a segment matches a path part.
 * 3 = starts with segment (best: "pri" → "Priority")
 * 2 = word boundary match (after space/hyphen/underscore: "high" → "super-high")
 * 1 = contains anywhere (mid-word: "ior" → "Priority")
 * 0 = no match
 */
export declare function segmentScore(part: string, segment: string): number;
/**
 * Unified hierarchical filter with scoring.
 * Splits the filter by "/" into segments (single segment if no "/").
 * Each segment is matched in order against the item's full path (parentPath parts + label).
 * Results are sorted by total match score (starts-with > word-boundary > contains).
 */
export declare function filterItems(items: LabelMenuItem[], filter: string): LabelMenuItem[];
/**
 * Filter flat session statuses using the same segment scoring as labels.
 * `getLabel` lets callers search against localized built-in status labels.
 */
export declare function filterSessionStatuses<T extends {
    label: string;
}>(states: T[], filter: string, getLabel?: (state: T) => string): T[];
