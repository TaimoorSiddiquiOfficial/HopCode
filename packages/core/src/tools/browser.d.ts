/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type { ToolInvocation, ToolResult } from './tools.js';
import { BaseDeclarativeTool } from './tools.js';
import type { Config } from '../config/config.js';
export declare const BROWSER_ACTIONS: readonly ["navigate", "click", "fill", "screenshot", "snapshot", "wait", "close"];
export type BrowserAction = (typeof BROWSER_ACTIONS)[number];
export interface BrowserToolParams {
    /** The action to perform */
    action: BrowserAction;
    /** URL for navigate action */
    url?: string;
    /** CSS selector for click/fill/wait actions */
    selector?: string;
    /** Text value for fill action */
    value?: string;
    /** Session ID (returned by previous navigate call, or omit for first call) */
    sessionId?: string;
    /** Run browser in headed mode (default: false / headless) */
    headed?: boolean;
}
/**
 * BrowserTool -- automate web browser interactions via Playwright.
 *
 * Supports navigate, click, fill, screenshot, snapshot, and wait actions.
 * Sessions are automatically created on first navigate and persist across
 * calls via sessionId. Close the session with the 'close' action.
 */
export declare class BrowserTool extends BaseDeclarativeTool<BrowserToolParams, ToolResult> {
    private readonly config;
    static readonly Name: "browser";
    constructor(config: Config);
    protected createInvocation(params: BrowserToolParams): ToolInvocation<BrowserToolParams, ToolResult>;
}
