/**
 * @license
 * Copyright 2026 HopCode Team (adapted from protoCLI)
 * SPDX-License-Identifier: Apache-2.0
 */
import type { ToolInvocation, ToolResult } from './tools.js';
import { BaseDeclarativeTool } from './tools.js';
import type { Config } from '../config/config.js';
export interface TaskOutputParams {
    taskId: string;
    output: string;
}
export declare class TaskOutputTool extends BaseDeclarativeTool<TaskOutputParams, ToolResult> {
    private readonly config;
    static readonly Name: string;
    constructor(config: Config);
    protected createInvocation(params: TaskOutputParams): ToolInvocation<TaskOutputParams, ToolResult>;
}
