/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
interface GitCommandOptions {
    cwd?: string;
}
export declare const isGitHubRepositoryAsync: (opts?: GitCommandOptions) => Promise<boolean>;
export declare const getGitRepoRootAsync: (opts?: GitCommandOptions) => Promise<string>;
export declare const isGitHubRepository: (opts?: GitCommandOptions) => boolean;
export declare const getGitRepoRoot: (opts?: GitCommandOptions) => string;
/**
 * getLatestGitHubRelease returns the release tag as a string.
 * @returns string of the release tag (e.g. "v1.2.3").
 */
export declare const getLatestGitHubRelease: (proxy?: string) => Promise<string>;
export declare function getGitHubRepoInfoAsync(opts?: GitCommandOptions): Promise<{
    owner: string;
    repo: string;
}>;
export declare function getGitHubRepoInfo(opts?: GitCommandOptions): {
    owner: string;
    repo: string;
};
export {};
