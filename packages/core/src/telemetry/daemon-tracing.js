/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { createHash } from 'node:crypto';
import { context as otelContext, propagation, ROOT_CONTEXT, SpanKind, SpanStatusCode, trace, } from '@opentelemetry/api';
import { logs } from '@opentelemetry/api-logs';
import { SERVICE_NAME } from './constants.js';
import { isTelemetrySdkInitialized } from './sdk.js';
import { truncateSpanError } from './session-tracing.js';
import { formatTraceparent, getActiveSpanTraceContext, } from './trace-context.js';
export const DAEMON_TRACEPARENT_META_KEY = 'hopcode.telemetry.traceparent';
export const DAEMON_TRACESTATE_META_KEY = 'hopcode.telemetry.tracestate';
const SPAN_DAEMON_REQUEST = 'hopcode.daemon.request';
const SPAN_DAEMON_BRIDGE = 'hopcode.daemon.bridge';
const EVENT_DAEMON_ERROR = 'hopcode.daemon.error';
function errorMessage(error) {
    if (error instanceof Error)
        return error.message;
    return String(error);
}
function errorType(error) {
    if (error instanceof Error)
        return error.name || 'Error';
    return typeof error;
}
const INVALID_TRACE_ID = '0'.repeat(32);
const INVALID_SPAN_ID = '0'.repeat(16);
function stripReservedTraceMeta(meta) {
    if (!meta || typeof meta !== 'object' || Array.isArray(meta))
        return {};
    const record = meta;
    if (!(DAEMON_TRACEPARENT_META_KEY in record) &&
        !(DAEMON_TRACESTATE_META_KEY in record)) {
        return { ...record };
    }
    const out = { ...record };
    delete out[DAEMON_TRACEPARENT_META_KEY];
    delete out[DAEMON_TRACESTATE_META_KEY];
    return out;
}
export function hashDaemonWorkspace(workspace) {
    return createHash('sha256').update(workspace).digest('hex').slice(0, 16);
}
export async function withDaemonSpan(name, attributes, fn, options = {}) {
    if (!isTelemetrySdkInitialized()) {
        return await fn(undefined);
    }
    const autoOkOnSuccess = options.autoOkOnSuccess ?? true;
    const tracer = trace.getTracer(SERVICE_NAME);
    const spanOptions = {
        kind: SpanKind.INTERNAL,
        attributes,
        ...(options.startTime ? { startTime: options.startTime } : {}),
    };
    const run = async (span) => {
        try {
            const result = await fn(span);
            if (autoOkOnSuccess) {
                span.setStatus({ code: SpanStatusCode.OK });
            }
            return result;
        }
        catch (error) {
            recordDaemonError(span, error);
            throw error;
        }
        finally {
            span.end();
        }
    };
    return options.parentContext
        ? await tracer.startActiveSpan(name, spanOptions, options.parentContext, run)
        : await tracer.startActiveSpan(name, spanOptions, run);
}
export async function withDaemonRequestSpan(options, fn) {
    return await withDaemonSpan(SPAN_DAEMON_REQUEST, {
        'http.request.method': options.method,
        'http.route': options.route,
        'hopcode.daemon.operation': 'http_request',
        ...(options.workspaceHash
            ? { 'hopcode.workspace.hash': options.workspaceHash }
            : {}),
        ...(options.sessionId ? { 'session.id': options.sessionId } : {}),
        ...(options.clientId ? { 'hopcode.client_id': options.clientId } : {}),
        ...(options.permissionRequestId
            ? {
                'hopcode.daemon.permission.request_id': options.permissionRequestId,
            }
            : {}),
        ...(options.deferredRuntimeWaitMs !== undefined
            ? {
                'qwen-code.daemon.runtime.wait_ms': options.deferredRuntimeWaitMs,
            }
            : {}),
        ...(options.deferredRuntimePath
            ? { 'qwen-code.daemon.runtime.path': options.deferredRuntimePath }
            : {}),
    }, fn, { autoOkOnSuccess: false, startTime: options.startTime });
}
export async function withDaemonBridgeSpan(operation, attributes, fn) {
    return await withDaemonSpan(SPAN_DAEMON_BRIDGE, {
        'hopcode.daemon.operation': operation,
        ...attributes,
    }, async () => await fn());
}
export function recordDaemonHttpResponse(span, statusCode) {
    try {
        span?.setAttribute('http.response.status_code', statusCode);
    }
    catch {
        // Telemetry must not affect request handling.
    }
}
export function addDaemonRequestAttribute(key, value) {
    try {
        trace.getSpan(otelContext.active())?.setAttribute(key, value);
    }
    catch {
        // Telemetry must not affect request handling.
    }
}
export function recordDaemonError(span, error, attributes = {}) {
    const target = span ?? trace.getSpan(otelContext.active());
    if (!target)
        return;
    try {
        const message = truncateSpanError(errorMessage(error));
        target.recordException(error instanceof Error ? error : new Error(message));
        target.setAttributes({
            'error.type': errorType(error),
            'error.message': message,
            ...attributes,
        });
        target.setStatus({ code: SpanStatusCode.ERROR, message });
    }
    catch {
        // Telemetry must not affect request handling.
    }
}
export function emitDaemonLog(body, attributes = {}, options) {
    if (!isTelemetrySdkInitialized())
        return;
    try {
        logs.getLogger(SERVICE_NAME).emit({
            body,
            timestamp: new Date(),
            attributes: {
                'event.name': options?.eventName ?? EVENT_DAEMON_ERROR,
                ...attributes,
            },
            ...(options?.severityNumber != null
                ? { severityNumber: options.severityNumber }
                : {}),
        });
    }
    catch {
        // Telemetry must not affect daemon behavior.
    }
}
export function captureDaemonTelemetryContext() {
    return { context: otelContext.active() };
}
export async function runWithDaemonTelemetryContext(captured, fn) {
    const ctx = captured &&
        typeof captured === 'object' &&
        'context' in captured &&
        captured.context
        ? captured.context
        : undefined;
    if (!ctx)
        return await fn();
    return await otelContext.with(ctx, fn);
}
export function injectDaemonTraceContext(request) {
    const currentMeta = request._meta;
    const nextMeta = stripReservedTraceMeta(currentMeta);
    try {
        const ctx = getActiveSpanTraceContext();
        if (ctx) {
            nextMeta[DAEMON_TRACEPARENT_META_KEY] = formatTraceparent(ctx);
        }
    }
    catch {
        // Telemetry must not affect prompt forwarding.
    }
    if (!currentMeta && !nextMeta[DAEMON_TRACEPARENT_META_KEY]) {
        return request;
    }
    return {
        ...request,
        _meta: nextMeta,
    };
}
export function extractDaemonTraceContext(source) {
    const meta = source?._meta;
    if (!meta || typeof meta !== 'object' || Array.isArray(meta)) {
        return undefined;
    }
    const record = meta;
    const traceparent = record[DAEMON_TRACEPARENT_META_KEY];
    if (typeof traceparent !== 'string' || traceparent.length === 0) {
        return undefined;
    }
    const carrier = { traceparent };
    const tracestate = record[DAEMON_TRACESTATE_META_KEY];
    if (typeof tracestate === 'string' && tracestate.length > 0) {
        carrier['tracestate'] = tracestate;
    }
    const extracted = propagation.extract(ROOT_CONTEXT, carrier);
    if (trace.getSpanContext(extracted))
        return extracted;
    const parts = traceparent.split('-');
    const traceId = parts[1];
    const spanId = parts[2];
    const flags = parts[3];
    if (parts[0] !== '00' ||
        !traceId?.match(/^[0-9a-f]{32}$/) ||
        !spanId?.match(/^[0-9a-f]{16}$/) ||
        !flags?.match(/^[0-9a-f]{2}$/) ||
        traceId === INVALID_TRACE_ID ||
        spanId === INVALID_SPAN_ID) {
        return undefined;
    }
    return trace.setSpan(ROOT_CONTEXT, trace.wrapSpanContext({
        traceId,
        spanId,
        traceFlags: Number.parseInt(flags, 16),
        isRemote: true,
    }));
}
export function createDaemonBridgeTelemetry() {
    return {
        captureContext: captureDaemonTelemetryContext,
        runWithContext: runWithDaemonTelemetryContext,
        withSpan: withDaemonBridgeSpan,
        setActiveSpanAttributes(attributes) {
            if (!isTelemetrySdkInitialized())
                return;
            try {
                trace.getSpan(otelContext.active())?.setAttributes(attributes);
            }
            catch {
                // Telemetry must not affect bridge behavior.
            }
        },
        event(name, attributes) {
            if (!isTelemetrySdkInitialized())
                return;
            try {
                const activeSpan = trace.getSpan(otelContext.active());
                if (activeSpan) {
                    activeSpan.addEvent(name, attributes);
                    return;
                }
                const span = trace
                    .getTracer(SERVICE_NAME)
                    .startSpan(SPAN_DAEMON_BRIDGE, {
                    kind: SpanKind.INTERNAL,
                    attributes: {
                        'event.name': name,
                        'hopcode.daemon.operation': `event.${name}`,
                        ...attributes,
                    },
                });
                span.addEvent(name, attributes);
                span.setStatus({ code: SpanStatusCode.OK });
                span.end();
            }
            catch {
                // Telemetry must not affect bridge behavior.
            }
        },
        injectPromptContext: injectDaemonTraceContext,
    };
}
//# sourceMappingURL=daemon-tracing.js.map