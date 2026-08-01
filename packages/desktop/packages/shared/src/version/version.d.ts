export declare function getCurrentVersion(): string;
export declare function isUpToDate(): Promise<boolean>;
/**
 * Returns the latest version or null if the app is up to date
 */
export declare function getUpdateToVersion(): Promise<string | null>;
