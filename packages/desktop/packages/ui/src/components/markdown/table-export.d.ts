/**
 * table-export.ts - Export utilities for datatable/spreadsheet blocks
 *
 * Converts column/row data to Markdown, CSV, and XLSX formats.
 * XLSX uses fflate for ZIP compression — no heavyweight spreadsheet library needed.
 */
export interface ExportColumn {
    key: string;
    label: string;
    type?: string;
}
export declare function tableToMarkdown(columns: ExportColumn[], rows: Record<string, unknown>[]): string;
export declare function tableToCsv(columns: ExportColumn[], rows: Record<string, unknown>[]): string;
export declare function tableToXlsx(columns: ExportColumn[], rows: Record<string, unknown>[], filename: string): void;
