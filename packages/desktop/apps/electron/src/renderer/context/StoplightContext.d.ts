/**
 * StoplightContext
 *
 * Provides stoplight (macOS traffic lights) compensation state to child components.
 * When true, PanelHeader will automatically add left padding to avoid overlapping
 * with the red/yellow/green window controls.
 *
 * Used by MainContentPanel to propagate focused mode state to all pages without
 * requiring each page to handle it explicitly.
 */
export declare const StoplightProvider: import("react").Provider<boolean>;
/**
 * Hook to check if stoplight compensation should be applied.
 * Returns true when the content is in focused mode and needs to avoid
 * overlapping with macOS traffic lights.
 */
export declare function useCompensateForStoplight(): boolean;
