/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
export interface CleanupResult {
    removed: number;
    errors: number;
}
export interface CleanupOptions {
    cutoffDate: Date;
    excludeSessionIds?: ReadonlySet<string>;
    removeEmptyRoot?: boolean;
}
export interface SubagentCleanupOptions extends CleanupOptions {
    /** Project-scoped subagents root: `<projectDir>/subagents/`. */
    subagentsRoot: string;
}
export declare function getCutoffDate(cleanupPeriodDays: number): Date;
export declare function cleanupOldFileHistoryBackups(opts: CleanupOptions): Promise<CleanupResult>;
export declare function cleanupOldSubagentTranscripts(opts: SubagentCleanupOptions): Promise<CleanupResult>;
