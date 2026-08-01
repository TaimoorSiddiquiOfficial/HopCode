/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
export declare const DEFAULT_HOPCODE_CUSTOM_IGNORE_FILE_NAMES: readonly [".agentignore", ".aiignore"];
export declare function normalizeHopCodeCustomIgnoreFileNames(ignoreFileNames?: readonly string[]): string[];
export declare function getHopCodeIgnoreFileNames(customIgnoreFileNames?: readonly string[]): string[];
export declare function formatHopCodeIgnoreFileNames(customIgnoreFileNames?: readonly string[]): string;
export interface HopCodeIgnoreFilter {
    isIgnored(filePath: string): boolean;
    getIgnoreFileNameForPath(filePath: string): string | undefined;
    getPatterns(): string[];
}
export declare class HopCodeIgnoreParser implements HopCodeIgnoreFilter {
    private projectRoot;
    private patterns;
    private readonly ignoreFileNames;
    private readonly sourceIgnorers;
    constructor(projectRoot: string, customIgnoreFileNames?: readonly string[]);
    private loadPatterns;
    isIgnored(filePath: string): boolean;
    getIgnoreFileNameForPath(filePath: string): string | undefined;
    private normalizePathForIgnore;
    getPatterns(): string[];
    getIgnoreFileNames(): string[];
}
