import React, { type ReactNode } from 'react';
import { type ThemeOverrides, type ThemeFile, type ShikiThemeConfig } from '@config/theme';
export type ThemeMode = 'light' | 'dark' | 'system';
export type FontFamily = 'inter' | 'system';
interface ThemeContextType {
    mode: ThemeMode;
    /** App-level default color theme (used when workspace has no override) */
    colorTheme: string;
    font: FontFamily;
    setMode: (mode: ThemeMode) => void;
    /** Set app-level default color theme */
    setColorTheme: (theme: string) => void;
    setFont: (font: FontFamily) => void;
    /** Active workspace ID (null if no workspace context) */
    activeWorkspaceId: string | null;
    /** Workspace-specific color theme override (null = inherit from app default) */
    workspaceColorTheme: string | null;
    /** Set workspace-specific color theme override (null = inherit) */
    setWorkspaceColorTheme: (theme: string | null) => void;
    resolvedMode: 'light' | 'dark';
    systemPreference: 'light' | 'dark';
    /** Effective color theme for rendering (previewColorTheme ?? workspaceColorTheme ?? colorTheme) */
    effectiveColorTheme: string;
    /** Temporary preview theme (hover state) - not persisted */
    previewColorTheme: string | null;
    /** Set temporary preview theme for hover preview. Pass null to clear. */
    setPreviewColorTheme: (theme: string | null) => void;
    /** Where effectiveColorTheme came from for current render cycle */
    effectiveColorThemeSource: 'preview' | 'workspace' | 'app';
    /** How the preset theme was resolved */
    themeResolvedFrom: 'none' | 'ipc' | 'fallback';
    /** Non-fatal theme loading error. Null when theme loaded normally. */
    themeLoadError: string | null;
    /** Loaded preset theme file, null if default or loading */
    presetTheme: ThemeFile | null;
    /** Fully resolved theme (preset merged with any overrides) */
    resolvedTheme: ThemeOverrides;
    /** Whether dark mode is active (scenic themes force dark) */
    isDark: boolean;
    /** Whether theme is scenic mode (background image with glass panels) */
    isScenic: boolean;
    /** Shiki syntax highlighting theme name for current mode */
    shikiTheme: string;
    /** Shiki theme configuration (light/dark variants) */
    shikiConfig: ShikiThemeConfig;
}
interface ThemeProviderProps {
    children: ReactNode;
    defaultMode?: ThemeMode;
    defaultColorTheme?: string;
    defaultFont?: FontFamily;
    /** Active workspace ID for workspace-level theme overrides */
    activeWorkspaceId?: string | null;
}
export declare function ThemeProvider({ children, defaultMode, defaultColorTheme, defaultFont, activeWorkspaceId }: ThemeProviderProps): React.JSX.Element;
export declare function useTheme(): ThemeContextType;
export {};
