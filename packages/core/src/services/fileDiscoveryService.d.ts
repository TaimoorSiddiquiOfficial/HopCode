/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
export interface FilterFilesOptions {
    respectGitIgnore?: boolean;
    respectHopCodeIgnore?: boolean;
}
export interface FilterReport {
    filteredPaths: string[];
    gitIgnoredCount: number;
    hopCodeIgnoredCount: number;
}
export declare class FileDiscoveryService {
    private readonly customIgnoreFiles?;
    private gitIgnoreFilter;
    private hopCodeIgnoreFilter;
    private projectRoot;
    constructor(projectRoot: string, customIgnoreFiles?: string[] | undefined);
    /**
     * Filters a list of file paths based on git and AI ignore rules.
     */
    filterFiles(filePaths: string[], options?: FilterFilesOptions): string[];
    /**
     * Filters a list of file paths based on git ignore rules and returns a report
     * with counts of ignored files.
     */
    filterFilesWithReport(filePaths: string[], opts?: FilterFilesOptions): FilterReport;
    /**
     * Checks if a single file should be git-ignored
     */
    shouldGitIgnoreFile(filePath: string): boolean;
    /**
     * Checks if a single file should be hopcode-ignored
     */
    shouldHopCodeIgnoreFile(filePath: string): boolean;
    /**
     * @deprecated Use shouldHopCodeIgnoreFile instead
     */
    shouldhopcodeignoreFile(filePath: string): boolean;
    /**
     * Unified method to check if a file should be ignored based on filtering options
     */
    shouldIgnoreFile(filePath: string, options?: FilterFilesOptions): boolean;
    /**
     * Returns loaded patterns from .hopcodeignore
     */
    getHopCodeIgnorePatterns(): string[];
    /**
     * @deprecated Use getHopCodeIgnorePatterns instead
     */
    gethopcodeignorePatterns(): string[];
    getHopCodeIgnoreFileDisplayForPath(filePath: string): string;
    getHopCodeIgnoreFileNamesDisplay(): string;
}
