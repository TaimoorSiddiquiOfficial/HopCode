/**
 * Info_DataTable
 *
 * Enhanced data table for Info pages with built-in search, sort, and filter UI.
 * Wraps shadcn DataTable with Info-page styling and toolbar controls.
 */
import * as React from 'react';
import type { ColumnDef } from '@tanstack/react-table';
export interface Info_DataTableProps<TData, TValue> {
    /** TanStack Table column definitions */
    columns: ColumnDef<TData, TValue>[];
    /** Table data */
    data: TData[];
    /** Show search input in toolbar */
    searchable?: boolean | {
        /** Placeholder text */
        placeholder?: string;
        /** Column ID to search (defaults to global search) */
        column?: string;
    };
    /** Max height with scroll (similar to Info_Markdown) */
    maxHeight?: number;
    /** Show loading state */
    loading?: boolean;
    /** Show error message */
    error?: string;
    /** Empty state content */
    emptyContent?: React.ReactNode;
    /**
     * Floating action rendered OVER the table header (e.g., fullscreen button).
     * Uses absolute positioning inside scroll container - appears on hover via group-hover.
     * Parent should have 'group' class for hover detection.
     */
    floatingAction?: React.ReactNode;
    /** Enable tree/hierarchical rows (passed through to DataTable) */
    getSubRows?: (row: TData) => TData[] | undefined;
    /** Additional class names */
    className?: string;
}
/**
 * Info_DataTable - Enhanced data table for Info pages
 *
 * @example
 * ```tsx
 * const columns: ColumnDef<ToolRow>[] = [
 *   {
 *     accessorKey: 'name',
 *     header: ({ column }) => <SortableHeader column={column} title="Name" />,
 *   },
 *   // ...
 * ]
 *
 * <Info_DataTable
 *   columns={columns}
 *   data={tools}
 *   searchable={{ placeholder: 'Search tools...' }}
 *   maxHeight={400}
 * />
 * ```
 */
export declare function Info_DataTable<TData, TValue>({ columns, data, searchable, maxHeight, loading, error, emptyContent, floatingAction, getSubRows, className, }: Info_DataTableProps<TData, TValue>): React.JSX.Element;
export { SortableHeader } from '@/components/ui/data-table';
export type { ColumnDef } from '@tanstack/react-table';
