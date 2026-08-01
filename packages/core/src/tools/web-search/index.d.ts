/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { BaseDeclarativeTool, type ToolInvocation } from '../tools.js';
import type { WebSearchToolParams, WebSearchToolResult, WebSearchConfig } from './types.js';
/**
 * A tool to perform web searches using configurable providers.
 */
export declare class WebSearchTool extends BaseDeclarativeTool<WebSearchToolParams, WebSearchToolResult> {
    private readonly webSearchConfig;
    private readonly authType;
    static readonly Name: string;
    constructor(webSearchConfig: WebSearchConfig | undefined, authType: string | undefined);
    /**
     * Validates the parameters for the WebSearchTool.
     * @param params The parameters to validate
     * @returns An error message string if validation fails, null if valid
     */
    protected validateToolParamValues(params: WebSearchToolParams): string | null;
    protected createInvocation(params: WebSearchToolParams): ToolInvocation<WebSearchToolParams, WebSearchToolResult>;
}
export type { WebSearchToolParams, WebSearchToolResult, WebSearchConfig, WebSearchProviderConfig, } from './types.js';
