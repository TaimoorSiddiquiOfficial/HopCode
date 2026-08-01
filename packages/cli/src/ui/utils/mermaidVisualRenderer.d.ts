/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
interface MermaidVisualResult {
    title: string;
    lines: string[];
    warning?: string;
}
export declare function renderMermaidVisual(source: string, contentWidth: number): MermaidVisualResult;
export {};
