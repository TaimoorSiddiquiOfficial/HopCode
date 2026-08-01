/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { DaemonTransportClosedError } from './DaemonTransport.js';
import { DaemonHttpError } from './DaemonHttpError.js';
import { parseSseStream } from './sse.js';
/**
 * Default REST+SSE transport. Delegates `fetch()` to the underlying
 * `_fetch` callable and implements `subscribeEvents()` by opening an
 * SSE connection to `GET /session/:id/events`.
 *
 * This is the transport `DaemonClient` uses when no explicit transport
 * is provided — it exactly reproduces the pre-abstraction behavior.
 */
export class RestSseTransport {
    baseUrl;
    token;
    _fetch;
    _disposed = false;
    type = 'rest';
    supportsReplay = true;
    restFetch;
    constructor(baseUrl, token, fetchFn) {
        this.baseUrl = baseUrl;
        this.token = token;
        this._fetch = fetchFn;
        this.restFetch = fetchFn;
    }
    get connected() {
        return !this._disposed;
    }
    async fetch(url, init, _opts) {
        if (this._disposed) {
            throw new DaemonTransportClosedError();
        }
        return this._fetch(url, init);
    }
    /**
     * Open an SSE stream for the given session. Mirrors the inline
     * logic that previously lived in `DaemonClient.subscribeEvents`:
     *   - connect-phase timeout via AbortController
     *   - `Last-Event-ID` header
     *   - `?maxQueued=N` query param
     *   - content-type validation
     *   - delegation to `parseSseStream`
     */
    async *subscribeEvents(sessionId, opts = {}) {
        if (this._disposed) {
            throw new DaemonTransportClosedError();
        }
        const headers = { Accept: 'text/event-stream' };
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        if (opts.lastEventId !== undefined) {
            headers['Last-Event-ID'] = String(opts.lastEventId);
        }
        // Connect-phase timeout (request → headers received). The SSE
        // body itself is long-lived and must NOT be timed out.
        const connectCtrl = new AbortController();
        let connectTimer;
        const connectTimeoutMs = opts.connectTimeoutMs;
        if (connectTimeoutMs && Number.isFinite(connectTimeoutMs)) {
            connectTimer = setTimeout(() => connectCtrl.abort(new DOMException('Initial connect timed out', 'TimeoutError')), connectTimeoutMs);
            if (typeof connectTimer === 'object' &&
                connectTimer &&
                'unref' in connectTimer) {
                connectTimer.unref();
            }
        }
        const fetchSignal = opts.signal
            ? composeAbortSignals([opts.signal, connectCtrl.signal])
            : connectCtrl.signal;
        // Build the SSE URL, optionally with `?maxQueued=N`.
        let url = `${this.baseUrl}/session/${encodeURIComponent(sessionId)}/events`;
        if (opts.maxQueued !== undefined) {
            url += `?maxQueued=${encodeURIComponent(String(opts.maxQueued))}`;
        }
        let res;
        try {
            res = await this._fetch(url, { headers, signal: fetchSignal });
        }
        finally {
            if (connectTimer !== undefined)
                clearTimeout(connectTimer);
        }
        if (!res.ok) {
            // Read the error body for the caller.
            let body;
            try {
                const text = await res.text();
                try {
                    body = JSON.parse(text);
                }
                catch {
                    body = text;
                }
            }
            catch {
                /* body unreadable */
            }
            const detail = body && typeof body === 'object' && 'error' in body
                ? String(body.error)
                : `HTTP ${res.status}`;
            throw new DaemonHttpError(res.status, body, `GET /session/:id/events: ${detail}`);
        }
        // Content-type validation — a misconfigured proxy that swallows
        // the SSE response would otherwise silently produce zero frames.
        const ct = res.headers.get('content-type') ?? '';
        if (!ct.toLowerCase().includes('text/event-stream')) {
            try {
                await res.body?.cancel();
            }
            catch {
                /* body already consumed or no body */
            }
            throw new DaemonHttpError(res.status, ct, `GET /session/:id/events: expected content-type text/event-stream, got "${ct}"`);
        }
        if (!res.body) {
            throw new Error('No SSE body');
        }
        yield* parseSseStream(res.body, opts.signal);
    }
    dispose() {
        this._disposed = true;
    }
}
// ---------------------------------------------------------------------------
// Minimal abort-signal composition (same logic as DaemonClient's
// `composeAbortSignals` but kept transport-local to avoid a circular
// import). REST is the only transport that needs this inline; the ACP
// transports compose differently.
// ---------------------------------------------------------------------------
function composeAbortSignals(signals) {
    const anyFn = AbortSignal.any;
    if (typeof anyFn === 'function')
        return anyFn.call(AbortSignal, signals);
    const ctrl = new AbortController();
    const cleanups = [];
    const detachAll = () => {
        while (cleanups.length > 0) {
            const fn = cleanups.pop();
            try {
                fn?.();
            }
            catch {
                /* swallow */
            }
        }
    };
    for (const s of signals) {
        if (s.aborted) {
            ctrl.abort(s.reason);
            detachAll();
            return ctrl.signal;
        }
        const onAbort = () => {
            ctrl.abort(s.reason);
            detachAll();
        };
        s.addEventListener('abort', onAbort, { once: true });
        cleanups.push(() => s.removeEventListener('abort', onAbort));
    }
    ctrl.signal.addEventListener('abort', detachAll, { once: true });
    return ctrl.signal;
}
//# sourceMappingURL=RestSseTransport.js.map