/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
export type ExportTheme = 'light' | 'dark';
export declare const EXPORT_THEME_STORAGE_KEY = "hopcode-export-theme";
export type UseExportThemeResult = {
    theme: ExportTheme;
    toggleTheme: () => void;
};
export declare const useExportTheme: () => UseExportThemeResult;
