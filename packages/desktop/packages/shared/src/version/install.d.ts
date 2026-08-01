export declare function downloadArchive(params: {
    url: string;
    sha256: string;
}): Promise<ArrayBuffer | null>;
export declare function ensureDirectory(path: string): Promise<void>;
export declare function installArchive(params: {
    archiveData: ArrayBuffer;
    version: string;
}): Promise<void>;
export declare function install(version: string | null): Promise<VersionInstallResult>;
type VersionInstallResult = {
    success: true;
} | {
    success: false;
    error: string;
};
/**
 * Check for updates and install in the background if available.
 * This runs silently - no user confirmation needed.
 * Logs are only visible with --debug flag.
 * Skips when running locally (version 0.0.1).
 */
export declare function checkAndUpdate(): Promise<void>;
export {};
