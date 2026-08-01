/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type { ToolInvocation, ToolResult } from './tools.js';
import { BaseDeclarativeTool } from './tools.js';
import type { Config } from '../config/config.js';
export interface RepoMapToolParams {
    /**
     * Absolute paths to files relevant to the current task (seeds for personalized
     * PageRank). Leave empty to get the globally most-connected files.
     */
    seedFiles?: string[];
    /**
     * Maximum number of files to return. Defaults to 20.
     */
    topN?: number;
}
/**
 * RepoMapTool -- get a PageRank-ranked view of the most relevant files in the
 * codebase relative to a set of seed files.
 *
 * Uses import-graph analysis to surface the files most likely to be relevant
 * for a task, without requiring the agent to read every file in the repo.
 */
export declare class RepoMapTool extends BaseDeclarativeTool<RepoMapToolParams, ToolResult> {
    private readonly config;
    static readonly Name: "repo_map";
    constructor(config: Config);
    protected createInvocation(params: RepoMapToolParams): ToolInvocation<RepoMapToolParams, ToolResult>;
}
