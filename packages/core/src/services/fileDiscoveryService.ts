/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */

import type { GitIgnoreFilter } from '../utils/gitIgnoreParser.js';
import type { HopCodeIgnoreFilter } from '../utils/hopCodeIgnoreParser.js';
import { GitIgnoreParser } from '../utils/gitIgnoreParser.js';
import {
  formatHopCodeIgnoreFileNames,
  HopCodeIgnoreParser,
} from '../utils/hopCodeIgnoreParser.js';
import { isGitRepository } from '../utils/gitUtils.js';
import * as path from 'node:path';

export interface FilterFilesOptions {
  respectGitIgnore?: boolean;
  respectHopCodeIgnore?: boolean;
}

export interface FilterReport {
  filteredPaths: string[];
  gitIgnoredCount: number;
  hopCodeIgnoredCount: number;
}

export class FileDiscoveryService {
  private gitIgnoreFilter: GitIgnoreFilter | null = null;
  private hopCodeIgnoreFilter: HopCodeIgnoreFilter | null = null;
  private projectRoot: string;

  constructor(
    projectRoot: string,
    private readonly customIgnoreFiles?: string[],
  ) {
    this.projectRoot = path.resolve(projectRoot);
    if (isGitRepository(this.projectRoot)) {
      this.gitIgnoreFilter = new GitIgnoreParser(this.projectRoot);
    }
    this.hopCodeIgnoreFilter = new HopCodeIgnoreParser(
      this.projectRoot,
      customIgnoreFiles,
    );
  }

  /**
   * Filters a list of file paths based on git and AI ignore rules.
   */
  filterFiles(
    filePaths: string[],
    options: FilterFilesOptions = {
      respectGitIgnore: true,
      respectHopCodeIgnore: true,
    },
  ): string[] {
    return filePaths.filter((filePath) => {
      if (options.respectGitIgnore && this.shouldGitIgnoreFile(filePath)) {
        return false;
      }
      if (
        options.respectHopCodeIgnore &&
        this.shouldHopCodeIgnoreFile(filePath)
      ) {
        return false;
      }
      return true;
    });
  }

  /**
   * Filters a list of file paths based on git ignore rules and returns a report
   * with counts of ignored files.
   */
  filterFilesWithReport(
    filePaths: string[],
    opts: FilterFilesOptions = {
      respectGitIgnore: true,
      respectHopCodeIgnore: true,
    },
  ): FilterReport {
    const filteredPaths: string[] = [];
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
  shouldGitIgnoreFile(filePath: string): boolean {
    if (this.gitIgnoreFilter) {
      return this.gitIgnoreFilter.isIgnored(filePath);
    }
    return false;
  }

  /**
   * Checks if a single file should be hopcode-ignored
   */
  shouldHopCodeIgnoreFile(filePath: string): boolean {
    if (this.hopCodeIgnoreFilter) {
      return this.hopCodeIgnoreFilter.isIgnored(filePath);
    }
    return false;
  }

  /**
   * @deprecated Use shouldHopCodeIgnoreFile instead
   */
  shouldhopcodeignoreFile(filePath: string): boolean {
    return this.shouldHopCodeIgnoreFile(filePath);
  }

  /**
   * Unified method to check if a file should be ignored based on filtering options
   */
  shouldIgnoreFile(
    filePath: string,
    options: FilterFilesOptions = {},
  ): boolean {
    const {
      respectGitIgnore = true,
      respectHopCodeIgnore: respectHopCodeIgnore = true,
    } = options;

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
  getHopCodeIgnorePatterns(): string[] {
    return this.hopCodeIgnoreFilter?.getPatterns() ?? [];
  }

  /**
   * @deprecated Use getHopCodeIgnorePatterns instead
   */
  gethopcodeignorePatterns(): string[] {
    return this.getHopCodeIgnorePatterns();
  }

  getHopCodeIgnoreFileDisplayForPath(filePath: string): string {
    return (
      this.hopCodeIgnoreFilter?.getIgnoreFileNameForPath(filePath) ??
      this.getHopCodeIgnoreFileNamesDisplay()
    );
  }

  getHopCodeIgnoreFileNamesDisplay(): string {
    return formatHopCodeIgnoreFileNames(this.customIgnoreFiles);
  }
}
