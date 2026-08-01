import * as React from 'react';
import type { ColumnDef, Column, Row, Table as TableInstance } from '@tanstack/react-table';
interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    /** Global filter value (searches across all columns) */
    globalFilter?: string;
    /** Column ID to apply column-specific filter to */
    filterColumn?: string;
    /** Column-specific filter value */
    filterValue?: string;
    /** Custom class for the table container */
    className?: string;
    /** Empty state content */
    emptyContent?: React.ReactNode;
    /** Callback to get table instance for external control */
    onTableReady?: (table: TableInstance<TData>) => void;
    /** Skip the border wrapper (when parent provides it) */
    noBorder?: boolean;
    /** Skip the table overflow wrapper (required for sticky headers) */
    noWrapper?: boolean;
    /** Enable pagination */
    pagination?: boolean;
    /** Page size when pagination is enabled (default: 50) */
    pageSize?: number;
    /**
     * Enable tree/hierarchical rows. Provide a function that returns child rows.
     * When set, rows can be expanded/collapsed. All rows start expanded by default.
     */
    getSubRows?: (row: TData) => TData[] | undefined;
    /** Initial expanded state (default: all expanded when getSubRows is provided) */
    defaultExpanded?: boolean;
}
export declare function DataTable<TData, TValue>({ columns, data, globalFilter, filterValue, filterColumn, className, emptyContent, onTableReady, noBorder, noWrapper, pagination: paginationEnabled, pageSize, getSubRows, defaultExpanded, }: DataTableProps<TData, TValue>): React.JSX.Element;
/**
 * Sortable column header component
 * Use in column definitions: header: ({ column }) => <SortableHeader column={column} title="Name" />
 */
interface SortableHeaderProps<TData, TValue> {
    column: Column<TData, TValue>;
    title: string;
    className?: string;
}
export declare function SortableHeader<TData, TValue>({ column, title, className, }: SortableHeaderProps<TData, TValue>): React.JSX.Element;
export type { ColumnDef, Column, Row, TableInstance };
