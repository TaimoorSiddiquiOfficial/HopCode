/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { propagation, SpanStatusCode, trace, } from '@opentelemetry/api';
vi.mock('./sdk.js', () => ({
    isTelemetrySdkInitialized: () => true,
}));
import { DAEMON_TRACEPARENT_META_KEY, DAEMON_TRACESTATE_META_KEY, addDaemonRequestAttribute, createDaemonBridgeTelemetry, extractDaemonTraceContext, hashDaemonWorkspace, injectDaemonTraceContext, withDaemonSpan, withDaemonRequestSpan, } from './daemon-tracing.js';
describe('daemon-tracing', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });
    it('injects traceparent from the active span without the global propagator', () => {
        const traceId = '1234567890abcdef1234567890abcdef';
        const spanId = 'abcdef1234567890';
        const activeSpan = {
            spanContext: () => ({
                traceId,
                spanId,
                traceFlags: 1,
            }),
        };
        vi.spyOn(trace, 'getActiveSpan').mockReturnValue(activeSpan);
        const injectSpy = vi.spyOn(propagation, 'inject');
        const injected = injectDaemonTraceContext({
            prompt: [],
            _meta: {
                keep: true,
                [DAEMON_TRACEPARENT_META_KEY]: 'client-spoof',
                [DAEMON_TRACESTATE_META_KEY]: 'client-state',
            },
        });
        expect(injectSpy).not.toHaveBeenCalled();
        expect(injected._meta['keep']).toBe(true);
        expect(injected._meta[DAEMON_TRACEPARENT_META_KEY]).toBe(`00-${traceId}-${spanId}-01`);
        expect(injected._meta[DAEMON_TRACESTATE_META_KEY]).toBeUndefined();
    });
    it('injects the active bridge span context through the bridge telemetry seam', async () => {
        const traceId = 'fedcba0987654321fedcba0987654321';
        const daemonSpan = {
            spanContext: () => ({
                traceId,
                spanId: '1111111111111111',
                traceFlags: 1,
            }),
        };
        const bridgeSpan = {
            spanContext: () => ({
                traceId,
                spanId: '2222222222222222',
                traceFlags: 1,
            }),
            setStatus: vi.fn(),
            end: vi.fn(),
            setAttribute: vi.fn(),
            setAttributes: vi.fn(),
            recordException: vi.fn(),
        };
        let activeSpan = daemonSpan;
        vi.spyOn(trace, 'getActiveSpan').mockImplementation(() => activeSpan);
        const startActiveSpan = vi.fn(async (_name, _opts, fn) => {
            activeSpan = bridgeSpan;
            try {
                return await fn(bridgeSpan);
            }
            finally {
                activeSpan = daemonSpan;
            }
        });
        vi.spyOn(trace, 'getTracer').mockReturnValue({
            startActiveSpan,
        });
        const telemetry = createDaemonBridgeTelemetry();
        const captured = telemetry.captureContext();
        let injected;
        await telemetry.runWithContext(captured, async () => {
            await telemetry.withSpan('prompt.dispatch', { 'session.id': 'session-A' }, async () => {
                injected = telemetry.injectPromptContext({
                    prompt: [],
                    _meta: {},
                });
            });
        });
        const extracted = extractDaemonTraceContext(injected);
        expect(trace.getSpanContext(extracted)?.traceId).toBe(traceId);
        expect(trace.getSpanContext(extracted)?.spanId).toBe('2222222222222222');
        expect(startActiveSpan).toHaveBeenCalledWith('hopcode.daemon.bridge', expect.objectContaining({
            attributes: expect.objectContaining({
                'hopcode.daemon.operation': 'prompt.dispatch',
                'session.id': 'session-A',
            }),
        }), expect.any(Function));
    });
    it('extracts daemon trace context from reserved prompt metadata keys', () => {
        const traceId = '1'.repeat(32);
        const spanId = '2'.repeat(16);
        const extracted = extractDaemonTraceContext({
            _meta: {
                [DAEMON_TRACEPARENT_META_KEY]: `00-${traceId}-${spanId}-01`,
                [DAEMON_TRACESTATE_META_KEY]: 'vendor=value',
            },
        });
        expect(extracted).toBeDefined();
        expect(trace.getSpanContext(extracted)?.traceId).toBe(traceId);
        expect(trace.getSpanContext(extracted)?.spanId).toBe(spanId);
    });
    it('starts a daemon span under an explicit remote parent context', async () => {
        const parentContext = extractDaemonTraceContext({
            _meta: {
                [DAEMON_TRACEPARENT_META_KEY]: `00-${'1'.repeat(32)}-${'2'.repeat(16)}-01`,
            },
        });
        const span = {
            setStatus: vi.fn(),
            end: vi.fn(),
            setAttribute: vi.fn(),
            setAttributes: vi.fn(),
            recordException: vi.fn(),
        };
        const startActiveSpan = vi.fn(async (_name, _options, _parent, fn) => await fn(span));
        vi.spyOn(trace, 'getTracer').mockReturnValue({
            startActiveSpan,
        });
        await expect(withDaemonSpan('child', {}, async () => 'ok', {
            parentContext: parentContext,
        })).resolves.toBe('ok');
        expect(startActiveSpan).toHaveBeenCalledWith('child', expect.objectContaining({ kind: expect.any(Number) }), parentContext, expect.any(Function));
        expect(span.end).toHaveBeenCalledOnce();
    });
    it('strips reserved metadata when no active daemon span exists', () => {
        const injected = injectDaemonTraceContext({
            prompt: [],
            _meta: {
                keep: true,
                [DAEMON_TRACEPARENT_META_KEY]: 'client-spoof',
            },
        });
        const meta = injected._meta;
        expect(meta['keep']).toBe(true);
        expect(meta[DAEMON_TRACEPARENT_META_KEY]).toBeUndefined();
        expect(meta[DAEMON_TRACESTATE_META_KEY]).toBeUndefined();
        expect(extractDaemonTraceContext(injected)).toBeUndefined();
    });
    it('hashes workspace paths without exposing the raw path', () => {
        const hash = hashDaemonWorkspace('/tmp/project');
        expect(hash).toMatch(/^[0-9a-f]{16}$/);
        expect(hash).not.toContain('project');
    });
    it('emits bridge events as standalone spans without an active span', () => {
        const addEvent = vi.fn();
        const setStatus = vi.fn();
        const end = vi.fn();
        const startSpan = vi.fn(() => ({ addEvent, setStatus, end }));
        vi.spyOn(trace, 'getSpan').mockReturnValue(undefined);
        vi.spyOn(trace, 'getTracer').mockReturnValue({
            startSpan,
        });
        createDaemonBridgeTelemetry().event('channel.exited', {
            'hopcode.daemon.channel.session_count': 2,
        });
        expect(startSpan).toHaveBeenCalledWith('hopcode.daemon.bridge', expect.objectContaining({
            attributes: expect.objectContaining({
                'event.name': 'channel.exited',
                'hopcode.daemon.operation': 'event.channel.exited',
                'hopcode.daemon.channel.session_count': 2,
            }),
        }));
        expect(addEvent).toHaveBeenCalledWith('channel.exited', {
            'hopcode.daemon.channel.session_count': 2,
        });
        expect(setStatus).toHaveBeenCalledWith({ code: SpanStatusCode.OK });
        expect(end).toHaveBeenCalled();
    });
    function mockTracerStartActiveSpan() {
        const startActiveSpan = vi.fn((_name, _opts, fn) => fn({
            setStatus: vi.fn(),
            end: vi.fn(),
            setAttribute: vi.fn(),
            setAttributes: vi.fn(),
            recordException: vi.fn(),
        }));
        vi.spyOn(trace, 'getTracer').mockReturnValue({
            startActiveSpan,
        });
        return startActiveSpan;
    }
    it('includes clientId and permissionRequestId in request span attributes', async () => {
        const startActiveSpan = mockTracerStartActiveSpan();
        const startTime = new Date('2026-07-15T00:00:00.000Z');
        await withDaemonRequestSpan({
            method: 'POST',
            route: 'POST /session/:id/permission/:requestId',
            startTime,
            deferredRuntimeWaitMs: 42.5,
            deferredRuntimePath: 'joined',
            workspaceHash: 'abc123',
            sessionId: 'sess-1',
            clientId: 'client-42',
            permissionRequestId: 'perm-99',
        }, async () => { });
        expect(startActiveSpan).toHaveBeenCalledWith('hopcode.daemon.request', expect.objectContaining({
            attributes: expect.objectContaining({
                'http.request.method': 'POST',
                'http.route': 'POST /session/:id/permission/:requestId',
                'session.id': 'sess-1',
                'qwen-code.client_id': 'client-42',
                'qwen-code.daemon.permission.request_id': 'perm-99',
                'qwen-code.daemon.runtime.wait_ms': 42.5,
                'qwen-code.daemon.runtime.path': 'joined',
            }),
            startTime,
        }), expect.any(Function));
    });
    it('omits clientId and permissionRequestId when not provided', async () => {
        const startActiveSpan = mockTracerStartActiveSpan();
        await withDaemonRequestSpan({ method: 'POST', route: 'POST /session' }, async () => { });
        const attrs = startActiveSpan.mock.calls[0][1].attributes;
        expect(attrs).not.toHaveProperty('qwen-code.client_id');
        expect(attrs).not.toHaveProperty('qwen-code.daemon.permission.request_id');
        expect(attrs).not.toHaveProperty('qwen-code.daemon.runtime.wait_ms');
        expect(attrs).not.toHaveProperty('qwen-code.daemon.runtime.path');
    });
    it('addDaemonRequestAttribute sets attribute on the active span', () => {
        const setAttribute = vi.fn();
        vi.spyOn(trace, 'getSpan').mockReturnValue({
            setAttribute,
        });
        addDaemonRequestAttribute('hopcode.prompt_id', 'test-prompt-id');
        expect(setAttribute).toHaveBeenCalledWith('hopcode.prompt_id', 'test-prompt-id');
    });
    it('addDaemonRequestAttribute is a no-op without an active span', () => {
        vi.spyOn(trace, 'getSpan').mockReturnValue(undefined);
        expect(() => addDaemonRequestAttribute('hopcode.prompt_id', 'orphan')).not.toThrow();
    });
    it('bridge telemetry sets attributes on the active span', () => {
        const setAttributes = vi.fn();
        vi.spyOn(trace, 'getSpan').mockReturnValue({
            setAttributes,
        });
        createDaemonBridgeTelemetry().setActiveSpanAttributes?.({
            'qwen-code.daemon.acp_startup.profile.version': 1,
        });
        expect(setAttributes).toHaveBeenCalledWith({
            'qwen-code.daemon.acp_startup.profile.version': 1,
        });
    });
});
//# sourceMappingURL=daemon-tracing.test.js.map