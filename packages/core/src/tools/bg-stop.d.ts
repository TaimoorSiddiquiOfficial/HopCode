/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type { ToolInvocation, ToolResult } from './tools.js';
import { BaseDeclarativeTool } from './tools.js';
import type { Config } from '../config/config.js';
export interface BgStopParams {
    task_id: string;
    reason?: string;
}
export declare class BgStopTool extends BaseDeclarativeTool<BgStopParams, ToolResult> {
    private readonly config;
    static readonly Name: string;
    constructor(config: Config);
    protected createInvocation(params: BgStopParams): ToolInvocation<BgStopParams, ToolResult>;
}
