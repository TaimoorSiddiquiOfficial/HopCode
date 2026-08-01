/**
 * Power Manager - Prevents screen sleep while sessions are running
 *
 * Uses Electron's powerSaveBlocker API to prevent the display from sleeping
 * when the "Keep screen awake" setting is enabled and at least one session
 * is actively processing.
 */
/**
 * Initialize the power manager by loading the current setting.
 * Call this on app startup.
 */
export declare function initPowerManager(): Promise<void>;
/**
 * Called when a session starts processing.
 */
export declare function onSessionStarted(): void;
/**
 * Called when a session stops processing (complete, error, or cancelled).
 */
export declare function onSessionStopped(): void;
/**
 * Update the keep awake setting.
 * Called from IPC handler when user toggles the setting.
 */
export declare function setKeepAwakeSetting(enabled: boolean): void;
/**
 * Get the current keep awake setting value.
 */
export declare function getKeepAwakeSetting(): boolean;
/**
 * Check if power blocker is currently active.
 * Useful for debugging.
 */
export declare function isPowerBlockerActive(): boolean;
/**
 * Clean up power blocker on app quit.
 * Note: Electron automatically releases blockers on quit, but this is explicit.
 */
export declare function cleanup(): void;
