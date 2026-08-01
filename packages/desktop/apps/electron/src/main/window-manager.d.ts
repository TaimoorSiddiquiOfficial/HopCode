import { BrowserWindow } from 'electron';
import type { SavedWindow } from './window-state';
interface ManagedWindow {
    window: BrowserWindow;
    workspaceId: string;
}
export interface CreateWindowOptions {
    /** The workspace to open (empty string for onboarding) */
    workspaceId: string;
    /** Whether to open in focused mode (smaller window, no sidebars) */
    focused?: boolean;
    /** Deep link URL to navigate to after window loads (without ?window= param) */
    initialDeepLink?: string;
    /** Full URL to restore from saved state (preserves route/query params) */
    restoreUrl?: string;
}
export declare class WindowManager {
    private windows;
    private petWindow;
    private petWorkspaceId;
    private focusedModeWindows;
    private pendingCloseTimeouts;
    private eventSink;
    private clientResolver;
    private keyboardCloseIntents;
    private keyboardCloseIntentTimeouts;
    private isAppQuitting;
    /**
     * Set the event sink and client resolver for pushing events via the RPC server
     * instead of webContents.send. Called after server creation.
     */
    setRpcEventSink(sink: (channel: string, target: import('@craft-agent/shared/protocol').PushTarget, ...args: any[]) => void, resolver: (wcId: number) => string | undefined): void;
    /** Return current RPC event sink, if transport has been initialized. */
    getRpcEventSink(): ((channel: string, target: import('@craft-agent/shared/protocol').PushTarget, ...args: any[]) => void) | null;
    /** Resolve a window's current clientId from transport handshake state. */
    getClientIdForWindow(webContentsId: number): string | undefined;
    /** Push an event to a specific window via the RPC event sink. Falls back to webContents.send. */
    private pushToWindow;
    /**
     * Create a new window for a workspace
     * @param options - Window creation options
     */
    createWindow(options: CreateWindowOptions): BrowserWindow;
    /**
     * Get window by webContents.id (used by IPC handlers instead of BrowserWindow.fromId)
     */
    getWindowByWebContentsId(wcId: number): BrowserWindow | null;
    /**
     * Get window by workspace ID (returns first match - for backwards compatibility)
     */
    getWindowByWorkspace(workspaceId: string): BrowserWindow | null;
    /**
     * Get ALL windows for a workspace (main window + tab content windows)
     * Used for broadcasting events to all windows showing the same workspace
     */
    getAllWindowsForWorkspace(workspaceId: string): BrowserWindow[];
    /**
     * Get workspace ID for a window (by webContents.id)
     */
    getWorkspaceForWindow(webContentsId: number): string | null;
    /**
     * Mark whether the app is in quit flow.
     * When true, window close events bypass layered close interception.
     */
    setAppQuitting(isQuitting: boolean): void;
    /**
     * Close window by webContents.id (triggers close event which may be intercepted)
     */
    closeWindow(webContentsId: number): void;
    /**
     * Force close window by webContents.id (bypasses close event interception).
     * Used when renderer confirms the close action (no modals to close).
     */
    forceCloseWindow(webContentsId: number): void;
    /**
     * Cancel a pending close request (renderer handled it by closing a modal/panel).
     * Clears the fallback timeout so the window stays open.
     */
    cancelPendingClose(webContentsId: number): void;
    /**
     * Close window for a specific workspace
     */
    closeWindowForWorkspace(workspaceId: string): void;
    /**
     * Update the workspace ID for an existing window (for in-window switching)
     * @param webContentsId - The webContents.id of the window
     * @param workspaceId - The new workspace ID
     * @returns true if window was found and updated, false otherwise
     */
    updateWindowWorkspace(webContentsId: number, workspaceId: string): boolean;
    /**
     * Register an existing window with a workspace ID
     * Used for re-registration when window mapping is lost (e.g., after refresh)
     * @param window - The BrowserWindow to register
     * @param workspaceId - The workspace ID to associate with
     */
    registerWindow(window: BrowserWindow, workspaceId: string): void;
    /** The live pet window, or null. */
    getPetWindow(): BrowserWindow | null;
    /** Toggle click-through on the pet window (called as the cursor enters/leaves the pet). */
    setPetWindowIgnoreMouse(ignore: boolean): void;
    /**
     * Show/hide the floating pet window. When already shown, reloads it so a
     * newly-selected pet takes effect. The pet window is intentionally NOT a
     * managed workspace window (excluded from state persistence + quit logic).
     */
    setPetWindowEnabled(enabled: boolean, workspaceId: string): void;
    private loadPetWindow;
    private defaultPetPosition;
    private createPetWindow;
    /**
     * Get all managed windows
     */
    getAllWindows(): ManagedWindow[];
    /**
     * Focus existing window for workspace or create new one
     */
    focusOrCreateWindow(workspaceId: string): BrowserWindow;
    /**
     * Get window states for persistence (includes bounds and focused mode)
     * Used by window-state.ts to save/restore windows
     */
    getWindowStates(): SavedWindow[];
    /**
     * Check if any windows are open
     */
    hasWindows(): boolean;
    /**
     * Get the currently focused window
     */
    getFocusedWindow(): BrowserWindow | null;
    /**
     * Get the last active window (most recently used)
     * Falls back to any available window if none focused
     */
    getLastActiveWindow(): BrowserWindow | null;
    /**
     * Show or hide macOS traffic light buttons (close/minimize/maximize).
     * Used to hide them when fullscreen overlays are open to prevent accidental clicks.
     * No-op on non-macOS platforms.
     */
    setTrafficLightsVisible(webContentsId: number, visible: boolean): void;
}
export {};
