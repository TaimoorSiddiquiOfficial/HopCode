/**
 * TableExportDropdown - Copy/export dropdown for datatable & spreadsheet overlays
 *
 * Uses shared StyledDropdown components for consistent styling with the rest of the app.
 */
import { type ExportColumn } from './table-export';
export interface TableExportDropdownProps {
    columns: ExportColumn[];
    rows: Record<string, unknown>[];
    /** Filename for XLSX download (without extension) */
    filename: string;
}
export declare function TableExportDropdown({ columns, rows, filename }: TableExportDropdownProps): import("react").JSX.Element;
