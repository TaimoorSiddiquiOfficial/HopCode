/**
 * Auto-update module using electron-updater
 *
 * Auto-update is enabled only for packaged builds whose active brand declares
 * a brand-owned update source. Development builds keep the same public API but
 * skip network update checks.
 *
 * Platform behavior:
 * - macOS: Downloads zip, extracts and swaps app bundle atomically
 * - Windows: Downloads NSIS installer, runs silently on quit
 * - Linux: Downloads AppImage, replaces current file
 *
 * All platforms support download-progress events (electron-updater v6.8.0+).
 * quitAndInstall() handles restart natively — no external scripts.
 */
import { type UpdateInfo } from '../shared/types';
import type { EventSink } from '@craft-agent/server-core/transport';
/**
 * Check if an update installation is in progress.
 * Used by main process to avoid force-quitting during update.
 */
export declare function isUpdating(): boolean;
/**
 * Set the event sink for broadcasting update events to renderer windows
 */
export declare function setAutoUpdateEventSink(sink: EventSink): void;
/**
 * Get current update info (called by IPC handler)
 */
export declare function getUpdateInfo(): UpdateInfo;
/**
 * Options for checkForUpdates
 */
interface CheckOptions {
    /** If true, automatically start download when update is found (default: true) */
    autoDownload?: boolean;
}
/**
 * Check for available updates.
 * Returns the current UpdateInfo state after check completes.
 *
 * @param options.autoDownload - If false, only checks without downloading (for manual "Check Now")
 */
export declare function checkForUpdates(options?: CheckOptions): Promise<UpdateInfo>;
/**
 * Install the downloaded update and restart the app.
 * Calls electron-updater's quitAndInstall which handles:
 * - macOS: Extracts zip and swaps app bundle
 * - Windows: Runs NSIS installer silently
 * - Linux: Replaces AppImage file
 * Then relaunches the app automatically.
 */
export declare function installUpdate(): Promise<void>;
/**
 * Result of update check on launch
 */
export interface UpdateOnLaunchResult {
    action: 'none' | 'skipped' | 'ready' | 'downloading';
    reason?: string;
    version?: string | null;
}
/**
 * Check for updates on app launch.
 * - Checks immediately (no delay)
 * - Respects dismissed version (skips notification but allows manual check)
 * - Auto-downloads if update available
 */
export declare function checkForUpdatesOnLaunch(): Promise<UpdateOnLaunchResult>;
export {};
