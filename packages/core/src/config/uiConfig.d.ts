/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type { AccessibilitySettings } from './config.js';
import { InputFormat, OutputFormat } from '../output/types.js';
export interface UiConfigParams {
    inputFormat?: InputFormat;
    outputFormat?: OutputFormat;
    includePartialMessages?: boolean;
    debugMode: boolean;
    bareMode?: boolean;
    accessibility?: AccessibilitySettings;
    truncateToolOutputThreshold?: number;
    truncateToolOutputLines?: number;
    skipLoopDetection?: boolean;
    skipStartupContext?: boolean;
    inputFile?: string;
}
/**
 * UI and output configuration extracted from the monolithic Config class.
 * Owns display-related settings: output format, debug mode, bare mode,
 * accessibility, truncation thresholds, and startup flags.
 *
 * This delegate is stateless — all inputs are provided at construction time.
 */
export declare class UiConfig {
    private readonly inputFormat;
    private readonly outputFormat;
    private readonly includePartialMessages;
    private readonly debugMode;
    private readonly bareMode;
    private readonly accessibility;
    private readonly truncateToolOutputThreshold;
    private readonly truncateToolOutputLines;
    private readonly skipLoopDetection;
    private readonly skipStartupContext;
    private readonly inputFile;
    constructor(params: UiConfigParams);
    getInputFormat(): InputFormat;
    getOutputFormat(): OutputFormat;
    getIncludePartialMessages(): boolean;
    getDebugMode(): boolean;
    getBareMode(): boolean;
    getAccessibility(): AccessibilitySettings;
    getScreenReader(): boolean;
    getTruncateToolOutputThreshold(): number;
    getTruncateToolOutputLines(): number;
    getSkipLoopDetection(): boolean;
    getSkipStartupContext(): boolean;
    getInputFile(): string | undefined;
}
