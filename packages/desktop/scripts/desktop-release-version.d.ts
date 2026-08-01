export interface PackageVersionSource {
    label: string;
    path: string;
}
export interface NormalizedReleaseVersion {
    tag: string;
    version: string;
}
type PackageJson = Record<string, unknown>;
export declare const desktopReleasePackageSources: PackageVersionSource[];
export declare function normalizeReleaseVersion(input: string): NormalizedReleaseVersion;
export declare function readPackageJson(path: string): PackageJson;
export declare function readPackageVersion(path: string): string;
export declare function writePackageVersion(path: string, version: string): void;
export {};
