import type { UpdateInfo } from '../../shared/types';
interface UseUpdateCheckerResult {
    /** Current update info */
    updateInfo: UpdateInfo | null;
    /** Whether an update is available */
    updateAvailable: boolean;
    /** Whether update is currently downloading */
    isDownloading: boolean;
    /** Whether update is ready to install */
    isReadyToInstall: boolean;
    /** Whether a manual update check is running */
    isChecking: boolean;
    /** Download progress (0-100) */
    downloadProgress: number;
    /** Check for updates manually */
    checkForUpdates: () => Promise<void>;
    /** Install the downloaded update and restart */
    installUpdate: () => Promise<void>;
}
export declare function useUpdateChecker(): UseUpdateCheckerResult;
export {};
