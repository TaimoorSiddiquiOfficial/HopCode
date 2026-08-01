/**
 * Info_Table
 *
 * Clean definition list style key-value display.
 * Use for Connection info, metadata display, etc.
 * No card wrapper - integrates cleanly with page.
 */
import * as React from 'react';
export interface Info_TableProps {
    children: React.ReactNode;
    /** Optional footer content (e.g., error alert) */
    footer?: React.ReactNode;
    /** Label column width in pixels (default: 120) */
    labelWidth?: number;
    className?: string;
}
export interface Info_TableRowProps {
    /** Left column label */
    label: string;
    /** Right column value (shorthand) */
    value?: React.ReactNode;
    /** Right column content (for complex content, use instead of value) */
    children?: React.ReactNode;
    className?: string;
}
declare function Info_TableRoot({ children, footer, labelWidth, className, }: Info_TableProps): React.JSX.Element;
declare function Info_TableRow({ label, value, children, className }: Info_TableRowProps): React.JSX.Element;
export declare const Info_Table: typeof Info_TableRoot & {
    Row: typeof Info_TableRow;
};
export {};
