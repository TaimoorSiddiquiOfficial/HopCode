/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { type Stats } from 'node:fs';
export interface ReadTextRangeRequest {
    path: string;
    offset?: number;
    limit?: number;
    maxOutputBytes: number;
    signal?: AbortSignal;
    stats?: Stats;
}
export interface ReadTextRangeResult {
    content: string;
    originalLineCount: number;
    encoding?: string;
    bom?: boolean;
    lineEnding?: 'crlf' | 'lf';
    originalLineCountExact: boolean;
    truncatedByBytes: boolean;
}
export declare class LargeNonUtf8TextError extends Error {
    readonly encoding: string;
    readonly reason?: "invalid-utf8" | undefined;
    constructor(encoding: string, reason?: "invalid-utf8" | undefined);
}
export declare function readTextRange(request: ReadTextRangeRequest): Promise<ReadTextRangeResult>;
