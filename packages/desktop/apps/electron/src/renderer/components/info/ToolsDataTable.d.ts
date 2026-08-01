/**
 * ToolsDataTable
 *
 * Typed Data Table for displaying MCP tools.
 * Features: searchable tools, sortable columns, max-height scroll.
 */
import * as React from 'react';
export type ToolPermission = 'allowed' | 'requires-permission';
export interface ToolRow {
    name: string;
    description: string;
    permission: ToolPermission;
}
interface ToolsDataTableProps {
    data: ToolRow[];
    /** Show loading spinner */
    loading?: boolean;
    /** Show error message */
    error?: string;
    /** Max height with scroll (default: 400) */
    maxHeight?: number;
    className?: string;
}
export declare function ToolsDataTable({ data, loading, error, maxHeight, className, }: ToolsDataTableProps): React.JSX.Element;
export {};
