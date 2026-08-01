/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type { DaemonToolPreview } from './types.js';
export declare function createDaemonToolPreview(input: unknown, opts?: {
    title?: string;
    toolName?: string;
    toolKind?: string;
}, depth?: number): DaemonToolPreview;
