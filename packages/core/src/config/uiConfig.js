/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { InputFormat, OutputFormat } from '../output/types.js';
import { DEFAULT_TRUNCATE_TOOL_OUTPUT_THRESHOLD, DEFAULT_TRUNCATE_TOOL_OUTPUT_LINES, } from './constants.js';
/**
 * UI and output configuration extracted from the monolithic Config class.
 * Owns display-related settings: output format, debug mode, bare mode,
 * accessibility, truncation thresholds, and startup flags.
 *
 * This delegate is stateless — all inputs are provided at construction time.
 */
export class UiConfig {
    inputFormat;
    outputFormat;
    includePartialMessages;
    debugMode;
    bareMode;
    accessibility;
    truncateToolOutputThreshold;
    truncateToolOutputLines;
    skipLoopDetection;
    skipStartupContext;
    inputFile;
    constructor(params) {
        this.inputFormat = params.inputFormat ?? InputFormat.TEXT;
        this.outputFormat = params.outputFormat ?? OutputFormat.TEXT;
        this.includePartialMessages = params.includePartialMessages ?? false;
        this.debugMode = params.debugMode;
        this.bareMode = params.bareMode ?? false;
        this.accessibility = params.accessibility ?? {};
        this.truncateToolOutputThreshold =
            params.truncateToolOutputThreshold ??
                DEFAULT_TRUNCATE_TOOL_OUTPUT_THRESHOLD;
        this.truncateToolOutputLines =
            params.truncateToolOutputLines ?? DEFAULT_TRUNCATE_TOOL_OUTPUT_LINES;
        this.skipLoopDetection = params.skipLoopDetection ?? false;
        this.skipStartupContext = params.skipStartupContext ?? false;
        this.inputFile = params.inputFile;
    }
    getInputFormat() {
        return this.inputFormat;
    }
    getOutputFormat() {
        return this.outputFormat;
    }
    getIncludePartialMessages() {
        return this.includePartialMessages;
    }
    getDebugMode() {
        return this.debugMode;
    }
    getBareMode() {
        return this.bareMode;
    }
    getAccessibility() {
        return this.accessibility;
    }
    getScreenReader() {
        return this.accessibility.screenReader ?? false;
    }
    getTruncateToolOutputThreshold() {
        if (this.truncateToolOutputThreshold <= 0) {
            return Number.POSITIVE_INFINITY;
        }
        return this.truncateToolOutputThreshold;
    }
    getTruncateToolOutputLines() {
        if (this.truncateToolOutputLines <= 0) {
            return Number.POSITIVE_INFINITY;
        }
        return this.truncateToolOutputLines;
    }
    getSkipLoopDetection() {
        return this.skipLoopDetection;
    }
    getSkipStartupContext() {
        return this.skipStartupContext;
    }
    getInputFile() {
        return this.inputFile;
    }
}
//# sourceMappingURL=uiConfig.js.map