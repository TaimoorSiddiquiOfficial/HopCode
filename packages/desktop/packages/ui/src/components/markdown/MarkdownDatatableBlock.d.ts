/**
 * MarkdownDatatableBlock - Interactive data table for markdown ```datatable code blocks
 *
 * Renders structured JSON as a sortable table with fullscreen expand.
 * No TanStack dependency — uses native HTML table + React state for lightweight
 * portability across Electron and the web viewer.
 *
 * Expected JSON shape (inline):
 * {
 *   "title": "Sales by Region",
 *   "columns": [{ "key": "region", "label": "Region", "type": "text" }],
 *   "rows": [{ "region": "North America" }]
 * }
 *
 * File-backed shape (src field):
 * {
 *   "src": "data/transactions.json",
 *   "title": "Transactions",
 *   "columns": [{ "key": "id", "label": "ID", "type": "text" }]
 * }
 *
 * When `src` is present, rows are loaded from the file via PlatformContext.onReadFile.
 * The file can contain full {title, columns, rows} or just a rows array [...].
 * Inline title/columns take precedence over file values.
 *
 * Falls back to CodeBlock if JSON parsing fails.
 */
import * as React from 'react';
export interface MarkdownDatatableBlockProps {
    code: string;
    className?: string;
}
export declare function MarkdownDatatableBlock({ code, className }: MarkdownDatatableBlockProps): React.JSX.Element;
