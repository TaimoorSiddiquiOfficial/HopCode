/**
 * @license
 * Copyright 2026 HopCode Team Code
 * SPDX-License-Identifier: Apache-2.0
 */
import type { InsightProgressCallback } from '../types/StaticInsightTypes.js';
import { type Config } from '@hoptrendy/hopcode-core';
export declare class StaticInsightGenerator {
    private dataProcessor;
    private templateRenderer;
    constructor(config: Config);
    private ensureOutputDirectory;
    private generateOutputPath;
    private updateInsightSymlink;
    generateStaticInsight(baseDir: string, onProgress?: InsightProgressCallback): Promise<string>;
}
