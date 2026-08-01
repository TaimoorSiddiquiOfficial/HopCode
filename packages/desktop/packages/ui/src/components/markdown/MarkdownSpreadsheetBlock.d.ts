/**
 * MarkdownSpreadsheetBlock - Excel-style grid for markdown ```spreadsheet code blocks
 *
 * Renders structured JSON as a spreadsheet with column letters, row numbers,
 * and type-aware cell formatting. No external dependencies beyond React.
 *
 * Expected JSON shape (inline):
 * {
 *   "filename": "Q1_Revenue.xlsx",
 *   "sheetName": "Summary",
 *   "columns": [{ "key": "region", "label": "Region", "type": "text" }],
 *   "rows": [{ "region": "North" }]
 * }
 *
 * File-backed shape (src field):
 * {
 *   "src": "data/revenue.json",
 *   "filename": "Q1_Revenue.xlsx",
 *   "columns": [{ "key": "region", "label": "Region", "type": "text" }]
 * }
 *
 * Falls back to CodeBlock if JSON parsing fails.
 */
import * as React from 'react';
export interface MarkdownSpreadsheetBlockProps {
    code: string;
    className?: string;
}
export declare function MarkdownSpreadsheetBlock({ code, className }: MarkdownSpreadsheetBlockProps): React.JSX.Element;
