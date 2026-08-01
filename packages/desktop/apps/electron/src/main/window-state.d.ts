export interface WindowBounds {
    x: number;
    y: number;
    width: number;
    height: number;
}
export interface SavedWindow {
    type: 'main';
    workspaceId: string;
    bounds: WindowBounds;
    focused?: boolean;
    url?: string;
}
export interface WindowState {
    windows: SavedWindow[];
    lastFocusedWorkspaceId?: string;
}
/**
 * Save the current window state (windows with bounds and type)
 */
export declare function saveWindowState(state: WindowState): void;
/**
 * Load the saved window state
 */
export declare function loadWindowState(): WindowState | null;
/**
 * Clear the saved window state
 */
export declare function clearWindowState(): void;
