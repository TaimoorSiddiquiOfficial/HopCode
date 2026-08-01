/**
 * @license
 * Copyright 2025 hopcode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type { Percentiles } from './_daemon-harness.js';
export interface PlatformInfo {
    os: string;
    arch: string;
    nodeVersion: string;
}
export declare function collectPlatformInfo(): PlatformInfo;
export declare function resolveOutputDir(label: string): string;
export declare function formatPercentiles(p: Percentiles | null | undefined): string;
export declare function writeSnapshotArtifacts(outputDir: string, baseName: string, snapshot: unknown, markdown: string, logTag: string): void;
