/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import type { AccessibilitySettings } from './config.js';
import { InputFormat, OutputFormat } from '../output/types.js';
import {
  DEFAULT_TRUNCATE_TOOL_OUTPUT_THRESHOLD,
  DEFAULT_TRUNCATE_TOOL_OUTPUT_LINES,
} from './constants.js';

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
export class UiConfig {
  private readonly inputFormat: InputFormat;
  private readonly outputFormat: OutputFormat;
  private readonly includePartialMessages: boolean;
  private readonly debugMode: boolean;
  private readonly bareMode: boolean;
  private readonly accessibility: AccessibilitySettings;
  private readonly truncateToolOutputThreshold: number;
  private readonly truncateToolOutputLines: number;
  private readonly skipLoopDetection: boolean;
  private readonly skipStartupContext: boolean;
  private readonly inputFile: string | undefined;

  constructor(params: UiConfigParams) {
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

  getInputFormat(): InputFormat {
    return this.inputFormat;
  }

  getOutputFormat(): OutputFormat {
    return this.outputFormat;
  }

  getIncludePartialMessages(): boolean {
    return this.includePartialMessages;
  }

  getDebugMode(): boolean {
    return this.debugMode;
  }

  getBareMode(): boolean {
    return this.bareMode;
  }

  getAccessibility(): AccessibilitySettings {
    return this.accessibility;
  }

  getScreenReader(): boolean {
    return this.accessibility.screenReader ?? false;
  }

  getTruncateToolOutputThreshold(): number {
    if (this.truncateToolOutputThreshold <= 0) {
      return Number.POSITIVE_INFINITY;
    }
    return this.truncateToolOutputThreshold;
  }

  getTruncateToolOutputLines(): number {
    if (this.truncateToolOutputLines <= 0) {
      return Number.POSITIVE_INFINITY;
    }
    return this.truncateToolOutputLines;
  }

  getSkipLoopDetection(): boolean {
    return this.skipLoopDetection;
  }

  getSkipStartupContext(): boolean {
    return this.skipStartupContext;
  }

  getInputFile(): string | undefined {
    return this.inputFile;
  }
}
