/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { GitIgnoreParser } from '../utils/gitIgnoreParser.js';
import { formatHopCodeIgnoreFileNames, HopCodeIgnoreParser, } from '../utils/hopCodeIgnoreParser.js';
import { isGitRepository } from '../utils/gitUtils.js';
import * as path from 'node:path';
export class FileDiscoveryService {
    customIgnoreFiles;
    gitIgnoreFilter = null;
    hopCodeIgnoreFilter = null;
    projectRoot;
    constructor(projectRoot, customIgnoreFiles) {
        this.customIgnoreFiles = customIgnoreFiles;
        this.projectRoot = path.resolve(projectRoot);
        if (isGitRepository(this.projectRoot)) {
            this.gitIgnoreFilter = new GitIgnoreParser(this.projectRoot);
        }
        this.hopCodeIgnoreFilter = new HopCodeIgnoreParser(this.projectRoot, customIgnoreFiles);
    }
    /**
     * Filters a list of file paths based on git and AI ignore rules.
     */
    filterFiles(filePaths, options = {
        respectGitIgnore: true,
        respectHopCodeIgnore: true,
    }) {
        return filePaths.filter((filePath) => {
            if (options.respectGitIgnore && this.shouldGitIgnoreFile(filePath)) {
                return false;
            }
            if (options.respectHopCodeIgnore &&
                this.shouldHopCodeIgnoreFile(filePath)) {
                return false;
            }
            return true;
        });
    }
    /**
     * Filters a list of file paths based on git ignore rules and returns a report
     * with counts of ignored files.
     */
    filterFilesWithReport(filePaths, opts = {
        respectGitIgnore: true,
        respectHopCodeIgnore: true,
    }) {
        const filteredPaths = [];
        let gitIgnoredCount = 0;
        let hopCodeIgnoredCount = 0;
        for (const filePath of filePaths) {
            if (opts.respectGitIgnore && this.shouldGitIgnoreFile(filePath)) {
                gitIgnoredCount++;
                continue;
            }
            if (opts.respectHopCodeIgnore && this.shouldHopCodeIgnoreFile(filePath)) {
                hopCodeIgnoredCount++;
                continue;
            }
            filteredPaths.push(filePath);
        }
        return {
            filteredPaths,
            gitIgnoredCount,
            hopCodeIgnoredCount,
        };
    }
    /**
     * Checks if a single file should be git-ignored
     */
    shouldGitIgnoreFile(filePath) {
        if (this.gitIgnoreFilter) {
            return this.gitIgnoreFilter.isIgnored(filePath);
        }
        return false;
    }
    /**
     * Checks if a single file should be hopcode-ignored
     */
    shouldHopCodeIgnoreFile(filePath) {
        if (this.hopCodeIgnoreFilter) {
            return this.hopCodeIgnoreFilter.isIgnored(filePath);
        }
        return false;
    }
    /**
     * @deprecated Use shouldHopCodeIgnoreFile instead
     */
    shouldhopcodeignoreFile(filePath) {
        return this.shouldHopCodeIgnoreFile(filePath);
    }
    /**
     * Unified method to check if a file should be ignored based on filtering options
     */
    shouldIgnoreFile(filePath, options = {}) {
        const { respectGitIgnore = true, respectHopCodeIgnore: respectHopCodeIgnore = true, } = options;
        if (respectGitIgnore && this.shouldGitIgnoreFile(filePath)) {
            return true;
        }
        if (respectHopCodeIgnore && this.shouldHopCodeIgnoreFile(filePath)) {
            return true;
        }
        return false;
    }
    /**
     * Returns loaded patterns from .hopcodeignore
     */
    getHopCodeIgnorePatterns() {
        return this.hopCodeIgnoreFilter?.getPatterns() ?? [];
    }
    /**
     * @deprecated Use getHopCodeIgnorePatterns instead
     */
    gethopcodeignorePatterns() {
        return this.getHopCodeIgnorePatterns();
    }
    getHopCodeIgnoreFileDisplayForPath(filePath) {
        return (this.hopCodeIgnoreFilter?.getIgnoreFileNameForPath(filePath) ??
            this.getHopCodeIgnoreFileNamesDisplay());
    }
    getHopCodeIgnoreFileNamesDisplay() {
        return formatHopCodeIgnoreFileNames(this.customIgnoreFiles);
    }
}
//# sourceMappingURL=fileDiscoveryService.js.map