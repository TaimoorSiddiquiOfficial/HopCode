/**
 * @license
 * Copyright 2026 HopCode Team Code
 * SPDX-License-Identifier: Apache-2.0
 */
import type { InsightData } from '../types/StaticInsightTypes.js';
export declare class TemplateRenderer {
    renderInsightHTML(insights: InsightData): Promise<string>;
}
