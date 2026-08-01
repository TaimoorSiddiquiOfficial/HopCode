/**
 * Info_GroupedList
 *
 * Lists with colored group headers (e.g., for MCP tools display).
 * Supports loading, error, and empty states.
 */
import * as React from 'react';
export interface Info_GroupedListProps {
    children: React.ReactNode;
    /** Show loading spinner */
    loading?: boolean;
    /** Show error message */
    error?: string;
    /** Show empty message when no groups have items */
    empty?: string;
    className?: string;
}
export interface Info_GroupedListGroupProps {
    children: React.ReactNode;
    /** Group header label */
    label: string;
    /** Header color variant */
    variant: 'success' | 'info' | 'warning' | 'muted';
    /** Optional item count */
    count?: number;
    className?: string;
}
export interface Info_GroupedListItemProps {
    children: React.ReactNode;
    className?: string;
}
declare function Info_GroupedListRoot({ children, loading, error, empty, className, }: Info_GroupedListProps): React.JSX.Element;
declare function Info_GroupedListGroup({ children, label, variant, count, className, }: Info_GroupedListGroupProps): React.JSX.Element | null;
declare function Info_GroupedListItem({ children, className }: Info_GroupedListItemProps): React.JSX.Element;
export declare const Info_GroupedList: typeof Info_GroupedListRoot & {
    Group: typeof Info_GroupedListGroup;
    Item: typeof Info_GroupedListItem;
};
export {};
