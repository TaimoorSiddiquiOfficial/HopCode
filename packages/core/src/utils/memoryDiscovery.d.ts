/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import type { FileDiscoveryService } from '../services/fileDiscoveryService.js';
import { type RuleFile } from './rulesDiscovery.js';
import type { InstructionLoadReason, InstructionMemoryType } from '../hooks/types.js';
export interface InstructionsLoadedNotification {
    filePath: string;
    memoryType: InstructionMemoryType;
    loadReason: InstructionLoadReason;
    triggerFilePath?: string;
    parentFilePath?: string;
}
export interface LoadServerHierarchicalMemoryResponse {
    memoryContent: string;
    fileCount: number;
    /** Number of baseline rules injected at session start. */
    ruleCount: number;
    /** Conditional rules (with `paths:`) for turn-level lazy injection. */
    conditionalRules: RuleFile[];
    /** Effective project root used for glob matching. */
    projectRoot: string;
}
export interface LoadServerHierarchicalMemoryOptions {
    explicitOnly?: boolean;
    loadReason?: Exclude<InstructionLoadReason, 'include'>;
    onInstructionsLoaded?: (notification: InstructionsLoadedNotification) => void | Promise<void>;
}
/**
 * Loads hierarchical HOPCODE.md files and concatenates their content.
 * Also loads path-based context rules from `.hopcode/rules/` directories.
 * This function is intended for use by the server.
 *
 * @param contextRuleExcludes - Glob patterns to skip when loading rules.
 */
export declare function loadServerHierarchicalMemory(currentWorkingDirectory: string, includeDirectoriesToReadGemini: readonly string[], fileService: FileDiscoveryService, extensionContextFilePaths: string[] | undefined, folderTrust: boolean, importFormat?: 'flat' | 'tree', contextRuleExcludes?: string[], options?: LoadServerHierarchicalMemoryOptions): Promise<LoadServerHierarchicalMemoryResponse>;
