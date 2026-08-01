/**
 * @license
 * Copyright 2025 Qwen Team
 * SPDX-License-Identifier: Apache-2.0
 */
export type TranscriptRecordType = 'user' | 'assistant' | 'tool_result' | 'system';
export interface TranscriptProjectionDiagnostic {
    readonly code: string;
    readonly severity: 'info' | 'warning' | 'error';
    readonly message: string;
    readonly affectsCompleteness: boolean;
    readonly recordIndex?: number;
    readonly recordId?: string;
    readonly path?: string;
}
export interface TranscriptRecordInput {
    readonly uuid: string;
    readonly parentUuid: string | null;
    readonly sessionId: string;
    readonly timestamp?: string;
    readonly type: TranscriptRecordType;
    readonly subtype?: string;
    readonly message?: {
        readonly role?: string;
        readonly parts?: readonly unknown[];
    };
    readonly model?: unknown;
    readonly usageMetadata?: unknown;
    readonly toolCallResult?: unknown;
    readonly systemPayload?: unknown;
}
export interface TranscriptReplayGapInput {
    readonly childUuid: string;
    readonly missingParentUuid: string;
}
export interface PreparedTranscriptRecords {
    readonly sessionId?: string;
    readonly records: readonly TranscriptRecordInput[];
    readonly gaps: readonly TranscriptReplayGapInput[];
    readonly diagnostics: readonly TranscriptProjectionDiagnostic[];
}
export type TranscriptRecordPreparationErrorCode = 'invalid_records' | 'leaf_not_found' | 'mixed_session_ids';
export declare class TranscriptRecordPreparationError extends TypeError {
    readonly code: TranscriptRecordPreparationErrorCode;
    constructor(code: TranscriptRecordPreparationErrorCode, message: string);
}
export interface PrepareTranscriptRecordsOptions {
    readonly leafUuid?: string;
}
export interface TranscriptUuidChainResult {
    readonly uuids: readonly string[];
    readonly gaps: readonly TranscriptReplayGapInput[];
    readonly cycleUuid?: string;
}
export declare function isTranscriptConversationRecord(record: Pick<TranscriptRecordInput, 'type' | 'subtype'>): boolean;
export declare function isTranscriptArtifactRecord(record: {
    readonly type?: unknown;
    readonly subtype?: unknown;
}): boolean;
export declare function validateTranscriptRecord(value: unknown, recordIndex?: number): {
    readonly record?: TranscriptRecordInput;
    readonly diagnostics: readonly TranscriptProjectionDiagnostic[];
};
export declare function selectTranscriptLeaf(records: readonly TranscriptRecordInput[], leafUuid?: string): string | undefined;
export declare function walkTranscriptUuidChain(leafUuid: string, lookup: (uuid: string) => TranscriptRecordInput | undefined): TranscriptUuidChainResult;
export declare function aggregateTranscriptRecordFragments<T extends TranscriptRecordInput>(records: readonly T[]): T;
export declare function prepareTranscriptRecords(values: readonly unknown[], options?: PrepareTranscriptRecordsOptions): PreparedTranscriptRecords;
