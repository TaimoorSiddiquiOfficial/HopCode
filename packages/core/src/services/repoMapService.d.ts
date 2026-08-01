/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
export interface RepoMapEntry {
    /** Absolute file path */
    file: string;
    /** Exported symbol names (functions, classes, consts, types, interfaces) */
    exports: string[];
    /** PageRank score (higher = more connected / relevant) */
    rank: number;
}
export interface RepoMapResult {
    /** Top-ranked files with their exported symbols */
    entries: RepoMapEntry[];
    /** Total number of files in the graph */
    totalFiles: number;
    /** Seed files that personalized the ranking (empty = uniform PageRank) */
    seedFiles: string[];
}
export declare class RepoMapService {
    private readonly projectRoot;
    private cache;
    constructor(projectRoot: string);
    /**
     * Build or load the cached import graph.
     */
    private getGraph;
    /**
     * Get top-N most relevant files for the given seeds.
     */
    getRelevantFiles(seedFiles?: string[], topN?: number): Promise<RepoMapResult>;
    /**
     * Format a repo map result as a compact human-readable string.
     */
    static format(result: RepoMapResult, projectRoot: string): string;
    /**
     * Invalidate the in-memory cache (forces rebuild on next call).
     */
    invalidate(): void;
}
