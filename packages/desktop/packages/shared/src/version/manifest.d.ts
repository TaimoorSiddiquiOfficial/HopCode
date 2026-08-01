export declare function getLatestVersion(): Promise<string | null>;
export declare function getManifest(version: string): Promise<VersionManifest | null>;
export interface BinaryInfo {
    url: string;
    sha256: string;
    size: number;
    filename?: string;
}
export interface VersionManifest {
    version: string;
    build_time: string;
    build_timestamp: number;
    binaries: Record<string, BinaryInfo>;
}
