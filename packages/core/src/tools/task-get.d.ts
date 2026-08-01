/**
 * @license
 * Copyright 2026 HopCode Team (adapted from protoCLI)
 * SPDX-License-Identifier: Apache-2.0
 */
import type { ToolInvocation, ToolResult } from './tools.js';
import { BaseDeclarativeTool } from './tools.js';
import type { Config } from '../config/config.js';
export interface TaskGetParams {
    taskId: string;
}
export declare class TaskGetTool extends BaseDeclarativeTool<TaskGetParams, ToolResult> {
    private readonly config;
    static readonly Name: string;
    constructor(config: Config);
    protected createInvocation(params: TaskGetParams): ToolInvocation<TaskGetParams, ToolResult>;
}
