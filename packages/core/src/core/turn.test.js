/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { CompressionStatus, Turn, GeminiEventType, findRepeatedDuplicateProviderToolCall, } from './turn.js';
import { reportError } from '../utils/errorReporting.js';
import { StreamEventType } from './geminiChat.js';
import { normalizeModelToolCallIds } from './toolCallIdUtils.js';
import { createOpenAIReasoningThoughtPart } from '../utils/thoughtUtils.js';
const mockSendMessageStream = vi.fn();
const mockGetHistory = vi.fn();
const mockGetHistoryLength = vi.fn();
const mockGetHistoryTailShallow = vi.fn();
const mockMaybeIncludeSchemaDepthContext = vi.fn();
vi.mock('@google/genai', async (importOriginal) => {
    const actual = await importOriginal();
    const MockChat = vi.fn().mockImplementation(() => ({
        sendMessageStream: mockSendMessageStream,
        getHistory: mockGetHistory,
        getHistoryLength: mockGetHistoryLength,
        getHistoryTailShallow: mockGetHistoryTailShallow,
        maybeIncludeSchemaDepthContext: mockMaybeIncludeSchemaDepthContext,
    }));
    return {
        ...actual,
        Chat: MockChat,
    };
});
vi.mock('../utils/errorReporting', () => ({
    reportError: vi.fn(),
}));
describe('findRepeatedDuplicateProviderToolCall', () => {
    const getProviderCallId = (item) => item.providerCallId;
    it('finds a handled provider id that already received a synthetic response', () => {
        const items = [{ providerCallId: 'fresh' }, { providerCallId: 'handled' }];
        expect(findRepeatedDuplicateProviderToolCall(items, getProviderCallId, new Set(['handled']), new Set(['handled']))).toBe(items[1]);
    });
    it('finds a handled provider id repeated within the same batch', () => {
        const items = [
            { providerCallId: 'handled' },
            { providerCallId: 'fresh' },
            { providerCallId: 'handled' },
        ];
        expect(findRepeatedDuplicateProviderToolCall(items, getProviderCallId, new Set(['handled']), new Set())).toBe(items[0]);
    });
    it('ignores unhandled repeated ids', () => {
        const items = [{ providerCallId: 'fresh' }, { providerCallId: 'fresh' }];
        expect(findRepeatedDuplicateProviderToolCall(items, getProviderCallId, new Set(['handled']), new Set())).toBeUndefined();
    });
});
describe('Turn', () => {
    let turn;
    let mockChatInstance;
    beforeEach(() => {
        vi.resetAllMocks();
        mockChatInstance = {
            sendMessageStream: mockSendMessageStream,
            getHistory: mockGetHistory,
            getHistoryLength: mockGetHistoryLength,
            getHistoryTailShallow: mockGetHistoryTailShallow,
            maybeIncludeSchemaDepthContext: mockMaybeIncludeSchemaDepthContext,
        };
        turn = new Turn(mockChatInstance, 'prompt-id-1');
        mockGetHistory.mockReturnValue([]);
        mockGetHistoryLength.mockReturnValue(0);
        mockGetHistoryTailShallow.mockReturnValue([]);
        mockSendMessageStream.mockResolvedValue((async function* () { })());
    });
    afterEach(() => {
        vi.restoreAllMocks();
    });
    describe('constructor', () => {
        it('should initialize pendingToolCalls', () => {
            expect(turn.pendingToolCalls).toEqual([]);
        });
    });
    describe('run', () => {
        it('should yield content events for text parts', async () => {
            const mockResponseStream = (async function* () {
                yield {
                    type: StreamEventType.CHUNK,
                    value: {
                        candidates: [{ content: { parts: [{ text: 'Hello' }] } }],
                    },
                };
                yield {
                    type: StreamEventType.CHUNK,
                    value: {
                        candidates: [{ content: { parts: [{ text: ' world' }] } }],
                    },
                };
            })();
            mockSendMessageStream.mockResolvedValue(mockResponseStream);
            const events = [];
            const reqParts = [{ text: 'Hi' }];
            for await (const event of turn.run('test-model', reqParts, new AbortController().signal)) {
                events.push(event);
            }
            expect(mockSendMessageStream).toHaveBeenCalledWith('test-model', {
                message: reqParts,
                config: { abortSignal: expect.any(AbortSignal) },
            }, 'prompt-id-1');
            expect(events).toEqual([
                { type: GeminiEventType.Content, value: 'Hello' },
                { type: GeminiEventType.Content, value: ' world' },
            ]);
        });
        it('should emit Thought events when a thought part is present', async () => {
            const mockResponseStream = (async function* () {
                yield {
                    type: StreamEventType.CHUNK,
                    value: {
                        candidates: [
                            {
                                content: {
                                    role: 'model',
                                    parts: [
                                        { thought: true, text: 'reasoning...' },
                                        { text: 'final answer' },
                                    ],
                                },
                            },
                        ],
                    },
                };
            })();
            mockSendMessageStream.mockResolvedValue(mockResponseStream);
            const events = [];
            const reqParts = [{ text: 'Hi' }];
            for await (const event of turn.run('test-model', reqParts, new AbortController().signal)) {
                events.push(event);
            }
            expect(events).toEqual([
                {
                    type: GeminiEventType.Thought,
                    value: { subject: '', description: 'reasoning...' },
                },
                { type: GeminiEventType.Content, value: 'final answer' },
            ]);
        });
        it('should keep OpenAI reasoning markdown as a streaming thought description', async () => {
            const mockResponseStream = (async function* () {
                yield {
                    type: StreamEventType.CHUNK,
                    value: {
                        candidates: [
                            {
                                content: {
                                    role: 'model',
                                    parts: [
                                        createOpenAIReasoningThoughtPart('**Analyzing the request**'),
                                    ],
                                },
                            },
                        ],
                    },
                };
            })();
            mockSendMessageStream.mockResolvedValue(mockResponseStream);
            const events = [];
            for await (const event of turn.run('test-model', [{ text: 'Hi' }], new AbortController().signal)) {
                events.push(event);
            }
            expect(events).toEqual([
                {
                    type: GeminiEventType.Thought,
                    value: { subject: '', description: '**Analyzing the request**' },
                },
            ]);
        });
        it('should keep parsing unmarked structured thought subjects', async () => {
            const mockResponseStream = (async function* () {
                yield {
                    type: StreamEventType.CHUNK,
                    value: {
                        candidates: [
                            {
                                content: {
                                    role: 'model',
                                    parts: [{ thought: true, text: '**Only Subject**' }],
                                },
                            },
                        ],
                    },
                };
            })();
            mockSendMessageStream.mockResolvedValue(mockResponseStream);
            const events = [];
            for await (const event of turn.run('test-model', [{ text: 'Hi' }], new AbortController().signal)) {
                events.push(event);
            }
            expect(events).toEqual([
                {
                    type: GeminiEventType.Thought,
                    value: { subject: 'Only Subject', description: '' },
                },
            ]);
        });
        it('should emit thought descriptions per incoming chunk', async () => {
            const mockResponseStream = (async function* () {
                yield {
                    type: StreamEventType.CHUNK,
                    value: {
                        candidates: [
                            {
                                content: {
                                    role: 'model',
                                    parts: [{ thought: true, text: 'part1' }],
                                },
                            },
                        ],
                    },
                };
                yield {
                    type: StreamEventType.CHUNK,
                    value: {
                        candidates: [
                            {
                                content: {
                                    role: 'model',
                                    parts: [{ thought: true, text: 'part2' }],
                                },
                            },
                        ],
                    },
                };
            })();
            mockSendMessageStream.mockResolvedValue(mockResponseStream);
            const events = [];
            for await (const event of turn.run('test-model', [{ text: 'Hi' }], new AbortController().signal)) {
                events.push(event);
            }
            expect(events).toEqual([
                {
                    type: GeminiEventType.Thought,
                    value: { subject: '', description: 'part1' },
                },
                {
                    type: GeminiEventType.Thought,
                    value: { subject: '', description: 'part2' },
                },
            ]);
        });
        it('should yield tool_call_request events for function calls', async () => {
            const mockResponseStream = (async function* () {
                yield {
                    type: StreamEventType.CHUNK,
                    value: {
                        functionCalls: [
                            {
                                id: 'fc1',
                                name: 'tool1',
                                args: { arg1: 'val1' },
                                isClientInitiated: false,
                            },
                            {
                                name: 'tool2',
                                args: { arg2: 'val2' },
                                isClientInitiated: false,
                            }, // No ID
                        ],
                    },
                };
            })();
            mockSendMessageStream.mockResolvedValue(mockResponseStream);
            const events = [];
            const reqParts = [{ text: 'Use tools' }];
            for await (const event of turn.run('test-model', reqParts, new AbortController().signal)) {
                events.push(event);
            }
            expect(events.length).toBe(2);
            const event1 = events[0];
            expect(event1.type).toBe(GeminiEventType.ToolCallRequest);
            expect(event1.value).toEqual(expect.objectContaining({
                callId: 'fc1',
                name: 'tool1',
                args: { arg1: 'val1' },
                isClientInitiated: false,
            }));
            expect(turn.pendingToolCalls[0]).toEqual(event1.value);
            const event2 = events[1];
            expect(event2.type).toBe(GeminiEventType.ToolCallRequest);
            expect(event2.value).toEqual(expect.objectContaining({
                name: 'tool2',
                args: { arg2: 'val2' },
                isClientInitiated: false,
            }));
            expect(event2.value.callId).toEqual(expect.stringMatching(/^tool2-\d{13}-\w{10,}$/));
            expect(turn.pendingToolCalls[1]).toEqual(event2.value);
        });
        it('clears response id state when a model fallback occurs', async () => {
            const mockResponseStream = (async function* () {
                yield {
                    type: StreamEventType.CHUNK,
                    value: {
                        responseId: 'primary-response',
                        functionCalls: [
                            {
                                id: 'primary-call',
                                name: 'tool1',
                                args: {},
                            },
                        ],
                    },
                };
                yield {
                    type: StreamEventType.MODEL_FALLBACK,
                    info: {
                        fromModel: 'primary-model',
                        toModel: 'fallback-model',
                        fallbackIndex: 1,
                    },
                };
                yield {
                    type: StreamEventType.CHUNK,
                    value: {
                        functionCalls: [
                            {
                                id: 'fallback-call',
                                name: 'tool2',
                                args: {},
                            },
                        ],
                    },
                };
            })();
            mockSendMessageStream.mockResolvedValue(mockResponseStream);
            const events = [];
            for await (const event of turn.run('test-model', [], new AbortController().signal)) {
                events.push(event);
            }
            const toolCalls = events.filter((event) => event.type === GeminiEventType.ToolCallRequest);
            const fallbackEvent = events.find((event) => event.type === GeminiEventType.ModelFallback);
            expect(fallbackEvent).toEqual({
                type: GeminiEventType.ModelFallback,
                fromModel: 'primary-model',
                toModel: 'fallback-model',
                statusCode: undefined,
                fallbackIndex: 1,
            });
            expect(toolCalls[0].value.response_id).toBe('primary-response');
            expect(toolCalls[1].value.response_id).toBeUndefined();
            expect(turn.pendingToolCalls).toEqual([toolCalls[1].value]);
        });
        it('should yield UserCancelled event if signal is aborted', async () => {
            const abortController = new AbortController();
            const mockResponseStream = (async function* () {
                yield {
                    type: StreamEventType.CHUNK,
                    value: {
                        candidates: [{ content: { parts: [{ text: 'First part' }] } }],
                    },
                };
                abortController.abort();
                yield {
                    type: StreamEventType.CHUNK,
                    value: {
                        candidates: [
                            {
                                content: {
                                    parts: [{ text: 'Second part - should not be processed' }],
                                },
                            },
                        ],
                    },
                };
            })();
            mockSendMessageStream.mockResolvedValue(mockResponseStream);
            const events = [];
            const reqParts = [{ text: 'Test abort' }];
            for await (const event of turn.run('test-model', reqParts, abortController.signal)) {
                events.push(event);
            }
            expect(events).toEqual([
                { type: GeminiEventType.Content, value: 'First part' },
                { type: GeminiEventType.UserCancelled },
            ]);
        });
        it('should yield Error event and report if sendMessageStream throws', async () => {
            const error = new Error('API Error');
            mockSendMessageStream.mockRejectedValue(error);
            const reqParts = [{ text: 'Trigger error' }];
            const historyContent = [
                { role: 'model', parts: [{ text: 'Previous history' }] },
            ];
            mockGetHistoryLength.mockReturnValue(historyContent.length);
            mockGetHistoryTailShallow.mockReturnValue(historyContent);
            mockMaybeIncludeSchemaDepthContext.mockResolvedValue(undefined);
            const events = [];
            for await (const event of turn.run('test-model', reqParts, new AbortController().signal)) {
                events.push(event);
            }
            expect(events.length).toBe(1);
            const errorEvent = events[0];
            expect(errorEvent.type).toBe(GeminiEventType.Error);
            expect(errorEvent.value).toEqual({
                error: { message: 'API Error', status: undefined },
            });
            expect(reportError).toHaveBeenCalledWith(error, 'Error when talking to API', {
                history: {
                    rawLength: 1,
                    tail: [
                        {
                            role: 'model',
                            partCount: 1,
                            functionCalls: [],
                            functionResponses: [],
                            textPreview: 'Previous history',
                        },
                    ],
                },
                request: {
                    partCount: 1,
                    functionCalls: [],
                    functionResponses: [],
                    textPreview: 'Trigger error',
                },
            }, 'Turn.run-sendMessageStream', { contextAlreadySummarized: true });
        });
        it('should report API errors with empty history summary', async () => {
            const error = new Error('API Error');
            const reqParts = [{ text: 'Trigger error' }];
            mockSendMessageStream.mockRejectedValue(error);
            mockMaybeIncludeSchemaDepthContext.mockResolvedValue(undefined);
            const events = [];
            for await (const event of turn.run('test-model', reqParts, new AbortController().signal)) {
                events.push(event);
            }
            const errorEvent = events[0];
            expect(errorEvent.type).toBe(GeminiEventType.Error);
            expect(errorEvent.value).toEqual({
                error: { message: 'API Error', status: undefined },
            });
            expect(reportError).toHaveBeenCalledWith(error, 'Error when talking to API', {
                history: {
                    rawLength: 0,
                    tail: [],
                },
                request: {
                    partCount: 1,
                    functionCalls: [],
                    functionResponses: [],
                    textPreview: 'Trigger error',
                },
            }, 'Turn.run-sendMessageStream', { contextAlreadySummarized: true });
        });
        it('should report API errors without cloning full history', async () => {
            const error = new Error('API Error');
            const largeText = 'x'.repeat(1024 * 1024);
            const reqParts = { text: 'Trigger error' };
            mockSendMessageStream.mockRejectedValue(error);
            mockGetHistory.mockImplementation(() => {
                throw new Error('full history clone should not be used');
            });
            mockGetHistoryLength.mockReturnValue(100);
            mockGetHistoryTailShallow.mockReturnValue([
                {
                    role: 'user',
                    parts: [
                        { functionResponse: { name: 'tool', response: { largeText } } },
                    ],
                },
                {
                    role: 'model',
                    parts: [
                        { thought: true, text: 'internal reasoning' },
                        { functionCall: { name: 'readFile', args: {} } },
                        { text: largeText },
                    ],
                },
            ]);
            mockMaybeIncludeSchemaDepthContext.mockResolvedValue(undefined);
            const events = [];
            for await (const event of turn.run('test-model', reqParts, new AbortController().signal)) {
                events.push(event);
            }
            expect(events[0]?.type).toBe(GeminiEventType.Error);
            expect(mockGetHistory).not.toHaveBeenCalled();
            expect(mockGetHistoryLength).toHaveBeenCalled();
            expect(mockGetHistoryTailShallow).toHaveBeenCalledWith(8, true);
            const reportedContext = vi.mocked(reportError).mock.calls[0]?.[2];
            expect(JSON.stringify(reportedContext)).not.toContain(largeText);
            expect(JSON.stringify(reportedContext)).not.toContain('internal reasoning');
            expect(reportError).toHaveBeenCalledWith(error, 'Error when talking to API', {
                history: {
                    rawLength: 100,
                    tail: [
                        {
                            role: 'user',
                            partCount: 1,
                            functionCalls: [],
                            functionResponses: ['tool'],
                            textPreview: '',
                        },
                        {
                            role: 'model',
                            partCount: 3,
                            functionCalls: ['readFile'],
                            functionResponses: [],
                            textPreview: largeText.slice(0, 200),
                        },
                    ],
                },
                request: {
                    partCount: 1,
                    functionCalls: [],
                    functionResponses: [],
                    textPreview: 'Trigger error',
                },
            }, 'Turn.run-sendMessageStream', { contextAlreadySummarized: true });
        });
        it('should report API errors when request parts include strings', async () => {
            const error = new Error('API Error');
            const reqParts = ['Trigger ', { text: 'error' }];
            const diagnosticFailure = 'history is unavailable';
            mockSendMessageStream.mockRejectedValue(error);
            mockGetHistoryLength.mockImplementation(() => {
                throw diagnosticFailure;
            });
            mockMaybeIncludeSchemaDepthContext.mockResolvedValue(undefined);
            const events = [];
            for await (const event of turn.run('test-model', reqParts, new AbortController().signal)) {
                events.push(event);
            }
            expect(events[0]?.type).toBe(GeminiEventType.Error);
            expect(reportError).toHaveBeenCalledWith(error, 'Error when talking to API', {
                history: {
                    error: 'failed to build diagnostic summary',
                    cause: 'history is unavailable',
                },
                request: {
                    partCount: 2,
                    functionCalls: [],
                    functionResponses: [],
                    textPreview: 'Trigger error',
                },
            }, 'Turn.run-sendMessageStream', { contextAlreadySummarized: true });
        });
        it('should preserve API errors when diagnostic summary fails', async () => {
            const error = new Error('API Error');
            const reqParts = [{ text: 'Trigger error' }];
            mockSendMessageStream.mockRejectedValue(error);
            mockGetHistoryLength.mockImplementation(() => {
                throw new Error('history is unavailable');
            });
            mockMaybeIncludeSchemaDepthContext.mockResolvedValue(undefined);
            const events = [];
            for await (const event of turn.run('test-model', reqParts, new AbortController().signal)) {
                events.push(event);
            }
            expect(events[0]?.type).toBe(GeminiEventType.Error);
            expect(reportError).toHaveBeenCalledWith(error, 'Error when talking to API', {
                history: {
                    error: 'failed to build diagnostic summary',
                    cause: {
                        message: 'history is unavailable',
                        stack: expect.any(String),
                    },
                },
                request: {
                    partCount: 1,
                    functionCalls: [],
                    functionResponses: [],
                    textPreview: 'Trigger error',
                },
            }, 'Turn.run-sendMessageStream', { contextAlreadySummarized: true });
        });
        it('should handle function calls with undefined name or args', async () => {
            const mockResponseStream = (async function* () {
                yield {
                    type: StreamEventType.CHUNK,
                    value: {
                        candidates: [],
                        functionCalls: [
                            // Add `id` back to the mock to match what the code expects
                            { id: 'fc1', name: undefined, args: { arg1: 'val1' } },
                            { id: 'fc2', name: 'tool2', args: undefined },
                            { id: 'fc3', name: undefined, args: undefined },
                        ],
                    },
                };
            })();
            mockSendMessageStream.mockResolvedValue(mockResponseStream);
            const events = [];
            for await (const event of turn.run('test-model', [{ text: 'Test undefined tool parts' }], new AbortController().signal)) {
                events.push(event);
            }
            expect(events.length).toBe(3);
            // Assertions for each specific tool call event
            const event1 = events[0];
            expect(event1.value).toMatchObject({
                callId: 'fc1',
                name: 'undefined_tool_name',
                args: { arg1: 'val1' },
            });
            const event2 = events[1];
            expect(event2.value).toMatchObject({
                callId: 'fc2',
                name: 'tool2',
                args: {},
            });
            const event3 = events[2];
            expect(event3.value).toMatchObject({
                callId: 'fc3',
                name: 'undefined_tool_name',
                args: {},
            });
        });
        it('should preserve provider tool-call ids separately from generated call ids', async () => {
            const mockResponseStream = (async function* () {
                yield {
                    type: StreamEventType.CHUNK,
                    value: {
                        candidates: [],
                        functionCalls: [
                            { id: 'fc1', name: 'tool1', args: { arg1: 'val1' } },
                            { name: 'tool2', args: { arg2: 'val2' } },
                        ],
                    },
                };
            })();
            mockSendMessageStream.mockResolvedValue(mockResponseStream);
            const events = [];
            for await (const event of turn.run('test-model', [{ text: 'Test provider ids' }], new AbortController().signal)) {
                events.push(event);
            }
            expect(events.length).toBe(2);
            const event1 = events[0];
            expect(event1.value).toMatchObject({
                callId: 'fc1',
                providerCallId: 'fc1',
                name: 'tool1',
                args: { arg1: 'val1' },
            });
            const event2 = events[1];
            expect(event2.value.callId).toMatch(/^tool2-/);
            expect(event2.value.providerCallId).toBeUndefined();
            expect(event2.value).toMatchObject({
                name: 'tool2',
                args: { arg2: 'val2' },
            });
        });
        it('should preserve raw provider ids for suffixed function call ids', async () => {
            const [normalizedPart] = normalizeModelToolCallIds([
                {
                    functionCall: {
                        id: 'fc1',
                        name: 'tool1',
                        args: { arg1: 'val1' },
                    },
                },
            ], new Set(['fc1']), new Set());
            const mockResponseStream = (async function* () {
                yield {
                    type: StreamEventType.CHUNK,
                    value: {
                        candidates: [],
                        functionCalls: [normalizedPart.functionCall],
                    },
                };
            })();
            mockSendMessageStream.mockResolvedValue(mockResponseStream);
            const events = [];
            for await (const event of turn.run('test-model', [{ text: 'Test suffixed provider id' }], new AbortController().signal)) {
                events.push(event);
            }
            expect(events.length).toBe(1);
            const event = events[0];
            expect(event.value).toMatchObject({
                callId: 'fc1__hopcode_dup_2',
                providerCallId: 'fc1',
                name: 'tool1',
                args: { arg1: 'val1' },
            });
        });
        it('should yield finished event when response has finish reason', async () => {
            const mockResponseStream = (async function* () {
                yield {
                    type: StreamEventType.CHUNK,
                    value: {
                        candidates: [
                            {
                                content: { parts: [{ text: 'Partial response' }] },
                                finishReason: 'STOP',
                            },
                        ],
                        usageMetadata: {
                            promptTokenCount: 17,
                            candidatesTokenCount: 50,
                            cachedContentTokenCount: 10,
                            thoughtsTokenCount: 5,
                        },
                    },
                };
            })();
            mockSendMessageStream.mockResolvedValue(mockResponseStream);
            const events = [];
            for await (const event of turn.run('test-model', [{ text: 'Test finish reason' }], new AbortController().signal)) {
                events.push(event);
            }
            expect(events).toEqual([
                { type: GeminiEventType.Content, value: 'Partial response' },
                {
                    type: GeminiEventType.Finished,
                    value: {
                        reason: 'STOP',
                        usageMetadata: {
                            promptTokenCount: 17,
                            candidatesTokenCount: 50,
                            cachedContentTokenCount: 10,
                            thoughtsTokenCount: 5,
                        },
                    },
                },
            ]);
        });
        it('should yield finished event for MAX_TOKENS finish reason', async () => {
            const mockResponseStream = (async function* () {
                yield {
                    type: StreamEventType.CHUNK,
                    value: {
                        candidates: [
                            {
                                content: {
                                    parts: [
                                        { text: 'This is a long response that was cut off...' },
                                    ],
                                },
                                finishReason: 'MAX_TOKENS',
                            },
                        ],
                    },
                };
            })();
            mockSendMessageStream.mockResolvedValue(mockResponseStream);
            const events = [];
            const reqParts = [{ text: 'Generate long text' }];
            for await (const event of turn.run('test-model', reqParts, new AbortController().signal)) {
                events.push(event);
            }
            expect(events).toEqual([
                {
                    type: GeminiEventType.Content,
                    value: 'This is a long response that was cut off...',
                },
                {
                    type: GeminiEventType.Finished,
                    value: { reason: 'MAX_TOKENS', usageMetadata: undefined },
                },
            ]);
        });
        it('should yield finished event for SAFETY finish reason', async () => {
            const mockResponseStream = (async function* () {
                yield {
                    type: StreamEventType.CHUNK,
                    value: {
                        candidates: [
                            {
                                content: { parts: [{ text: 'Content blocked' }] },
                                finishReason: 'SAFETY',
                            },
                        ],
                    },
                };
            })();
            mockSendMessageStream.mockResolvedValue(mockResponseStream);
            const events = [];
            const reqParts = [{ text: 'Test safety' }];
            for await (const event of turn.run('test-model', reqParts, new AbortController().signal)) {
                events.push(event);
            }
            expect(events).toEqual([
                { type: GeminiEventType.Content, value: 'Content blocked' },
                {
                    type: GeminiEventType.Finished,
                    value: { reason: 'SAFETY', usageMetadata: undefined },
                },
            ]);
        });
        it('should yield finished event with undefined reason when there is no finish reason', async () => {
            const mockResponseStream = (async function* () {
                yield {
                    type: StreamEventType.CHUNK,
                    value: {
                        candidates: [
                            {
                                content: {
                                    parts: [{ text: 'Response without finish reason' }],
                                },
                                // No finishReason property
                            },
                        ],
                    },
                };
            })();
            mockSendMessageStream.mockResolvedValue(mockResponseStream);
            const events = [];
            const reqParts = [{ text: 'Test no finish reason' }];
            for await (const event of turn.run('test-model', reqParts, new AbortController().signal)) {
                events.push(event);
            }
            expect(events).toEqual([
                {
                    type: GeminiEventType.Content,
                    value: 'Response without finish reason',
                },
            ]);
        });
        it('should handle multiple responses with different finish reasons', async () => {
            const mockResponseStream = (async function* () {
                yield {
                    type: StreamEventType.CHUNK,
                    value: {
                        candidates: [
                            {
                                content: { parts: [{ text: 'First part' }] },
                                // No finish reason on first response
                            },
                        ],
                    },
                };
                yield {
                    value: {
                        type: StreamEventType.CHUNK,
                        candidates: [
                            {
                                content: { parts: [{ text: 'Second part' }] },
                                finishReason: 'OTHER',
                            },
                        ],
                    },
                };
            })();
            mockSendMessageStream.mockResolvedValue(mockResponseStream);
            const events = [];
            const reqParts = [{ text: 'Test multiple responses' }];
            for await (const event of turn.run('test-model', reqParts, new AbortController().signal)) {
                events.push(event);
            }
            expect(events).toEqual([
                { type: GeminiEventType.Content, value: 'First part' },
                { type: GeminiEventType.Content, value: 'Second part' },
                {
                    type: GeminiEventType.Finished,
                    value: { reason: 'OTHER', usageMetadata: undefined },
                },
            ]);
        });
        it('should yield citation and finished events when response has citationMetadata', async () => {
            const mockResponseStream = (async function* () {
                yield {
                    type: StreamEventType.CHUNK,
                    value: {
                        candidates: [
                            {
                                content: { parts: [{ text: 'Some text.' }] },
                                citationMetadata: {
                                    citations: [
                                        {
                                            uri: 'https://example.com/source1',
                                            title: 'Source 1 Title',
                                        },
                                    ],
                                },
                                finishReason: 'STOP',
                            },
                        ],
                    },
                };
            })();
            mockSendMessageStream.mockResolvedValue(mockResponseStream);
            const events = [];
            for await (const event of turn.run('test-model', [{ text: 'Test citations' }], new AbortController().signal)) {
                events.push(event);
            }
            expect(events).toEqual([
                { type: GeminiEventType.Content, value: 'Some text.' },
                {
                    type: GeminiEventType.Citation,
                    value: 'Citations:\n(Source 1 Title) https://example.com/source1',
                },
                {
                    type: GeminiEventType.Finished,
                    value: { reason: 'STOP', usageMetadata: undefined },
                },
            ]);
        });
        it('should yield a single citation event for multiple citations in one response', async () => {
            const mockResponseStream = (async function* () {
                yield {
                    type: StreamEventType.CHUNK,
                    value: {
                        candidates: [
                            {
                                content: { parts: [{ text: 'Some text.' }] },
                                citationMetadata: {
                                    citations: [
                                        {
                                            uri: 'https://example.com/source2',
                                            title: 'Title2',
                                        },
                                        {
                                            uri: 'https://example.com/source1',
                                            title: 'Title1',
                                        },
                                    ],
                                },
                                finishReason: 'STOP',
                            },
                        ],
                    },
                };
            })();
            mockSendMessageStream.mockResolvedValue(mockResponseStream);
            const events = [];
            for await (const event of turn.run('test-model', [{ text: 'test' }], new AbortController().signal)) {
                events.push(event);
            }
            expect(events).toEqual([
                { type: GeminiEventType.Content, value: 'Some text.' },
                {
                    type: GeminiEventType.Citation,
                    value: 'Citations:\n(Title1) https://example.com/source1\n(Title2) https://example.com/source2',
                },
                {
                    type: GeminiEventType.Finished,
                    value: { reason: 'STOP', usageMetadata: undefined },
                },
            ]);
        });
        it('should not yield citation event if there is no finish reason', async () => {
            const mockResponseStream = (async function* () {
                yield {
                    type: StreamEventType.CHUNK,
                    value: {
                        candidates: [
                            {
                                content: { parts: [{ text: 'Some text.' }] },
                                citationMetadata: {
                                    citations: [
                                        {
                                            uri: 'https://example.com/source1',
                                            title: 'Source 1 Title',
                                        },
                                    ],
                                },
                                // No finishReason
                            },
                        ],
                    },
                };
            })();
            mockSendMessageStream.mockResolvedValue(mockResponseStream);
            const events = [];
            for await (const event of turn.run('test-model', [{ text: 'test' }], new AbortController().signal)) {
                events.push(event);
            }
            expect(events).toEqual([
                { type: GeminiEventType.Content, value: 'Some text.' },
            ]);
            // No Citation event (but we do get a Finished event with undefined reason)
            expect(events.some((e) => e.type === GeminiEventType.Citation)).toBe(false);
        });
        it('should ignore citations without a URI', async () => {
            const mockResponseStream = (async function* () {
                yield {
                    type: StreamEventType.CHUNK,
                    value: {
                        candidates: [
                            {
                                content: { parts: [{ text: 'Some text.' }] },
                                citationMetadata: {
                                    citations: [
                                        {
                                            uri: 'https://example.com/source1',
                                            title: 'Good Source',
                                        },
                                        {
                                            // uri is undefined
                                            title: 'Bad Source',
                                        },
                                    ],
                                },
                                finishReason: 'STOP',
                            },
                        ],
                    },
                };
            })();
            mockSendMessageStream.mockResolvedValue(mockResponseStream);
            const events = [];
            for await (const event of turn.run('test-model', [{ text: 'test' }], new AbortController().signal)) {
                events.push(event);
            }
            expect(events).toEqual([
                { type: GeminiEventType.Content, value: 'Some text.' },
                {
                    type: GeminiEventType.Citation,
                    value: 'Citations:\n(Good Source) https://example.com/source1',
                },
                {
                    type: GeminiEventType.Finished,
                    value: { reason: 'STOP', usageMetadata: undefined },
                },
            ]);
        });
        it('should not crash when cancelled request has malformed error', async () => {
            const abortController = new AbortController();
            const errorToThrow = {
                response: {
                    data: undefined, // Malformed error data
                },
            };
            mockSendMessageStream.mockImplementation(async () => {
                abortController.abort();
                throw errorToThrow;
            });
            const events = [];
            const reqParts = [{ text: 'Test malformed error handling' }];
            for await (const event of turn.run('test-model', reqParts, abortController.signal)) {
                events.push(event);
            }
            expect(events).toEqual([{ type: GeminiEventType.UserCancelled }]);
            expect(reportError).not.toHaveBeenCalled();
        });
        it('should yield a Retry event when it receives one from the chat stream', async () => {
            const mockResponseStream = (async function* () {
                yield { type: StreamEventType.RETRY };
                yield {
                    type: StreamEventType.CHUNK,
                    value: {
                        candidates: [{ content: { parts: [{ text: 'Success' }] } }],
                    },
                };
            })();
            mockSendMessageStream.mockResolvedValue(mockResponseStream);
            const events = [];
            for await (const event of turn.run('test-model', [], new AbortController().signal)) {
                events.push(event);
            }
            expect(events).toEqual([
                { type: GeminiEventType.Retry },
                { type: GeminiEventType.Content, value: 'Success' },
            ]);
        });
        it('bridges a compressed stream event to a ChatCompressed event', async () => {
            const compressionInfo = {
                originalTokenCount: 1000,
                newTokenCount: 200,
                compressionStatus: CompressionStatus.COMPRESSED,
            };
            const mockResponseStream = (async function* () {
                yield { type: StreamEventType.COMPRESSED, info: compressionInfo };
                yield {
                    type: StreamEventType.CHUNK,
                    value: {
                        candidates: [{ content: { parts: [{ text: 'after' }] } }],
                    },
                };
            })();
            mockSendMessageStream.mockResolvedValue(mockResponseStream);
            const events = [];
            for await (const event of turn.run('test-model', [], new AbortController().signal)) {
                events.push(event);
            }
            expect(events).toEqual([
                { type: GeminiEventType.ChatCompressed, value: compressionInfo },
                { type: GeminiEventType.Content, value: 'after' },
            ]);
        });
    });
    describe('wasOutputTruncated flag', () => {
        it('should set wasOutputTruncated=true on pending tool calls when finishReason is MAX_TOKENS', async () => {
            const mockResponseStream = (async function* () {
                // Yield a tool call request
                yield {
                    type: StreamEventType.CHUNK,
                    value: {
                        functionCalls: [
                            {
                                name: 'write_file',
                                args: { file_path: '/test.txt', content: 'hello' },
                            },
                        ],
                    },
                };
                // Yield finish with MAX_TOKENS
                yield {
                    type: StreamEventType.CHUNK,
                    value: {
                        candidates: [
                            {
                                finishReason: 'MAX_TOKENS',
                                content: { parts: [] },
                            },
                        ],
                    },
                };
            })();
            mockSendMessageStream.mockResolvedValue(mockResponseStream);
            const reqParts = [{ text: 'Test prompt' }];
            const events = [];
            for await (const event of turn.run('test-model', reqParts, new AbortController().signal)) {
                events.push(event);
            }
            // Verify that pending tool calls have wasOutputTruncated flag set
            expect(turn.pendingToolCalls).toHaveLength(1);
            expect(turn.pendingToolCalls[0].wasOutputTruncated).toBe(true);
            expect(turn.pendingToolCalls[0].name).toBe('write_file');
        });
        it('should NOT set wasOutputTruncated when finishReason is STOP', async () => {
            const mockResponseStream = (async function* () {
                yield {
                    type: StreamEventType.CHUNK,
                    value: {
                        functionCalls: [
                            {
                                name: 'read_file',
                                args: { file_path: '/test.txt' },
                            },
                        ],
                    },
                };
                // Yield finish with STOP (normal completion)
                yield {
                    type: StreamEventType.CHUNK,
                    value: {
                        candidates: [
                            {
                                finishReason: 'STOP',
                                content: { parts: [] },
                            },
                        ],
                    },
                };
            })();
            mockSendMessageStream.mockResolvedValue(mockResponseStream);
            const reqParts = [{ text: 'Test prompt' }];
            for await (const _ of turn.run('test-model', reqParts, new AbortController().signal)) {
                // consume stream
            }
            // Verify that pending tool calls do NOT have wasOutputTruncated flag
            expect(turn.pendingToolCalls).toHaveLength(1);
            expect(turn.pendingToolCalls[0].wasOutputTruncated).toBeUndefined();
        });
        it('should handle multiple pending tool calls with MAX_TOKENS', async () => {
            const mockResponseStream = (async function* () {
                // Yield two tool calls
                yield {
                    type: StreamEventType.CHUNK,
                    value: {
                        functionCalls: [
                            {
                                name: 'write_file',
                                args: { file_path: '/test1.txt', content: 'content1' },
                            },
                            {
                                name: 'edit',
                                args: { file_path: '/test2.txt', original_text: 'old' },
                            },
                        ],
                    },
                };
                // Yield finish with MAX_TOKENS
                yield {
                    type: StreamEventType.CHUNK,
                    value: {
                        candidates: [
                            {
                                finishReason: 'MAX_TOKENS',
                                content: { parts: [] },
                            },
                        ],
                    },
                };
            })();
            mockSendMessageStream.mockResolvedValue(mockResponseStream);
            const reqParts = [{ text: 'Test prompt' }];
            for await (const _ of turn.run('test-model', reqParts, new AbortController().signal)) {
                // consume stream
            }
            // Verify both tool calls have wasOutputTruncated flag set
            expect(turn.pendingToolCalls).toHaveLength(2);
            expect(turn.pendingToolCalls[0].wasOutputTruncated).toBe(true);
            expect(turn.pendingToolCalls[1].wasOutputTruncated).toBe(true);
        });
    });
});
//# sourceMappingURL=turn.test.js.map