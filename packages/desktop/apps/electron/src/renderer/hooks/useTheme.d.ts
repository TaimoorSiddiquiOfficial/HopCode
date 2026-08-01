import { type ThemeOverrides, type ThemeFile, type ShikiThemeConfig } from '@config/theme';
interface UseThemeOptions {
    /**
     * App-level theme override (from ~/.craft-agent/theme.json)
     * When provided, merges with the preset theme from context.
     */
    appTheme?: ThemeOverrides | null;
}
interface UseThemeResult {
    theme: ThemeOverrides;
    defaultTheme: ThemeOverrides;
    shikiTheme: string;
    shikiConfig: ShikiThemeConfig;
    presetTheme: ThemeFile | null;
    isDark: boolean;
    /** Whether the theme is in scenic mode (background image with glass panels) */
    isScenic: boolean;
}
/**
 * Hook to access theme state from ThemeContext.
 *
 * Theme loading and DOM manipulation happen in ThemeProvider (singleton).
 * This hook just reads the already-resolved values - no async loading,
 * no per-component effects.
 *
 * Optionally accepts appTheme to merge with preset (for app-level overrides).
 *
 * @example
 * ```tsx
 * // Simple usage - just read theme state
 * const { isDark, shikiTheme } = useTheme()
 *
 * // With app-level override
 * const [appTheme] = useAtom(appThemeAtom)
 * const { theme } = useTheme({ appTheme })
 * ```
 */
export declare function useTheme({ appTheme }?: UseThemeOptions): UseThemeResult;
export {};
