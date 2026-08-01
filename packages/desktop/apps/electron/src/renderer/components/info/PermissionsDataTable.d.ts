/**
 * PermissionsDataTable
 *
 * Typed Data Table for displaying source permissions.
 * Features: searchable patterns, sortable columns, max-height scroll, fullscreen view.
 */
import * as React from 'react';
export type PermissionAccess = 'allowed' | 'blocked';
export type PermissionType = 'tool' | 'bash' | 'api' | 'mcp';
export interface PermissionRow {
    access: PermissionAccess;
    type: PermissionType;
    pattern: string;
    comment?: string | null;
}
interface PermissionsDataTableProps {
    data: PermissionRow[];
    /** Hide the type column (for MCP sources that only show pattern/comment) */
    hideTypeColumn?: boolean;
    /** Show search input */
    searchable?: boolean;
    /** Max height with scroll */
    maxHeight?: number;
    /** Enable fullscreen button (shows Maximize2 icon on hover) */
    fullscreen?: boolean;
    /** Title for the fullscreen overlay header */
    fullscreenTitle?: string;
    className?: string;
}
export declare function PermissionsDataTable({ data, hideTypeColumn, searchable, maxHeight, fullscreen, fullscreenTitle, className, }: PermissionsDataTableProps): React.JSX.Element;
export {};
