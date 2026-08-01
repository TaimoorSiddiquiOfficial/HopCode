/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { describe, expect, it } from 'vitest';
import { collectToolCallIdsFromHistory, dedupeToolCallsById, getProviderToolCallId, normalizeModelToolCallIds, reserveModelToolCallId, } from './toolCallIdUtils.js';
describe('toolCallIdUtils', () => {
    it('suffixes cross-turn duplicate ids and drops same-turn replays', () => {
        const history = [
            {
                role: 'model',
                parts: [
                    {
                        functionCall: {
                            id: 'dup_id_0001',
                            name: 'read_file',
                            args: { file_path: 'a.ts' },
                        },
                    },
                ],
            },
            {
                role: 'user',
                parts: [
                    {
                        functionResponse: {
                            id: 'dup_id_0001',
                            name: 'read_file',
                            response: { output: 'A' },
                        },
                    },
                ],
            },
        ];
        const seenIds = collectToolCallIdsFromHistory(history);
        const turnRawIds = new Set();
        const parts = [
            {
                functionCall: {
                    id: 'dup_id_0001',
                    name: 'read_file',
                    args: { file_path: 'b.ts' },
                },
            },
            {
                functionCall: {
                    id: 'dup_id_0001',
                    name: 'read_file',
                    args: { file_path: 'b.ts' },
                },
            },
            { text: 'done' },
        ];
        const normalized = normalizeModelToolCallIds(parts, seenIds, turnRawIds);
        expect(normalized).toEqual([
            {
                functionCall: {
                    id: 'dup_id_0001__hopcode_dup_2',
                    name: 'read_file',
                    args: { file_path: 'b.ts' },
                },
            },
            { text: 'done' },
        ]);
        expect(getProviderToolCallId(normalized[0].functionCall)).toBe('dup_id_0001');
        expect(seenIds.has('dup_id_0001__hopcode_dup_2')).toBe(true);
    });
    it('generates stable non-empty ids for missing functionCall ids', () => {
        const seenIds = new Set(['call_hopcode_1']);
        const normalized = normalizeModelToolCallIds([
            { functionCall: { name: 'first', args: {} } },
            { functionCall: { name: 'second', args: {} } },
        ], seenIds, new Set());
        expect(normalized.map((part) => part.functionCall?.id)).toEqual([
            'call_hopcode_2',
            'call_hopcode_3',
        ]);
        expect(normalized.map((part) => getProviderToolCallId(part.functionCall))).toEqual([undefined, undefined]);
    });
    it('reserves a fresh model tool call id', () => {
        const usedIds = new Set();
        const reservedIds = new Map();
        expect(reserveModelToolCallId('call-1', usedIds, reservedIds)).toBe('call-1');
        expect(reservedIds.get('call-1')).toBe('call-1');
        expect(usedIds.has('call-1')).toBe(true);
    });
    it('returns the same id when reserving a raw id repeatedly', () => {
        const usedIds = new Set(['call-1']);
        const reservedIds = new Map();
        const first = reserveModelToolCallId('call-1', usedIds, reservedIds);
        const second = reserveModelToolCallId('call-1', usedIds, reservedIds);
        expect(first).toBe('call-1__qwen_dup_2');
        expect(second).toBe(first);
        expect([...usedIds]).toEqual(['call-1', 'call-1__qwen_dup_2']);
    });
    it('normalizes a colliding raw id to its reserved suffixed id', () => {
        const usedIds = new Set(['call-1']);
        const reservedIds = new Map();
        const reservedId = reserveModelToolCallId('call-1', usedIds, reservedIds);
        const normalized = normalizeModelToolCallIds([
            {
                functionCall: { id: 'call-1', name: 'read_file', args: {} },
            },
        ], usedIds, new Set(), reservedIds);
        expect(reservedId).toBe('call-1__qwen_dup_2');
        expect(normalized[0]?.functionCall?.id).toBe(reservedId);
        expect(getProviderToolCallId(normalized[0].functionCall)).toBe('call-1');
    });
    it('deduplicates direct function call batches by id', () => {
        const calls = [
            { id: 'call_1', name: 'read_file', args: { file_path: 'a.ts' } },
            { id: 'call_1', name: 'read_file', args: { file_path: 'a.ts' } },
            { id: 'call_2', name: 'read_file', args: { file_path: 'b.ts' } },
            { name: 'missing_id', args: {} },
            { name: 'missing_id_again', args: {} },
        ];
        expect(dedupeToolCallsById(calls)).toEqual([
            calls[0],
            calls[2],
            calls[3],
            calls[4],
        ]);
    });
});
//# sourceMappingURL=toolCallIdUtils.test.js.map