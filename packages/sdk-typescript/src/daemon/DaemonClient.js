/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { MCP_RESTART_SERVER_DEADLINE_MS, MCP_RESTART_CLIENT_HEADROOM_MS, } from '@hoptrendy/acp-bridge/mcpTimeouts';
import { CHANNEL_CONTROL_DEFAULT_TIMEOUT_MS } from '@hoptrendy/acp-bridge/channelControlTimeouts';
import { DaemonAuthFlow } from './DaemonAuthFlow.js';
import { DaemonHttpError } from './DaemonHttpError.js';
import { RestSseTransport } from './RestSseTransport.js';
import { DaemonCapabilityMissingError } from './types.js';
import { parseSseStream } from './sse.js';
const WORKSPACE_MEMORY_REMEMBER_PATH = '/workspace/memory/remember';
const WORKSPACE_MEMORY_FORGET_PATH = '/workspace/memory/forget';
const WORKSPACE_MEMORY_DREAM_PATH = '/workspace/memory/dream';
function parseSessionGenerationEvent(value) {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
        return undefined;
    }
    const event = value;
    if (event['v'] !== 1 || typeof event['type'] !== 'string')
        return undefined;
    const requestId = event['requestId'];
    const modelSource = event['modelSource'];
    const validRequestId = typeof requestId === 'string' && requestId.length > 0;
    const validModelSource = modelSource === 'fast' || modelSource === 'main';
    const validTokenCount = (count) => count === undefined ||
        (typeof count === 'number' && Number.isSafeInteger(count) && count >= 0);
    if (event['type'] === 'started') {
        if (!validRequestId ||
            typeof event['model'] !== 'string' ||
            !validModelSource) {
            return undefined;
        }
    }
    else if (event['type'] === 'thinking') {
        if (!validRequestId)
            return undefined;
    }
    else if (event['type'] === 'delta') {
        if (!validRequestId ||
            !Number.isSafeInteger(event['seq']) ||
            event['seq'] < 0 ||
            typeof event['text'] !== 'string' ||
            event['text'].length === 0) {
            return undefined;
        }
    }
    else if (event['type'] === 'done') {
        if (!validRequestId ||
            typeof event['model'] !== 'string' ||
            !validModelSource ||
            !validTokenCount(event['inputTokens']) ||
            !validTokenCount(event['outputTokens'])) {
            return undefined;
        }
    }
    else if (event['type'] === 'error') {
        if (typeof event['code'] !== 'string' ||
            typeof event['message'] !== 'string') {
            return undefined;
        }
    }
    else {
        return undefined;
    }
    return event;
}
const DEFAULT_SESSION_LIST_PAGE_SIZE = 20;
const DEFAULT_FETCH_TIMEOUT_MS = 30_000;
const VOICE_TRANSCRIPTION_DEFAULT_TIMEOUT_MS = 65_000;
const GITHUB_SETUP_DEFAULT_TIMEOUT_MS = 90_000;
const MAX_TIMER_DELAY_MS = 2_147_483_647;
// Keep in sync with acp-bridge bridge.ts and CLI serve/server.ts.
const DEFAULT_MAX_PENDING_PROMPTS_PER_SESSION = 5;
// Server deadline + headroom so the client never races the daemon's own budget.
const MCP_RESTART_DEFAULT_TIMEOUT_MS = MCP_RESTART_SERVER_DEADLINE_MS + MCP_RESTART_CLIENT_HEADROOM_MS;
const CLIENT_ID_HEADER = 'X-Qwen-Client-Id';
const urlEncode = encodeURIComponent;
function transcriptPageSuffix(opts) {
    const query = new URLSearchParams();
    if (opts.cursor !== undefined)
        query.set('cursor', opts.cursor);
    if (opts.beforeRecordId !== undefined) {
        query.set('beforeRecordId', opts.beforeRecordId);
    }
    if (opts.limit !== undefined)
        query.set('limit', String(opts.limit));
    const value = query.toString();
    return value ? `?${value}` : '';
}
function normalizePermissionRuleInput(rule) {
    const trimmed = rule.trim();
    if (!trimmed) {
        throw new Error('rule must be a non-empty string');
    }
    return trimmed;
}
export function normalizePendingPromptLimit(value) {
    if (value === undefined)
        return DEFAULT_MAX_PENDING_PROMPTS_PER_SESSION;
    if (value === null || value === 0 || value === Infinity) {
        return Infinity;
    }
    if (!Number.isInteger(value) || value < 0) {
        throw new TypeError('bad maxPendingPromptsPerSession');
    }
    return value;
}
/**
 * Strip any trailing slashes from a base URL via plain string ops. The
 * obvious `replace(/\/+$/, '')` is technically linear here (the regex is
 * end-anchored), but CodeQL's ReDoS detector flags any `\/+$` pattern as a
 * polynomial-regex risk on attacker-controlled input. Hand-rolling the loop
 * sidesteps the rule entirely.
 */
function stripTrailingSlashes(url) {
    let end = url.length;
    while (end > 0 && url.charCodeAt(end - 1) === 0x2f /* '/' */)
        end--;
    return end === url.length ? url : url.slice(0, end);
}
/**
 * SDK env fallback for the daemon bearer token. Mirrors the daemon-side
 * `--token` CLI fallback to `QWEN_SERVER_TOKEN` so a developer with
 * `export QWEN_SERVER_TOKEN=...` in their shell never has to thread the
 * value through every `DaemonClient` construction.
 *
 * Defensive on three axes:
 *   1. **Browser-safe**: `globalThis.process` indirection. The SDK is
 *      imported by `@hoptrendy/webui`; a literal
 *      `process.env[...]` would explode at module load on browser
 *      bundles. Browser globals don't expose `process` so this returns
 *      `undefined` cleanly there.
 *   2. **Whitespace stripped**: matches the daemon-side trim behavior
 *      documented in the `qwen-serve` user guide under the CLI flags
 *      section â€” handy for `$(cat token.txt)` that produces a trailing
 *      newline.
 *   3. **Empty / whitespace-only treated as unset**: a stale
 *      `export QWEN_SERVER_TOKEN=""` would otherwise let the
 *      Authorization header through as `Bearer ` (no token), which
 *      the daemon rejects but is confusing to debug. Returning
 *      `undefined` here means the constructor's `?? readTokenFromEnv()`
 *      fallback chain treats both "unset" and "set-but-empty"
 *      identically â€” no header sent.
 */
function readTokenFromEnv() {
    try {
        const proc = globalThis.process;
        const raw = proc?.env?.['QWEN_SERVER_TOKEN'];
        if (typeof raw !== 'string')
            return undefined;
        const trimmed = raw.trim();
        return trimmed.length === 0 ? undefined : trimmed;
    }
    catch {
        return undefined;
    }
}
// Re-export DaemonHttpError from its dedicated module so existing
// `import { DaemonHttpError } from './DaemonClient.js'` continues to
// work. The class itself lives in DaemonHttpError.ts to break the
// import chain from RestSseTransport â†’ DaemonClient (browser bundle).
export { DaemonHttpError } from './DaemonHttpError.js';
/**
 * SDK-side representation of the daemon's `prompt_queue_full` condition.
 * Mirrors the bridge-side `PromptQueueFullError` wire data.
 */
export class DaemonPendingPromptLimitError extends Error {
    constructor(sessionId, limit, pendingCount) {
        super(`Pending prompts full: "${sessionId}" (${pendingCount}/${limit})`);
        this.name = 'DaemonPendingPromptLimitError';
        this.sessionId = sessionId;
        this.limit = limit;
        this.pendingCount = pendingCount;
    }
}
export function isDaemonTurnError(error) {
    return (typeof error === 'object' &&
        error !== null &&
        error._daemonTurnError === true);
}
export class DaemonClient {
    baseUrl;
    token;
    _fetch;
    fetchTimeoutMs;
    promptLimit;
    promptCounts = Object.create(null);
    /**
     * Pluggable transport layer. Defaults to `RestSseTransport` when
     * no explicit transport is supplied â€” preserving the pre-abstraction
     * REST+SSE behavior with zero breaking changes.
     */
    transport;
    // Lazy singleton so clients that never touch auth pay no allocation cost.
    // Exposed via the readonly `auth` accessor below.
    _authFlow;
    /**
     * High-level auth helper. Wraps the four
     * `*DeviceFlow*` methods with a `start(...).awaitCompletion()` shape
     * for the common "log in remotely" UX. Lazy-constructed.
     */
    get auth() {
        if (!this._authFlow) {
            this._authFlow = new DaemonAuthFlow(this);
        }
        return this._authFlow;
    }
    constructor(opts) {
        this.baseUrl = stripTrailingSlashes(opts.baseUrl);
        // When no explicit token is passed, fall back to
        // QWEN_SERVER_TOKEN env var so clients with
        // `export QWEN_SERVER_TOKEN=...` in their shell don't have to
        // thread the value through every construction. See
        // `readTokenFromEnv` above for browser-safety + trim semantics.
        this.token = opts.token ?? readTokenFromEnv();
        this._fetch =
            opts.fetch ??
                opts.transport?.restFetch ??
                globalThis.fetch.bind(globalThis);
        // Coerce non-positive / non-finite to 0 (= disabled). Without this
        // a caller passing `-1` or `NaN` would slip past the
        // `Number.isFinite` check inside `fetchWithTimeout` (NaN fails
        // isFinite, negatives pass) and either short-circuit timeout entirely
        // or fire `setTimeout(-1)` â†’ immediate abort, killing every request
        // before it could complete. The `0` sentinel is the documented
        // disable value, so we collapse all "doesn't make sense" inputs onto
        // it instead of defending the math at every call site.
        const raw = opts.fetchTimeoutMs ?? DEFAULT_FETCH_TIMEOUT_MS;
        this.fetchTimeoutMs = Number.isFinite(raw) && raw > 0 ? raw : 0;
        this.promptLimit = normalizePendingPromptLimit(opts.maxPendingPromptsPerSession);
        this.transport =
            opts.transport ??
                new RestSseTransport(this.baseUrl, this.token, this._fetch);
    }
    get maxPendingPromptsPerSession() {
        return this.promptLimit;
    }
    /** @internal */
    reservePromptSlot(sessionId, limit = this.promptLimit) {
        if (limit === Infinity)
            return () => { };
        const promptCounts = this.promptCounts;
        const pendingCount = promptCounts[sessionId] ?? 0;
        if (pendingCount >= limit) {
            throw new DaemonPendingPromptLimitError(sessionId, limit, pendingCount);
        }
        promptCounts[sessionId] = pendingCount + 1;
        let released;
        return () => {
            if (released)
                return;
            released = true;
            if ((promptCounts[sessionId] ?? 0) <= 1) {
                delete promptCounts[sessionId];
            }
            else {
                --promptCounts[sessionId];
            }
        };
    }
    /**
     * Wrap a fetch call with the per-client `fetchTimeoutMs`. If the caller
     * passes their own `signal`, both signals abort the request via
     * `AbortSignal.any`, so caller cancellation and the per-call timeout
     * compose. Streaming endpoints (subscribeEvents) call `_fetch` directly
     * to skip the timeout â€” long-lived SSE connections must not be killed
     * by it.
     */
    async fetchWithTimeout(url, init = {}, consume, perCallTimeoutMs, mode = 'transport') {
        // When `consume` is provided, the timer must remain
        // armed through the entire callback (body read + parse). The
        // previous `Response`-returning shape cleared the timer the
        // moment headers arrived, so `await res.json()` against a
        // proxy that stalled mid-body could hang indefinitely past
        // `fetchTimeoutMs`. Pass the body-reading code as a callback
        // so its execution is included in the timer scope; the
        // composed abort signal still flows through to fetch's body
        // stream, so an in-progress `res.json()` rejects cleanly when
        // the timer fires.
        //
        // `perCallTimeoutMs` lets a single call (e.g. `restartMcpServer`,
        // where the daemon waits up to 300s for MCP rediscovery) override
        // the client-wide default.
        //
        // Accept finite, non-negative values -- including `0`, which the
        // `restartMcpServer` JSDoc documents as "disable the timeout
        // entirely". Zero falls through to the no-timeout branch below
        // via the `!effectiveTimeoutMs` truthiness check. NaN / negative
        // inputs still coerce back to the client-wide default so callers
        // can pass a derived expression without defending the math at
        // every site.
        let effectiveTimeoutMs = this.fetchTimeoutMs;
        if (perCallTimeoutMs !== undefined &&
            Number.isFinite(perCallTimeoutMs) &&
            perCallTimeoutMs >= 0) {
            effectiveTimeoutMs = perCallTimeoutMs;
        }
        if (!effectiveTimeoutMs || !Number.isFinite(effectiveTimeoutMs)) {
            const res = mode === 'rest'
                ? await this._fetch(url, init)
                : await this.transport.fetch(url, init);
            if (consume)
                return consume(res);
            return res;
        }
        // Use AbortController + cancellable setTimeout instead of
        // `AbortSignal.timeout()` (the polyfill `abortTimeout` is the
        // same shape â€” fires once, never disarms). On a fast-resolving
        // request with a long `fetchTimeoutMs` (e.g. 30s default), the
        // pending timer keeps the event loop registration alive even
        // after the fetch already returned. High request volume Ã— long
        // timeout = accumulating timers + retained closures. Clearing
        // in `finally` releases each timer the moment its fetch (and
        // body consume callback, if any) settles.
        const ctrl = new AbortController();
        const timer = setTimeout(() => {
            ctrl.abort(new DOMException('timeout', 'TimeoutError'));
        }, effectiveTimeoutMs);
        if (typeof timer === 'object' && timer && 'unref' in timer) {
            timer.unref();
        }
        const callerSignal = init.signal ?? undefined;
        const signal = callerSignal
            ? composeAbortSignals([callerSignal, ctrl.signal])
            : ctrl.signal;
        try {
            const res = mode === 'rest'
                ? await this._fetch(url, { ...init, signal })
                : await this.transport.fetch(url, { ...init, signal });
            if (consume)
                return await consume(res);
            return res;
        }
        finally {
            clearTimeout(timer);
        }
    }
    // -- Plumbing -----------------------------------------------------------
    headers(extra = {}, clientId) {
        const out = { ...extra };
        if (this.token)
            out['Authorization'] = `Bearer ${this.token}`;
        if (clientId)
            out[CLIENT_ID_HEADER] = clientId;
        return out;
    }
    async failOnError(res, label, sessionId) {
        // Read the body exactly once. `res.json()` consumes the stream even on
        // parse-failure, leaving a subsequent `res.text()` empty â€” so go via
        // text() and attempt JSON parsing ourselves; raw text is a useful
        // fallback (the daemon may surface text/plain on upstream errors).
        let body = undefined;
        try {
            const text = await res.text();
            if (text.length > 0) {
                try {
                    body = JSON.parse(text);
                }
                catch {
                    body = text;
                }
            }
        }
        catch {
            /* body unreadable */
        }
        const detail = body && typeof body === 'object' && 'error' in body
            ? String(body.error)
            : `HTTP ${res.status}`;
        if (sessionId && res.status === 503 && body && typeof body === 'object') {
            const data = body;
            if (data.code === 'prompt_queue_full') {
                return new DaemonPendingPromptLimitError(typeof data.sessionId === 'string' ? data.sessionId : sessionId, typeof data.limit === 'number' ? data.limit : 0, typeof data.pendingCount === 'number' ? data.pendingCount : 0);
            }
        }
        return new DaemonHttpError(res.status, body, `${label}: ${detail}`);
    }
    async jsonRequest(path, label, opts = {}) {
        const hasBody = opts.body !== undefined;
        return await this.fetchWithTimeout(`${this.baseUrl}${path}`, {
            ...(opts.method ? { method: opts.method } : {}),
            headers: this.headers(hasBody ? { 'Content-Type': 'application/json' } : {}, opts.clientId),
            ...(hasBody ? { body: JSON.stringify(opts.body) } : {}),
            ...(opts.signal ? { signal: opts.signal } : {}),
        }, async (res) => {
            if (!res.ok)
                throw await this.failOnError(res, label);
            return (await res.json());
        }, opts.timeoutMs, opts.mode);
    }
    /** @internal */
    async workspaceJsonRequest(workspaceSelector, path, label, opts = {}) {
        return await this.jsonRequest(`/workspaces/${workspaceSelector}${path}`, label, opts);
    }
    /** @internal */
    async sessionExportRequest(path, label, opts = {}) {
        const format = opts.format ?? 'html';
        const query = opts.format ? `?format=${urlEncode(opts.format)}` : '';
        return await this.fetchWithTimeout(`${this.baseUrl}${path}${query}`, { headers: this.headers({}, opts.clientId) }, async (res) => {
            if (!res.ok) {
                throw await this.failOnError(res, label);
            }
            const content = await res.text();
            const mimeType = res.headers.get('content-type') ?? '';
            const filename = /filename="([^"]+)"/i.exec(res.headers.get('content-disposition') ?? '')?.[1] ?? `export.${format}`;
            return {
                content,
                filename,
                mimeType,
                format,
            };
        }, undefined, 'rest');
    }
    /** @internal */
    async workspaceNoContentRequest(workspaceSelector, path, label, opts = {}) {
        return await this.fetchWithTimeout(`${this.baseUrl}/workspaces/${workspaceSelector}${path}`, {
            ...(opts.method ? { method: opts.method } : {}),
            headers: this.headers({}, opts.clientId),
        }, async (res) => {
            if (res.status === 204) {
                try {
                    await res.body?.cancel();
                }
                catch {
                    /* body already consumed or no body */
                }
                return;
            }
            if (res.status === 404 && opts.okNotFoundCode) {
                const err = await this.failOnError(res, label);
                const body = err.body;
                if (body?.code === opts.okNotFoundCode)
                    return;
                throw err;
            }
            throw await this.failOnError(res, label);
        }, opts.timeoutMs);
    }
    workspaceById(workspaceId) {
        return new WorkspaceDaemonClient(this, urlEncode(workspaceId));
    }
    workspaceByCwd(workspaceCwd) {
        return new WorkspaceDaemonClient(this, urlEncode(workspaceCwd));
    }
    // -- Lifecycle / discovery ---------------------------------------------
    async health() {
        return await this.fetchWithTimeout(`${this.baseUrl}/health`, { headers: this.headers() }, async (res) => {
            if (!res.ok)
                throw await this.failOnError(res, 'GET /health');
            return (await res.json());
        });
    }
    async capabilities() {
        return await this.fetchWithTimeout(`${this.baseUrl}/capabilities`, { headers: this.headers() }, async (res) => {
            if (!res.ok)
                throw await this.failOnError(res, 'GET /capabilities');
            return (await res.json());
        });
    }
    async requireCapability(capability) {
        const caps = await this.capabilities();
        if (!caps.features.includes(capability)) {
            throw new DaemonCapabilityMissingError(capability, `daemon does not advertise the ${capability} feature`);
        }
    }
    /**
     * Consolidated daemon status report (`GET /daemon/status`). The default
     * `summary` detail reads cheap in-memory counters; `full` adds per-session,
     * ACP-connection, auth, and workspace diagnostics sections.
     */
    async daemonStatus(detail = 'summary') {
        const query = detail === 'summary' ? '' : `?detail=${detail}`;
        return await this.jsonRequest(`/daemon/status${query}`, 'GET /daemon/status');
    }
    /**
     * Aggregate local token-usage dashboard (`GET /usage/dashboard`): the
     * selected range's flattened totals plus a trailing per-day heatmap, read
     * from the durable local usage history (global, cross-project). `range`
     * scopes the summary (default `today`); `heatmapDays` sets the heatmap
     * window (default ~6 months, server-clamped to 1..366).
     */
    async usageDashboard(opts = {}) {
        const params = new URLSearchParams();
        if (opts.range !== undefined)
            params.set('range', opts.range);
        if (opts.heatmapDays !== undefined) {
            params.set('heatmapDays', String(opts.heatmapDays));
        }
        const query = params.toString();
        return await this.jsonRequest(`/usage/dashboard${query ? `?${query}` : ''}`, 'GET /usage/dashboard');
    }
    async workspaceMcp() {
        return await this.fetchWithTimeout(`${this.baseUrl}/workspace/mcp`, { headers: this.headers() }, async (res) => {
            if (!res.ok)
                throw await this.failOnError(res, 'GET /workspace/mcp');
            return (await res.json());
        });
    }
    async initializeWorkspaceMcp() {
        return await this.fetchWithTimeout(`${this.baseUrl}/workspace/mcp/initialize`, {
            method: 'POST',
            headers: this.headers({ 'Content-Type': 'application/json' }),
            body: '{}',
        }, async (res) => {
            if (!res.ok) {
                throw await this.failOnError(res, 'POST /workspace/mcp/initialize');
            }
            return (await res.json());
        });
    }
    async reloadWorkspaceMcp() {
        return await this.fetchWithTimeout(`${this.baseUrl}/workspace/mcp/reload`, {
            method: 'POST',
            headers: this.headers({ 'Content-Type': 'application/json' }),
            body: '{}',
        }, async (res) => {
            if (!res.ok) {
                throw await this.failOnError(res, 'POST /workspace/mcp/reload');
            }
            return (await res.json());
        });
    }
    async workspaceGit() {
        return await this.jsonRequest('/workspace/git', 'GET /workspace/git', { mode: 'rest' });
    }
    async workspaceGitDiff() {
        return await this.jsonRequest('/workspace/git/diff', 'GET /workspace/git/diff', { mode: 'rest' });
    }
    async workspaceGitDiffFile(path, oldPath) {
        const query = `/workspace/git/diff/file?path=${urlEncode(path)}` +
            (oldPath != null ? `&oldPath=${urlEncode(oldPath)}` : '');
        return await this.jsonRequest(query, 'GET /workspace/git/diff/file', { mode: 'rest' });
    }
    async workspaceMcpTools(serverName) {
        return await this.fetchWithTimeout(`${this.baseUrl}/workspace/mcp/${urlEncode(serverName)}/tools`, { headers: this.headers() }, async (res) => {
            if (!res.ok) {
                throw await this.failOnError(res, 'GET /workspace/mcp/:server/tools');
            }
            return (await res.json());
        });
    }
    async workspaceMcpResources(serverName) {
        return await this.fetchWithTimeout(`${this.baseUrl}/workspace/mcp/${urlEncode(serverName)}/resources`, { headers: this.headers() }, async (res) => {
            if (!res.ok) {
                throw await this.failOnError(res, 'GET /workspace/mcp/:server/resources');
            }
            return (await res.json());
        });
    }
    async workspaceSkills() {
        return await this.fetchWithTimeout(`${this.baseUrl}/workspace/skills`, { headers: this.headers() }, async (res) => {
            if (!res.ok) {
                throw await this.failOnError(res, 'GET /workspace/skills');
            }
            return (await res.json());
        });
    }
    async workspaceAcpPreheat(timeoutMs) {
        const serverBudgetMs = timeoutMs ?? 5_000;
        const suffix = timeoutMs !== undefined
            ? `?timeoutMs=${encodeURIComponent(timeoutMs)}`
            : '';
        return await this.fetchWithTimeout(`${this.baseUrl}/workspace/acp/preheat${suffix}`, { method: 'POST', headers: this.headers() }, async (res) => {
            if (!res.ok) {
                throw await this.failOnError(res, 'POST /workspace/acp/preheat');
            }
            return (await res.json());
        }, serverBudgetMs + 2_000);
    }
    async workspaceAcpStatus() {
        return await this.fetchWithTimeout(`${this.baseUrl}/workspace/acp/status`, { headers: this.headers() }, async (res) => {
            if (!res.ok) {
                throw await this.failOnError(res, 'GET /workspace/acp/status');
            }
            return (await res.json());
        });
    }
    async workspaceProviders() {
        return await this.fetchWithTimeout(`${this.baseUrl}/workspace/providers`, { headers: this.headers() }, async (res) => {
            if (!res.ok) {
                throw await this.failOnError(res, 'GET /workspace/providers');
            }
            return (await res.json());
        });
    }
    async workspaceHooks() {
        return await this.fetchWithTimeout(`${this.baseUrl}/workspace/hooks`, { headers: this.headers() }, async (res) => {
            if (!res.ok)
                throw await this.failOnError(res, 'GET /workspace/hooks');
            return (await res.json());
        });
    }
    async sessionHooks(sessionId) {
        return await this.fetchWithTimeout(`${this.baseUrl}/session/${urlEncode(sessionId)}/hooks`, { headers: this.headers() }, async (res) => {
            if (!res.ok)
                throw await this.failOnError(res, 'GET /session/:id/hooks');
            return (await res.json());
        });
    }
    async workspaceExtensions() {
        return await this.jsonRequest('/workspace/extensions', 'GET /workspace/extensions', { mode: 'rest' });
    }
    async installExtension(params, clientId) {
        return await this.jsonRequest('/workspace/extensions/install', 'POST /workspace/extensions/install', { method: 'POST', body: params, clientId, mode: 'rest' });
    }
    async extensionOperationStatus(operationId) {
        return await this.jsonRequest(`/workspace/extensions/operations/${urlEncode(operationId)}`, 'GET /workspace/extensions/operations/:operationId', { mode: 'rest' });
    }
    async activeExtensionOperations() {
        return await this.jsonRequest('/workspace/extensions/operations', 'GET /workspace/extensions/operations', { mode: 'rest' });
    }
    async respondToExtensionInteraction(operationId, interactionId, response, clientId) {
        return await this.jsonRequest(`/workspace/extensions/operations/${urlEncode(operationId)}/interactions/${urlEncode(interactionId)}`, 'POST /workspace/extensions/operations/:operationId/interactions/:interactionId', { method: 'POST', body: response, clientId, mode: 'rest' });
    }
    async checkExtensionUpdates(clientId) {
        return await this.jsonRequest('/workspace/extensions/check-updates', 'POST /workspace/extensions/check-updates', { method: 'POST', body: {}, clientId, mode: 'rest' });
    }
    async refreshExtensions(clientId) {
        return await this.jsonRequest('/workspace/extensions/refresh', 'POST /workspace/extensions/refresh', { method: 'POST', body: {}, clientId, mode: 'rest' });
    }
    async enableExtension(name, params, clientId) {
        return await this.jsonRequest(`/workspace/extensions/${urlEncode(name)}/enable`, 'POST /workspace/extensions/:name/enable', { method: 'POST', body: params, clientId, mode: 'rest' });
    }
    async disableExtension(name, params, clientId) {
        return await this.jsonRequest(`/workspace/extensions/${urlEncode(name)}/disable`, 'POST /workspace/extensions/:name/disable', { method: 'POST', body: params, clientId, mode: 'rest' });
    }
    async updateExtension(name, clientId) {
        return await this.jsonRequest(`/workspace/extensions/${urlEncode(name)}/update`, 'POST /workspace/extensions/:name/update', { method: 'POST', body: {}, clientId, mode: 'rest' });
    }
    async uninstallExtension(name, clientId) {
        return await this.jsonRequest(`/workspace/extensions/${urlEncode(name)}`, 'DELETE /workspace/extensions/:name', { method: 'DELETE', clientId, mode: 'rest' });
    }
    async extensionCatalog() {
        return await this.jsonRequest('/extensions', 'GET /extensions', { mode: 'rest' });
    }
    async installUserExtension(params, clientId) {
        return await this.jsonRequest('/extensions/install', 'POST /extensions/install', { method: 'POST', body: params, clientId, mode: 'rest' });
    }
    async checkUserExtensionUpdates(clientId) {
        return await this.jsonRequest('/extensions/check-updates', 'POST /extensions/check-updates', { method: 'POST', body: {}, clientId, mode: 'rest' });
    }
    async updateUserExtension(extensionId, clientId) {
        return await this.jsonRequest(`/extensions/${urlEncode(extensionId)}/update`, 'POST /extensions/:extensionId/update', { method: 'POST', body: {}, clientId, mode: 'rest' });
    }
    async uninstallUserExtension(extensionId, clientId) {
        return await this.fetchWithTimeout(`${this.baseUrl}/extensions/${urlEncode(extensionId)}`, {
            method: 'DELETE',
            headers: this.headers({}, clientId),
        }, async (res) => {
            if (res.status === 204) {
                await res.body?.cancel().catch(() => undefined);
                return undefined;
            }
            if (!res.ok) {
                throw await this.failOnError(res, 'DELETE /extensions/:extensionId');
            }
            return (await res.json());
        }, undefined, 'rest');
    }
    async setExtensionDefaultActivation(extensionId, state, clientId) {
        return await this.jsonRequest(`/extensions/${urlEncode(extensionId)}/activation`, 'PUT /extensions/:extensionId/activation', { method: 'PUT', body: { state }, clientId, mode: 'rest' });
    }
    async extensionOperation(operationId, signal) {
        return await this.jsonRequest(`/extensions/operations/${urlEncode(operationId)}`, 'GET /extensions/operations/:operationId', signal ? { signal, mode: 'rest' } : { mode: 'rest' });
    }
    async waitForExtensionOperation(handle, options = {}) {
        const pollIntervalMs = options.pollIntervalMs ?? 1_000;
        const timeoutMs = options.timeoutMs ?? 10 * 60_000;
        const hasDeadline = timeoutMs !== Number.POSITIVE_INFINITY;
        const deadline = Date.now() + timeoutMs;
        const timeoutError = () => new Error(`Timed out waiting for extension operation ${handle.operationId}. The server operation was not cancelled.`);
        for (;;) {
            options.signal?.throwIfAborted();
            const pollBudgetMs = deadline - Date.now();
            if (pollBudgetMs <= 0 || Number.isNaN(pollBudgetMs)) {
                throw timeoutError();
            }
            let operation;
            if (!hasDeadline) {
                operation = await this.extensionOperation(handle.operationId, options.signal);
            }
            else {
                const deadlineController = new AbortController();
                const pollSignal = options.signal
                    ? composeAbortSignals([options.signal, deadlineController.signal])
                    : deadlineController.signal;
                let deadlineTimer;
                const deadlinePromise = new Promise((_, reject) => {
                    const expire = () => {
                        const error = timeoutError();
                        reject(error);
                        deadlineController.abort(error);
                    };
                    const schedule = () => {
                        const remainingMs = deadline - Date.now();
                        if (remainingMs <= 0) {
                            expire();
                            return;
                        }
                        deadlineTimer = setTimeout(() => {
                            if (Date.now() >= deadline) {
                                expire();
                            }
                            else {
                                schedule();
                            }
                        }, Math.min(remainingMs, MAX_TIMER_DELAY_MS));
                    };
                    schedule();
                });
                try {
                    operation = await Promise.race([
                        this.extensionOperation(handle.operationId, pollSignal),
                        deadlinePromise,
                    ]);
                }
                finally {
                    if (deadlineTimer !== undefined)
                        clearTimeout(deadlineTimer);
                    deadlineController.abort();
                }
            }
            if (operation.status !== 'queued' && operation.status !== 'running') {
                return operation;
            }
            const remainingMs = deadline - Date.now();
            if (remainingMs <= 0) {
                throw timeoutError();
            }
            await new Promise((resolve, reject) => {
                const finish = () => {
                    options.signal?.removeEventListener('abort', onAbort);
                    resolve();
                };
                const timer = setTimeout(finish, Math.min(pollIntervalMs, remainingMs, MAX_TIMER_DELAY_MS));
                const onAbort = () => {
                    clearTimeout(timer);
                    options.signal?.removeEventListener('abort', onAbort);
                    reject(options.signal?.reason ?? new DOMException('Aborted', 'AbortError'));
                };
                options.signal?.addEventListener('abort', onAbort, { once: true });
                if (options.signal?.aborted)
                    onAbort();
            });
        }
    }
    // -- Workspace files (workspace files) -------------------------------
    async readWorkspaceFile(filePath, opts = {}, clientId) {
        const url = new URL(`${this.baseUrl}/file`);
        url.searchParams.set('path', filePath);
        if (opts.maxBytes !== undefined) {
            url.searchParams.set('maxBytes', String(opts.maxBytes));
        }
        if (opts.line !== undefined) {
            url.searchParams.set('line', String(opts.line));
        }
        if (opts.limit !== undefined) {
            url.searchParams.set('limit', String(opts.limit));
        }
        return await this.fetchWithTimeout(url.toString(), { headers: this.headers({}, clientId) }, async (res) => {
            if (!res.ok)
                throw await this.failOnError(res, 'GET /file');
            return (await res.json());
        });
    }
    async readWorkspaceFileBytes(filePath, opts = {}, clientId) {
        const url = new URL(`${this.baseUrl}/file/bytes`);
        url.searchParams.set('path', filePath);
        if (opts.offset !== undefined) {
            url.searchParams.set('offset', String(opts.offset));
        }
        if (opts.maxBytes !== undefined) {
            url.searchParams.set('maxBytes', String(opts.maxBytes));
        }
        return await this.fetchWithTimeout(url.toString(), { headers: this.headers({}, clientId) }, async (res) => {
            if (!res.ok)
                throw await this.failOnError(res, 'GET /file/bytes');
            return (await res.json());
        });
    }
    async fileStat(filePath) {
        const url = new URL(`${this.baseUrl}/stat`);
        url.searchParams.set('path', filePath);
        return await this.fetchWithTimeout(url.toString(), { headers: this.headers() }, async (res) => {
            if (!res.ok)
                throw await this.failOnError(res, 'GET /stat');
            return (await res.json());
        });
    }
    async dirList(dirPath) {
        const url = new URL(`${this.baseUrl}/list`);
        url.searchParams.set('path', dirPath);
        return await this.fetchWithTimeout(url.toString(), { headers: this.headers() }, async (res) => {
            if (!res.ok)
                throw await this.failOnError(res, 'GET /list');
            return (await res.json());
        });
    }
    /**
     * Directory-name suggestions for an absolute path prefix, for flows that
     * pick a path outside any registered workspace (e.g. "Add workspace").
     */
    async workspacePathSuggestions(prefix) {
        const url = new URL(`${this.baseUrl}/workspace-path-suggestions`);
        url.searchParams.set('prefix', prefix);
        return await this.fetchWithTimeout(url.toString(), { headers: this.headers() }, async (res) => {
            if (!res.ok) {
                throw await this.failOnError(res, 'GET /workspace-path-suggestions');
            }
            return (await res.json());
        });
    }
    async glob(pattern) {
        const url = new URL(`${this.baseUrl}/glob`);
        url.searchParams.set('pattern', pattern);
        return await this.fetchWithTimeout(url.toString(), { headers: this.headers() }, async (res) => {
            if (!res.ok)
                throw await this.failOnError(res, 'GET /glob');
            return (await res.json());
        });
    }
    async writeWorkspaceFile(req, clientId) {
        return await this.fetchWithTimeout(`${this.baseUrl}/file/write`, {
            method: 'POST',
            headers: this.headers({ 'Content-Type': 'application/json' }, clientId),
            body: JSON.stringify(req),
        }, async (res) => {
            if (!res.ok)
                throw await this.failOnError(res, 'POST /file/write');
            return (await res.json());
        });
    }
    async editWorkspaceFile(req, clientId) {
        return await this.fetchWithTimeout(`${this.baseUrl}/file/edit`, {
            method: 'POST',
            headers: this.headers({ 'Content-Type': 'application/json' }, clientId),
            body: JSON.stringify(req),
        }, async (res) => {
            if (!res.ok)
                throw await this.failOnError(res, 'POST /file/edit');
            return (await res.json());
        });
    }
    // -- Workspace memory (workspace memory/agents) ------------------------------
    /**
     * Fetch the daemon's `QWEN.md` / `AGENTS.md` snapshot. Read-only;
     * pre-flight `caps.features.workspace_memory` before calling
     * against an unknown daemon. Returns `initialized: false` and an
     * empty `files` array when no memory files exist at the bound
     * workspace root or `~/.qwen`.
     *
     * v1 discovers files at the bound workspace ROOT only, plus the
     * user's global `~/.qwen` directory â€” it does NOT walk parent
     * directories or recurse into the workspace tree. The route's
     * companion helper `walkWorkspaceForMemory` keeps a guarded
     * upward-walk loop body for a future hierarchical mode but breaks
     * after iteration 1 in this release.
     */
    async workspaceMemory() {
        return await this.fetchWithTimeout(`${this.baseUrl}/workspace/memory`, { headers: this.headers() }, async (res) => {
            if (!res.ok) {
                throw await this.failOnError(res, 'GET /workspace/memory');
            }
            return (await res.json());
        });
    }
    /**
     * Append to or replace `QWEN.md` at workspace or global scope.
     * Strict mutation gate (`token_required` on no-token loopback
     * defaults). When the daemon advertises `workspace_memory`, expect
     * 200 with `{ ok, filePath, bytesWritten, mode }`; older daemons
     * without the capability return 404.
     */
    async writeWorkspaceMemory(req, clientId) {
        return await this.fetchWithTimeout(`${this.baseUrl}/workspace/memory`, {
            method: 'POST',
            headers: this.headers({ 'Content-Type': 'application/json' }, clientId),
            body: JSON.stringify(req),
        }, async (res) => {
            if (!res.ok) {
                throw await this.failOnError(res, 'POST /workspace/memory');
            }
            return (await res.json());
        });
    }
    /**
     * Queue a hidden managed-memory remember task for the daemon's bound
     * workspace. This does not require an existing session; callers should
     * poll `getWorkspaceMemoryRememberTask()` until the task is terminal.
     */
    async rememberWorkspaceMemory(content, opts = {}) {
        return await this.jsonRequest(WORKSPACE_MEMORY_REMEMBER_PATH, `POST ${WORKSPACE_MEMORY_REMEMBER_PATH}`, {
            method: 'POST',
            body: {
                content,
                contextMode: opts.contextMode ?? 'workspace',
            },
            clientId: opts.clientId,
        });
    }
    async getWorkspaceMemoryRememberTask(taskId, opts) {
        return await this.jsonRequest(`${WORKSPACE_MEMORY_REMEMBER_PATH}/${urlEncode(taskId)}`, `GET ${WORKSPACE_MEMORY_REMEMBER_PATH}/:taskId`, { clientId: opts?.clientId });
    }
    async forgetWorkspaceMemory(query, opts = {}) {
        return await this.jsonRequest(WORKSPACE_MEMORY_FORGET_PATH, `POST ${WORKSPACE_MEMORY_FORGET_PATH}`, {
            method: 'POST',
            body: { query },
            clientId: opts.clientId,
        });
    }
    async getWorkspaceMemoryForgetTask(taskId, opts) {
        return await this.jsonRequest(`${WORKSPACE_MEMORY_FORGET_PATH}/${urlEncode(taskId)}`, `GET ${WORKSPACE_MEMORY_FORGET_PATH}/:taskId`, { clientId: opts?.clientId });
    }
    async dreamWorkspaceMemory(opts = {}) {
        return await this.jsonRequest(WORKSPACE_MEMORY_DREAM_PATH, `POST ${WORKSPACE_MEMORY_DREAM_PATH}`, {
            method: 'POST',
            body: {},
            clientId: opts.clientId,
        });
    }
    async getWorkspaceMemoryDreamTask(taskId, opts) {
        return await this.jsonRequest(`${WORKSPACE_MEMORY_DREAM_PATH}/${urlEncode(taskId)}`, `GET ${WORKSPACE_MEMORY_DREAM_PATH}/:taskId`, { clientId: opts?.clientId });
    }
    // -- Workspace agents (workspace memory/agents) ------------------------------
    async listWorkspaceAgents() {
        return await this.fetchWithTimeout(`${this.baseUrl}/workspace/agents`, { headers: this.headers() }, async (res) => {
            if (!res.ok) {
                throw await this.failOnError(res, 'GET /workspace/agents');
            }
            return (await res.json());
        });
    }
    /**
     * Create a project- or user-level subagent. 409 `agent_already_exists`
     * when a same-name agent is already registered at the chosen level;
     * 422 `invalid_config` for validation failures.
     */
    async createWorkspaceAgent(req, clientId) {
        return await this.fetchWithTimeout(`${this.baseUrl}/workspace/agents`, {
            method: 'POST',
            headers: this.headers({ 'Content-Type': 'application/json' }, clientId),
            body: JSON.stringify(req),
        }, async (res) => {
            if (!res.ok) {
                throw await this.failOnError(res, 'POST /workspace/agents');
            }
            return (await res.json());
        });
    }
    async generateWorkspaceAgent(description, clientId) {
        return await this.fetchWithTimeout(`${this.baseUrl}/workspace/agents/generate`, {
            method: 'POST',
            headers: this.headers({ 'Content-Type': 'application/json' }, clientId),
            body: JSON.stringify({ description }),
        }, async (res) => {
            if (!res.ok) {
                throw await this.failOnError(res, 'POST /workspace/agents/generate');
            }
            return (await res.json());
        }, MCP_RESTART_DEFAULT_TIMEOUT_MS);
    }
    async getWorkspaceAgent(agentType) {
        return await this.fetchWithTimeout(`${this.baseUrl}/workspace/agents/${urlEncode(agentType)}`, { headers: this.headers() }, async (res) => {
            if (!res.ok) {
                throw await this.failOnError(res, 'GET /workspace/agents/:agentType');
            }
            return (await res.json());
        });
    }
    /**
     * Update a project- or user-level subagent definition. Built-in /
     * extension / session-level agents are read-only and return 403
     * `agent_readonly`; missing agents return 404 `agent_not_found`.
     *
     * Optional `scope` mirrors the delete helper: when a project agent
     * shadows a user-level agent of the same name, pass
     * `{ scope: 'global' }` to update the user-level definition
     * specifically. Without the scope the daemon resolves through the
     * default precedence (project > user) and updates the project entry.
     */
    async updateWorkspaceAgent(agentType, req, opts = {}, clientId) {
        const url = opts.scope
            ? `${this.baseUrl}/workspace/agents/${urlEncode(agentType)}?scope=${urlEncode(opts.scope)}`
            : `${this.baseUrl}/workspace/agents/${urlEncode(agentType)}`;
        return await this.fetchWithTimeout(url, {
            method: 'POST',
            headers: this.headers({ 'Content-Type': 'application/json' }, clientId),
            body: JSON.stringify(req),
        }, async (res) => {
            if (!res.ok) {
                throw await this.failOnError(res, 'POST /workspace/agents/:agentType');
            }
            return (await res.json());
        });
    }
    /**
     * Delete a project- or user-level subagent definition. Optional
     * `scope` query narrows deletion to one level when the same name
     * exists at both. Idempotent for SDK callers â€” both 204 (deleted)
     * and 404 (already gone) resolve successfully.
     */
    async deleteWorkspaceAgent(agentType, opts = {}, clientId) {
        const url = opts.scope
            ? `${this.baseUrl}/workspace/agents/${urlEncode(agentType)}?scope=${urlEncode(opts.scope)}`
            : `${this.baseUrl}/workspace/agents/${urlEncode(agentType)}`;
        return await this.fetchWithTimeout(url, {
            method: 'DELETE',
            headers: this.headers({}, clientId),
        }, async (res) => {
            if (res.status === 204) {
                try {
                    await res.body?.cancel();
                }
                catch {
                    /* body already consumed or no body */
                }
                return;
            }
            // Treat as idempotent ONLY when the daemon explicitly says
            // `agent_not_found`. A bare 404 (e.g. an HTTP proxy returning
            // a generic page, an older daemon that doesn't know the
            // route, a misrouted load balancer) would otherwise be
            // silently swallowed and the SDK caller would believe the
            // agent was deleted when the request never reached a route
            // that understands workspace agents. Failing on non-
            // structured 404s makes routing errors visible.
            if (res.status === 404) {
                const err = await this.failOnError(res, 'DELETE /workspace/agents/:agentType');
                const body = err.body;
                if (body && body.code === 'agent_not_found')
                    return;
                throw err;
            }
            throw await this.failOnError(res, 'DELETE /workspace/agents/:agentType');
        });
    }
    async workspaceEnv() {
        return await this.fetchWithTimeout(`${this.baseUrl}/workspace/env`, { headers: this.headers() }, async (res) => {
            if (!res.ok)
                throw await this.failOnError(res, 'GET /workspace/env');
            return (await res.json());
        });
    }
    async workspacePreflight() {
        return await this.fetchWithTimeout(`${this.baseUrl}/workspace/preflight`, { headers: this.headers() }, async (res) => {
            if (!res.ok) {
                throw await this.failOnError(res, 'GET /workspace/preflight');
            }
            return (await res.json());
        });
    }
    async workspaceTools() {
        return await this.fetchWithTimeout(`${this.baseUrl}/workspace/tools`, { headers: this.headers() }, async (res) => {
            if (!res.ok) {
                throw await this.failOnError(res, 'GET /workspace/tools');
            }
            return (await res.json());
        });
    }
    // -- Sessions ----------------------------------------------------------
    async createOrAttachSession(req, clientId) {
        if (req.sourceType !== undefined || req.sourceId !== undefined) {
            await this.requireCapability('session_source_metadata');
        }
        // Omitting `cwd` lets the daemon fall back to its
        // primary workspace. JSON.stringify strips `undefined` values, so
        // `cwd: undefined` becomes "no `cwd` key" on the wire — and the
        // server then takes the documented fallback path.
        //
        // Send EVERY defined `workspaceCwd` value through as-is, including
        // the empty string. A truthy guard would silently swallow
        // `workspaceCwd: ""` (a likely client-side bug) and let the server
        // fall back instead of returning a clear 400 for the malformed
        // input. The SDK should be a transparent layer here: passing the
        // caller's value verbatim lets the server's validation surface
        // bugs that would otherwise hide as "wrong workspace bound".
        return await this.fetchWithTimeout(`${this.baseUrl}/session`, {
            method: 'POST',
            headers: this.headers({ 'Content-Type': 'application/json' }, clientId),
            body: JSON.stringify({
                cwd: req.workspaceCwd,
                ...(req.modelServiceId ? { modelServiceId: req.modelServiceId } : {}),
                // `!== undefined` (not truthy) so a buggy caller passing
                // `sessionScope: '' | null` doesn't get the field silently
                // erased on the wire â€” let the daemon's `400
                // invalid_session_scope` surface the bug. Same shape the
                // bridge's own validation uses (`httpAcpBridge.ts:
                // spawnOrAttach`); SDK should be a transparent layer here.
                ...(req.sessionScope !== undefined
                    ? { sessionScope: req.sessionScope }
                    : {}),
                ...(req.approvalMode !== undefined
                    ? { approvalMode: req.approvalMode }
                    : {}),
                ...(req.sourceType !== undefined
                    ? { sourceType: req.sourceType }
                    : {}),
                ...(req.sourceId !== undefined ? { sourceId: req.sourceId } : {}),
            }),
        }, async (res) => {
            if (!res.ok)
                throw await this.failOnError(res, 'POST /session');
            return (await res.json());
        });
    }
    /**
     * Enumerate the session catalog for a workspace. Used by session-picker UIs.
     * Returns an empty list (not 404) when the workspace has no sessions.
     */
    async listWorkspaceSessions(workspaceCwd, options) {
        const page = await this.listWorkspaceSessionsPage(workspaceCwd, options);
        return page.sessions;
    }
    async listWorkspaceSessionsPage(workspaceCwd, options) {
        if (options?.sourceType !== undefined || options?.sourceId !== undefined) {
            await this.requireCapability('session_source_metadata');
        }
        const requestedPageSize = options?.pageSize ?? DEFAULT_SESSION_LIST_PAGE_SIZE;
        const pageSize = Math.max(1, Math.min(1000, Math.round(Number.isFinite(requestedPageSize)
            ? requestedPageSize
            : DEFAULT_SESSION_LIST_PAGE_SIZE)));
        const query = new URLSearchParams({ size: String(pageSize) });
        if (options?.cursor !== undefined) {
            query.set('cursor', options.cursor);
        }
        if (options?.archiveState !== undefined) {
            query.set('archiveState', options.archiveState);
        }
        if (options?.view !== undefined) {
            query.set('view', options.view);
        }
        if (options?.group !== undefined) {
            query.set('group', options.group);
        }
        if (options?.parentSessionId !== undefined) {
            query.set('parentSessionId', options.parentSessionId);
        }
        if (options?.sourceType !== undefined) {
            query.set('sourceType', options.sourceType);
        }
        if (options?.sourceId !== undefined) {
            query.set('sourceId', options.sourceId);
        }
        return await this.jsonRequest(`/workspace/${urlEncode(workspaceCwd)}/sessions?${query.toString()}`, 'GET /workspace/sessions');
    }
    async listSessionGroups(workspaceCwd) {
        return await this.jsonRequest(`/workspace/${urlEncode(workspaceCwd)}/session-groups`, 'GET /workspace/session-groups');
    }
    async createSessionGroup(workspaceCwd, input) {
        const body = await this.jsonRequest(`/workspace/${urlEncode(workspaceCwd)}/session-groups`, 'POST /workspace/session-groups', { method: 'POST', body: input });
        return body.group;
    }
    async updateSessionGroup(workspaceCwd, groupId, update) {
        const body = await this.jsonRequest(`/workspace/${urlEncode(workspaceCwd)}/session-groups/${urlEncode(groupId)}`, 'PATCH /workspace/session-groups/:groupId', { method: 'PATCH', body: update });
        return body.group;
    }
    async deleteSessionGroup(workspaceCwd, groupId) {
        return await this.jsonRequest(`/workspace/${urlEncode(workspaceCwd)}/session-groups/${urlEncode(groupId)}`, 'DELETE /workspace/session-groups/:groupId', { method: 'DELETE' });
    }
    async updateSessionOrganization(sessionId, update, clientId) {
        return await this.jsonRequest(`/session/${urlEncode(sessionId)}/organization`, 'PATCH /session/:id/organization', { method: 'PATCH', body: update, clientId });
    }
    async loadSession(sessionId, req = {}, clientId) {
        return this.restoreSession('load', sessionId, req, clientId);
    }
    async exportSession(sessionId, opts = {}) {
        return await this.sessionExportRequest(`/session/${urlEncode(sessionId)}/export`, 'GET /session/:id/export', opts);
    }
    async getSessionTranscriptPage(sessionId, opts = {}) {
        return await this.jsonRequest(`/session/${urlEncode(sessionId)}/transcript${transcriptPageSuffix(opts)}`, 'GET /session/:id/transcript', {
            clientId: opts.clientId,
            mode: 'rest',
        });
    }
    async resumeSession(sessionId, req = {}, clientId) {
        return this.restoreSession('resume', sessionId, req, clientId);
    }
    async branchSession(sessionId, req = {}, clientId) {
        return await this.fetchWithTimeout(`${this.baseUrl}/session/${urlEncode(sessionId)}/branch`, {
            method: 'POST',
            headers: this.headers({ 'Content-Type': 'application/json' }, clientId),
            body: JSON.stringify({ name: req.name }),
        }, async (res) => {
            if (!res.ok) {
                throw await this.failOnError(res, 'POST /session/:id/branch');
            }
            return (await res.json());
        });
    }
    async forkSession(sessionId, req, clientId) {
        return await this.fetchWithTimeout(`${this.baseUrl}/session/${urlEncode(sessionId)}/fork`, {
            method: 'POST',
            headers: this.headers({ 'Content-Type': 'application/json' }, clientId),
            body: JSON.stringify({ directive: req.directive }),
        }, async (res) => {
            if (!res.ok) {
                throw await this.failOnError(res, 'POST /session/:id/fork');
            }
            return (await res.json());
        });
    }
    async sessionContext(sessionId, clientId) {
        return await this.fetchWithTimeout(`${this.baseUrl}/session/${urlEncode(sessionId)}/context`, { headers: this.headers({}, clientId) }, async (res) => {
            if (!res.ok) {
                throw await this.failOnError(res, 'GET /session/:id/context');
            }
            return (await res.json());
        });
    }
    /**
     * Read the current in-memory runtime status for one live daemon session.
     */
    async sessionStatus(sessionId, clientId) {
        return await this.fetchWithTimeout(`${this.baseUrl}/session/${urlEncode(sessionId)}/status`, { headers: this.headers({}, clientId) }, async (res) => {
            if (!res.ok) {
                throw await this.failOnError(res, 'GET /session/:id/status');
            }
            return (await res.json());
        });
    }
    async sessionContextUsage(sessionId, opts = {}, clientId) {
        const params = new URLSearchParams();
        if (opts.detail === true)
            params.set('detail', 'true');
        const query = params.toString();
        return await this.fetchWithTimeout(`${this.baseUrl}/session/${urlEncode(sessionId)}/context-usage${query ? `?${query}` : ''}`, { headers: this.headers({}, clientId) }, async (res) => {
            if (!res.ok) {
                throw await this.failOnError(res, 'GET /session/:id/context-usage');
            }
            return (await res.json());
        });
    }
    async sessionSupportedCommands(sessionId, clientId) {
        return await this.fetchWithTimeout(`${this.baseUrl}/session/${urlEncode(sessionId)}/supported-commands`, { headers: this.headers({}, clientId) }, async (res) => {
            if (!res.ok) {
                throw await this.failOnError(res, 'GET /session/:id/supported-commands');
            }
            return (await res.json());
        });
    }
    async sessionTasks(sessionId, clientId) {
        return await this.fetchWithTimeout(`${this.baseUrl}/session/${urlEncode(sessionId)}/tasks`, { headers: this.headers({}, clientId) }, async (res) => {
            if (!res.ok) {
                throw await this.failOnError(res, 'GET /session/:id/tasks');
            }
            return (await res.json());
        });
    }
    async sessionLspStatus(sessionId, clientId) {
        return await this.fetchWithTimeout(`${this.baseUrl}/session/${urlEncode(sessionId)}/lsp`, { headers: this.headers({}, clientId) }, async (res) => {
            if (!res.ok) {
                throw await this.failOnError(res, 'GET /session/:id/lsp');
            }
            return (await res.json());
        });
    }
    async sessionTaskCancel(sessionId, taskId, kind, clientId) {
        return await this.fetchWithTimeout(`${this.baseUrl}/session/${urlEncode(sessionId)}/tasks/${urlEncode(taskId)}/cancel`, {
            method: 'POST',
            headers: this.headers({ 'Content-Type': 'application/json' }, clientId),
            body: JSON.stringify({ kind }),
        }, async (res) => {
            if (!res.ok) {
                throw await this.failOnError(res, 'POST /session/:id/tasks/:taskId/cancel');
            }
            return (await res.json());
        });
    }
    async sessionGoalClear(sessionId, clientId) {
        return await this.fetchWithTimeout(`${this.baseUrl}/session/${urlEncode(sessionId)}/goal/clear`, {
            method: 'POST',
            headers: this.headers({ 'Content-Type': 'application/json' }, clientId),
            body: JSON.stringify({}),
        }, async (res) => {
            if (!res.ok) {
                throw await this.failOnError(res, 'POST /session/:id/goal/clear');
            }
            return (await res.json());
        });
    }
    async sessionStats(sessionId, clientId) {
        return await this.fetchWithTimeout(`${this.baseUrl}/session/${urlEncode(sessionId)}/stats`, { headers: this.headers({}, clientId) }, async (res) => {
            if (!res.ok) {
                throw await this.failOnError(res, 'GET /session/:id/stats');
            }
            return (await res.json());
        });
    }
    /**
     * Shared transport for `loadSession` / `resumeSession`. Both routes
     * share an identical wire shape (POST /session/:id/{load|resume}
     * with optional `cwd` body) and identical error envelopes from the
     * daemon, so they collapse into a single fetch path that only
     * differs in the URL suffix and the route name reported on errors.
     */
    async restoreSession(action, sessionId, req, clientId) {
        return await this.fetchWithTimeout(`${this.baseUrl}/session/${urlEncode(sessionId)}/${action}`, {
            method: 'POST',
            headers: this.headers({ 'Content-Type': 'application/json' }, clientId),
            body: JSON.stringify({
                cwd: req.workspaceCwd,
                ...(req.approvalMode !== undefined
                    ? { approvalMode: req.approvalMode }
                    : {}),
                ...(action === 'load' && req.historyPageSize !== undefined
                    ? { historyPageSize: req.historyPageSize }
                    : {}),
            }),
        }, async (res) => {
            if (!res.ok) {
                throw await this.failOnError(res, `POST /session/:id/${action}`);
            }
            return (await res.json());
        });
    }
    /**
     * Change the approval mode of a live session.
     * The daemon applies the change in the ACP child's per-session
     * `Config` and publishes an `approval_mode_changed` event. Pass
     * `opts.persist: true` to also write `tools.approvalMode` to the
     * workspace settings file (default is ephemeral so a remote caller
     * does not pollute the user's host settings unless asked).
     *
     * Pre-flight `caps.features.session_approval_mode_control` before
     * calling â€” older daemons reject the route with 404.
     *
     * The trust-folder gate inside core's `setApprovalMode` rejects
     * privileged modes in untrusted folders; the route surfaces that
     * with HTTP 403 + `errorKind: 'auth_env_error'`.
     */
    async setSessionApprovalMode(sessionId, mode, opts) {
        return await this.fetchWithTimeout(`${this.baseUrl}/session/${urlEncode(sessionId)}/approval-mode`, {
            method: 'POST',
            headers: this.headers({ 'Content-Type': 'application/json' }, opts?.clientId),
            body: JSON.stringify({
                mode,
                ...(opts?.persist === true ? { persist: true } : {}),
            }),
        }, async (res) => {
            if (!res.ok) {
                throw await this.failOnError(res, 'POST /session/:id/approval-mode');
            }
            return (await res.json());
        });
    }
    async getRewindSnapshots(sessionId) {
        return await this.fetchWithTimeout(`${this.baseUrl}/session/${urlEncode(sessionId)}/rewind/snapshots`, { method: 'GET', headers: this.headers() }, async (res) => {
            if (!res.ok) {
                throw await this.failOnError(res, 'GET /session/:id/rewind/snapshots');
            }
            return (await res.json());
        }, undefined, 'rest');
    }
    async rewindSession(sessionId, promptId, opts) {
        return await this.fetchWithTimeout(`${this.baseUrl}/session/${urlEncode(sessionId)}/rewind`, {
            method: 'POST',
            headers: this.headers({ 'Content-Type': 'application/json' }, opts?.clientId),
            body: JSON.stringify({
                promptId,
                ...(opts?.rewindFiles !== undefined
                    ? { rewindFiles: opts.rewindFiles }
                    : {}),
            }),
        }, async (res) => {
            if (!res.ok) {
                throw await this.failOnError(res, 'POST /session/:id/rewind');
            }
            return (await res.json());
        }, undefined, 'rest');
    }
    /**
     * Generate a one-sentence "where did I leave off"
     * recap of the session. Wraps `generateSessionRecap` (core/services/
     * sessionRecap.ts) via an ACP control-channel ext-method, so the
     * summary is computed against the active GeminiClient chat history
     * inside the daemon's ACP child.
     *
     * Non-strict mutation gate â€” posture matches `/session/:id/prompt`
     * (the route costs tokens but mutates no state). Calls `_fetch`
     * directly without the per-call `fetchTimeoutMs` wrapper because the
     * underlying side-query can take longer than the default 30s under
     * a slow model. Older daemons (pre-recap support) return 404 â€”
     * pre-flight `caps.features.session_recap` before calling.
     *
     * Cancellation: the optional `signal` aborts only the LOCAL HTTP
     * fetch. It does NOT propagate to the daemon â€” the bridge-side wait
     * continues until the 60s `SESSION_RECAP_TIMEOUT_MS` backstop, and
     * the side-query inside the ACP child always runs to completion (no
     * cross-process abort plumbing in v1). A future request-id-based
     * cancel ext-method will plumb a real signal end-to-end if/when the
     * bandwidth cost justifies it.
     *
     * `recap` may be `null` on too-short histories or transient model
     * failures (a 200 response with `recap: null`), per the best-effort
     * contract of the core helper.
     */
    async recapSession(sessionId, opts) {
        const res = await this.transport.fetch(`${this.baseUrl}/session/${urlEncode(sessionId)}/recap`, {
            method: 'POST',
            headers: this.headers({ 'Content-Type': 'application/json' }, opts?.clientId),
            body: '{}',
            signal: opts?.signal,
        });
        if (!res.ok)
            throw await this.failOnError(res, 'POST /session/:id/recap');
        return (await res.json());
    }
    async *generateSessionContent(sessionId, prompt, opts) {
        const res = await this.transport.fetch(`${this.baseUrl}/session/${urlEncode(sessionId)}/generate`, {
            method: 'POST',
            headers: this.headers({
                'Content-Type': 'application/json',
                Accept: 'text/event-stream',
            }, opts?.clientId),
            body: JSON.stringify({ prompt }),
            signal: opts?.signal,
        });
        if (!res.ok) {
            throw await this.failOnError(res, 'POST /session/:id/generate');
        }
        if (!res.body)
            throw new Error('Generation response body is missing');
        for await (const event of parseSseStream(res.body, opts?.signal)) {
            const generationEvent = parseSessionGenerationEvent(event);
            if (generationEvent)
                yield generationEvent;
        }
    }
    async btwSession(sessionId, question, opts) {
        const res = await this.transport.fetch(`${this.baseUrl}/session/${urlEncode(sessionId)}/btw`, {
            method: 'POST',
            headers: this.headers({ 'Content-Type': 'application/json' }, opts?.clientId),
            body: JSON.stringify({ question }),
            signal: opts?.signal,
        });
        if (!res.ok)
            throw await this.failOnError(res, 'POST /session/:id/btw');
        return (await res.json());
    }
    /**
     * Queue a user message typed while the session's turn is still running. The
     * ACP child drains it between tool batches so the model sees it before the
     * turn ends. Resolves `{ accepted: false }` when the session is idle â€” the
     * caller should then send the message as a normal next-turn prompt.
     */
    async enqueueMidTurnMessage(sessionId, message, opts) {
        // Route through `fetchWithTimeout` like every other method so a hung daemon
        // can't wedge this promise forever (the caller in `actions.ts` awaits it).
        // The helper composes any caller `signal` (the turn-scoped abort) WITH its
        // timeout controller, so the mid-turn-settle abort still propagates.
        return await this.fetchWithTimeout(`${this.baseUrl}/session/${urlEncode(sessionId)}/mid-turn-message`, {
            method: 'POST',
            headers: this.headers({ 'Content-Type': 'application/json' }, opts?.clientId),
            body: JSON.stringify({ message }),
            signal: opts?.signal,
        }, async (res) => {
            if (!res.ok) {
                throw await this.failOnError(res, 'POST /session/:id/mid-turn-message');
            }
            return (await res.json());
        });
    }
    /**
     * List prompts in the daemon's per-session pending queue. Includes the
     * currently running prompt (`state: 'running'`) and any FIFO-waiting
     * prompts (`state: 'queued'`). Returns an empty array when no prompts
     * are pending.
     */
    async getPendingPrompts(sessionId, opts) {
        return await this.fetchWithTimeout(`${this.baseUrl}/session/${urlEncode(sessionId)}/pending-prompts`, {
            method: 'GET',
            headers: this.headers({}, opts?.clientId),
        }, async (res) => {
            if (!res.ok) {
                throw await this.failOnError(res, 'GET /session/:id/pending-prompts');
            }
            return (await res.json());
        });
    }
    /**
     * Remove a specific prompt from the daemon's pending queue. For queued
     * prompts this aborts them so the FIFO skips dispatch; for the running
     * prompt this triggers a cancel. Returns `{ removed: false }` when the
     * promptId is not found.
     */
    async removePendingPrompt(sessionId, promptId, opts) {
        return await this.fetchWithTimeout(`${this.baseUrl}/session/${urlEncode(sessionId)}/pending-prompts/${urlEncode(promptId)}`, {
            method: 'DELETE',
            headers: this.headers({}, opts?.clientId),
        }, async (res) => {
            if (!res.ok) {
                throw await this.failOnError(res, 'DELETE /session/:id/pending-prompts/:promptId');
            }
            return (await res.json());
        });
    }
    /**
     * Execute a direct daemon-side shell command for a session. The daemon must
     * be started with direct session shell enabled and bearer auth configured;
     * callers must also provide a client id already bound to this session.
     * Prefer `DaemonSessionClient.shellCommand()` when available because it
     * forwards the session-bound client id automatically.
     */
    async shellCommand(sessionId, command, opts) {
        const res = await this.transport.fetch(`${this.baseUrl}/session/${urlEncode(sessionId)}/shell`, {
            method: 'POST',
            headers: this.headers({ 'Content-Type': 'application/json' }, opts?.clientId),
            body: JSON.stringify({ command }),
            signal: opts?.signal,
        });
        if (!res.ok)
            throw await this.failOnError(res, 'POST /session/:id/shell');
        return (await res.json());
    }
    /**
     * Toggle a tool name in the workspace's
     * `tools.disabled` settings list. Strict-gated mutation route â€” the
     * daemon must be configured with a bearer token. The daemon writes
     * the settings file directly and fan-outs a `tool_toggled` event to
     * every live session SSE bus.
     *
     * Already-registered tools in active sessions are NOT retroactively
     * unregistered. The toggle takes effect on the next ACP child spawn
     * â€” listeners that need the live tool list to reflect the change
     * should also `POST /workspace/mcp/:server/restart` (when the tool
     * is MCP-discovered) or open a new session.
     *
     * Pre-flight `caps.features.workspace_tool_toggle` before calling.
     */
    async setWorkspaceToolEnabled(toolName, enabled, opts) {
        return await this.fetchWithTimeout(`${this.baseUrl}/workspace/tools/${urlEncode(toolName)}/enable`, {
            method: 'POST',
            headers: this.headers({ 'Content-Type': 'application/json' }, opts?.clientId),
            body: JSON.stringify({ enabled }),
        }, async (res) => {
            if (!res.ok) {
                throw await this.failOnError(res, 'POST /workspace/tools/:name/enable');
            }
            return (await res.json());
        });
    }
    /**
     * Toggle a user-invocable skill in workspace `skills.disabled` settings.
     * Active ACP sessions refresh their skill validation and command lists before
     * the response returns; `activation` reports deferred or partial refreshes.
     *
     * Pre-flight `caps.features.includes('workspace_skill_toggle')` before calling.
     */
    async setWorkspaceSkillEnabled(skillName, enabled, opts) {
        return await this.fetchWithTimeout(`${this.baseUrl}/workspace/skills/${urlEncode(skillName)}/enable`, {
            method: 'POST',
            headers: this.headers({ 'Content-Type': 'application/json' }, opts?.clientId),
            body: JSON.stringify({ enabled }),
        }, async (res) => {
            if (!res.ok) {
                throw await this.failOnError(res, 'POST /workspace/skills/:name/enable');
            }
            return (await res.json());
        });
    }
    installWorkspaceSkill(request) {
        return this.jsonRequest('/workspace/skills/install', 'Skill', {
            method: 'POST',
            body: request,
        });
    }
    deleteWorkspaceSkill(skillName, scope) {
        return this.jsonRequest(`/workspace/skills/${urlEncode(skillName)}?scope=${scope}`, 'Skill', { method: 'DELETE' });
    }
    async workspaceSettings(opts) {
        return await this.fetchWithTimeout(`${this.baseUrl}/workspace/settings`, {
            method: 'GET',
            headers: this.headers({}, opts?.clientId),
        }, async (res) => {
            if (!res.ok) {
                throw await this.failOnError(res, 'GET /workspace/settings');
            }
            return (await res.json());
        });
    }
    async setWorkspaceSetting(scope, key, value, opts) {
        return await this.fetchWithTimeout(`${this.baseUrl}/workspace/settings`, {
            method: 'POST',
            headers: this.headers({ 'Content-Type': 'application/json' }, opts?.clientId),
            body: JSON.stringify({
                scope,
                key,
                value,
                ...(opts?.mcpServerMutation
                    ? { mcpServerMutation: opts.mcpServerMutation }
                    : {}),
            }),
        }, async (res) => {
            if (!res.ok) {
                throw await this.failOnError(res, 'POST /workspace/settings');
            }
            return (await res.json());
        });
    }
    async deleteModel(target, opts) {
        return await this.fetchWithTimeout(`${this.baseUrl}/workspace/models`, {
            method: 'DELETE',
            headers: this.headers({ 'Content-Type': 'application/json' }, opts?.clientId),
            body: JSON.stringify(target),
        }, async (res) => {
            if (!res.ok) {
                throw await this.failOnError(res, 'DELETE /workspace/models');
            }
            return (await res.json());
        });
    }
    async workspaceVoice(clientId) {
        return await this.jsonRequest('/workspace/voice', 'GET /workspace/voice', { clientId });
    }
    async setWorkspaceVoice(update, clientId) {
        return await this.jsonRequest('/workspace/voice', 'POST /workspace/voice', { method: 'POST', body: update, clientId });
    }
    async transcribeWorkspaceVoice(audio, opts) {
        return await this.voiceTranscriptionRequest('/workspace/voice/transcribe', 'POST /workspace/voice/transcribe', audio, opts);
    }
    /** @internal */
    async workspaceVoiceTranscriptionRequest(workspaceSelector, audio, opts) {
        return await this.voiceTranscriptionRequest(`/workspaces/${workspaceSelector}/voice/transcribe`, 'POST /workspaces/:workspace/voice/transcribe', audio, opts);
    }
    async voiceTranscriptionRequest(path, label, audio, opts) {
        const query = opts.voiceModel
            ? `?${new URLSearchParams({ voiceModel: opts.voiceModel }).toString()}`
            : '';
        return await this.fetchWithTimeout(`${this.baseUrl}${path}${query}`, {
            method: 'POST',
            headers: this.headers({ 'Content-Type': opts.mimeType }, opts.clientId),
            body: audio,
        }, async (res) => {
            if (!res.ok) {
                throw await this.failOnError(res, label);
            }
            return (await res.json());
        }, opts.timeoutMs ?? VOICE_TRANSCRIPTION_DEFAULT_TIMEOUT_MS, 'rest');
    }
    async workspaceTrust(opts) {
        return await this.fetchWithTimeout(`${this.baseUrl}/workspace/trust`, {
            method: 'GET',
            headers: this.headers({}, opts?.clientId),
        }, async (res) => {
            if (!res.ok) {
                throw await this.failOnError(res, 'GET /workspace/trust');
            }
            return (await res.json());
        });
    }
    async requestWorkspaceTrustChange(request, clientId) {
        return await this.jsonRequest('/workspace/trust/request', 'POST /workspace/trust/request', { method: 'POST', body: request, clientId });
    }
    async workspacePermissions(opts) {
        return await this.jsonRequest('/workspace/permissions', 'GET /workspace/permissions', { clientId: opts?.clientId });
    }
    /**
     * Replace one permission rule list.
     *
     * `capabilities.features` including `workspace_permissions` means the
     * daemon exposes the permissions surface. A write still needs a live ACP
     * session so the active child can receive the update; without one the
     * daemon rejects the request with `permission_session_required`.
     */
    async setWorkspacePermissionRules(scope, ruleType, rules, opts) {
        return await this.jsonRequest('/workspace/permissions', 'POST /workspace/permissions', {
            method: 'POST',
            body: { scope, ruleType, rules: [...rules] },
            clientId: opts?.clientId,
        });
    }
    /**
     * Convenience helper that appends a single rule to the specified scope/type
     * list. Performs a non-atomic read-modify-write: GETs the current rules,
     * appends the new rule locally, then POSTs the full replacement list.
     *
     * @remarks Not safe for concurrent use â€” a concurrent modification between
     * the GET and POST will be silently overwritten (lost-update / TOCTOU).
     */
    async addWorkspacePermissionRule(scope, ruleType, rule, opts) {
        const normalized = normalizePermissionRuleInput(rule);
        const current = await this.workspacePermissions(opts);
        const rules = current[scope].rules[ruleType];
        if (rules.includes(normalized))
            return current;
        return await this.setWorkspacePermissionRules(scope, ruleType, [...rules, normalized], opts);
    }
    /**
     * Convenience helper that removes a single rule from the specified scope/type
     * list. Performs a non-atomic read-modify-write: GETs the current rules,
     * removes the rule locally, then POSTs the full replacement list.
     *
     * @remarks Not safe for concurrent use â€” a concurrent modification between
     * the GET and POST will be silently overwritten (lost-update / TOCTOU).
     */
    async removeWorkspacePermissionRule(scope, ruleType, rule, opts) {
        const normalized = normalizePermissionRuleInput(rule);
        const current = await this.workspacePermissions(opts);
        const rules = current[scope].rules[ruleType];
        if (!rules.includes(normalized))
            return current;
        return await this.setWorkspacePermissionRules(scope, ruleType, rules.filter((item) => item !== normalized), opts);
    }
    /**
     * Restart a configured MCP server through the ACP child's
     * `McpClientManager`. The daemon pre-checks the live budget
     * snapshot; soft refusals (in-flight discovery,
     * disabled server, budget would exceed under `enforce` mode) come
     * back as 200 OK with `{restarted: false, skipped: true, reason}`.
     * Only hard errors (unknown server name, no live ACP channel)
     * surface as non-2xx.
     *
     * The daemon-side restart waits up to 5 minutes for stdio MCP
     * discovery; the SDK default allows that budget plus 30s headroom
     * so a slow but valid restart isn't
     * aborted client-side while the daemon continues working. Callers can pass a custom
     * `timeoutMs` when their threat model needs a tighter cap, or `0`
     * to disable the timeout entirely.
     *
     * `entryIndex` targets one pooled entry by index. Use `'*'` to
     * restart all entries for a pooled server.
     *
     * Pre-flight `caps.features.workspace_mcp_restart` before calling.
     */
    async restartMcpServer(serverName, opts) {
        const query = opts?.entryIndex === undefined
            ? ''
            : `?entryIndex=${urlEncode(String(opts.entryIndex))}`;
        return await this.fetchWithTimeout(`${this.baseUrl}/workspace/mcp/${urlEncode(serverName)}/restart${query}`, {
            method: 'POST',
            headers: this.headers({ 'Content-Type': 'application/json' }, opts?.clientId),
            body: '{}',
        }, async (res) => {
            if (!res.ok) {
                throw await this.failOnError(res, 'POST /workspace/mcp/:server/restart');
            }
            return (await res.json());
        }, opts?.timeoutMs ?? MCP_RESTART_DEFAULT_TIMEOUT_MS);
    }
    async reload(opts) {
        return await this.fetchWithTimeout(`${this.baseUrl}/workspace/reload`, {
            method: 'POST',
            headers: this.headers({ 'Content-Type': 'application/json' }, opts?.clientId),
            body: '{}',
        }, async (res) => {
            if (!res.ok) {
                throw await this.failOnError(res, 'POST /workspace/reload');
            }
            return (await res.json());
        }, opts?.timeoutMs);
    }
    /**
     * Reload the daemon-managed channel worker: the daemon stops and relaunches
     * it so it re-reads settings.json (channels / proxy / per-channel model).
     * Requires an enabled runtime selection; otherwise the route responds 409.
     * Pre-flight the dynamic `channel_reload` capability.
     */
    async reloadChannelWorker(opts) {
        return await this.fetchWithTimeout(`${this.baseUrl}/workspace/channel/reload`, {
            method: 'POST',
            headers: this.headers({ 'Content-Type': 'application/json' }, opts?.clientId),
            body: '{}',
        }, async (res) => {
            if (!res.ok) {
                throw await this.failOnError(res, 'POST /workspace/channel/reload');
            }
            return (await res.json());
        }, opts?.timeoutMs ?? CHANNEL_CONTROL_DEFAULT_TIMEOUT_MS);
    }
    async getChannelWorkerControl(opts) {
        return await this.fetchWithTimeout(`${this.baseUrl}/workspace/channel`, {
            method: 'GET',
            headers: this.headers({}, opts?.clientId),
        }, async (res) => {
            if (!res.ok) {
                throw await this.failOnError(res, 'GET /workspace/channel');
            }
            return (await res.json());
        }, opts?.timeoutMs);
    }
    async setChannelWorkerSelection(selection, opts) {
        return await this.fetchWithTimeout(`${this.baseUrl}/workspace/channel`, {
            method: 'PUT',
            headers: this.headers({ 'Content-Type': 'application/json' }, opts?.clientId),
            body: JSON.stringify({ selection }),
        }, async (res) => {
            if (!res.ok) {
                throw await this.failOnError(res, 'PUT /workspace/channel');
            }
            return (await res.json());
        }, opts?.timeoutMs ?? CHANNEL_CONTROL_DEFAULT_TIMEOUT_MS);
    }
    async stopChannelWorker(opts) {
        return await this.fetchWithTimeout(`${this.baseUrl}/workspace/channel`, {
            method: 'DELETE',
            headers: this.headers({}, opts?.clientId),
        }, async (res) => {
            if (!res.ok) {
                throw await this.failOnError(res, 'DELETE /workspace/channel');
            }
            return (await res.json());
        }, opts?.timeoutMs ?? CHANNEL_CONTROL_DEFAULT_TIMEOUT_MS);
    }
    async manageMcpServer(serverName, action, opts) {
        return await this.fetchWithTimeout(`${this.baseUrl}/workspace/mcp/${urlEncode(serverName)}/${urlEncode(action)}`, {
            method: 'POST',
            headers: this.headers({ 'Content-Type': 'application/json' }, opts?.clientId),
            body: '{}',
        }, async (res) => {
            if (!res.ok) {
                throw await this.failOnError(res, 'POST /workspace/mcp/:server/:action');
            }
            return (await res.json());
        }, opts?.timeoutMs ?? MCP_RESTART_DEFAULT_TIMEOUT_MS);
    }
    /**
     * Add (or replace) a runtime MCP server. The daemon
     * validates the config, starts the server, and emits an
     * `mcp_server_added` SSE event to all live sessions. Callers
     * pre-flight `caps.features.mcp_server_runtime_mutation` before
     * calling â€” older daemons return 404.
     */
    async addRuntimeMcpServer(request, opts) {
        return await this.fetchWithTimeout(`${this.baseUrl}/workspace/mcp/servers`, {
            method: 'POST',
            headers: this.headers({ 'Content-Type': 'application/json' }, opts?.clientId),
            body: JSON.stringify(request),
        }, async (res) => {
            if (!res.ok) {
                throw await this.failOnError(res, 'POST /workspace/mcp/servers');
            }
            return (await res.json());
        }, opts?.timeoutMs ?? MCP_RESTART_DEFAULT_TIMEOUT_MS);
    }
    /**
     * Remove a runtime MCP server by name. The daemon
     * tears down the server process, removes it from the runtime
     * overlay, and emits an `mcp_server_removed` SSE event. Idempotent
     * at the HTTP level: if the server was never present the daemon
     * returns 200 with `{ skipped: true, reason: 'not_present' }`.
     * Pre-flight `caps.features.mcp_server_runtime_mutation` before
     * calling.
     */
    async removeRuntimeMcpServer(name, opts) {
        return await this.fetchWithTimeout(`${this.baseUrl}/workspace/mcp/servers/${urlEncode(name)}`, {
            method: 'DELETE',
            headers: this.headers({}, opts?.clientId),
        }, async (res) => {
            if (!res.ok) {
                throw await this.failOnError(res, 'DELETE /workspace/mcp/servers/:name');
            }
            return (await res.json());
        }, opts?.timeoutMs ?? MCP_RESTART_DEFAULT_TIMEOUT_MS);
    }
    /**
     * Scaffold a `QWEN.md` at the daemon's bound
     * workspace root. Mechanical only â€” does NOT invoke the LLM. The
     * daemon writes an empty file; clients that want AI-driven content
     * fill should follow up with `POST /session/:id/prompt`.
     *
     * Default refuses to overwrite â€” when the file exists with non-
     * whitespace content the daemon returns 409
     * `workspace_init_conflict` with the existing path and size in the
     * body. Pass `opts.force: true` to overwrite unconditionally.
     *
     * Pre-flight `caps.features.workspace_init` before calling.
     */
    async initWorkspace(opts) {
        return await this.fetchWithTimeout(`${this.baseUrl}/workspace/init`, {
            method: 'POST',
            headers: this.headers({ 'Content-Type': 'application/json' }, opts?.clientId),
            body: JSON.stringify(opts?.force === true ? { force: true } : {}),
        }, async (res) => {
            if (!res.ok) {
                throw await this.failOnError(res, 'POST /workspace/init');
            }
            return (await res.json());
        });
    }
    async setupGithub(params, clientId) {
        return await this.jsonRequest('/workspace/setup-github', 'POST /workspace/setup-github', {
            method: 'POST',
            body: params,
            clientId,
            timeoutMs: GITHUB_SETUP_DEFAULT_TIMEOUT_MS,
        });
    }
    /**
     * Switch the active model for a session. Backed by ACP's currently-unstable
     * `unstable_setSessionModel`; the daemon also publishes a `model_switched`
     * event so cross-client UIs can update.
     */
    async setSessionModel(sessionId, modelId, clientId) {
        return await this.fetchWithTimeout(`${this.baseUrl}/session/${urlEncode(sessionId)}/model`, {
            method: 'POST',
            headers: this.headers({ 'Content-Type': 'application/json' }, clientId),
            body: JSON.stringify({ modelId }),
        }, async (res) => {
            if (!res.ok) {
                throw await this.failOnError(res, 'POST /session/:id/model');
            }
            return (await res.json());
        });
    }
    async setSessionLanguage(sessionId, language, opts) {
        return await this.fetchWithTimeout(`${this.baseUrl}/session/${urlEncode(sessionId)}/language`, {
            method: 'POST',
            headers: this.headers({ 'Content-Type': 'application/json' }, opts?.clientId),
            body: JSON.stringify({
                language,
                syncOutputLanguage: opts?.syncOutputLanguage ?? false,
            }),
        }, async (res) => {
            if (!res.ok) {
                throw await this.failOnError(res, 'POST /session/:id/language');
            }
            return (await res.json());
        });
    }
    /**
     * Send a prompt to the agent. Supports both blocking (legacy 200)
     * and non-blocking (202 + SSE `turn_complete`) daemon responses.
     *
     * For 202 daemons this opens a **temporary** SSE subscription to
     * await the matching `turn_complete`/`turn_error`. Callers that
     * already manage a long-lived SSE subscription (e.g.
     * `DaemonSessionClient`) should prefer {@link promptNonBlocking}
     * and correlate via their existing event stream to avoid the extra
     * connection.
     */
    async prompt(sessionId, req, signal, clientId) {
        signal?.throwIfAborted();
        const releasePromptSlot = this.reservePromptSlot(sessionId);
        let releaseOnExit = true;
        try {
            const res = await this.transport.fetch(`${this.baseUrl}/session/${urlEncode(sessionId)}/prompt`, {
                method: 'POST',
                headers: this.headers({ 'Content-Type': 'application/json' }, clientId),
                body: JSON.stringify(req),
                signal,
            });
            if (res.status === 202) {
                const accept = (await res.json());
                releaseOnExit = false;
                try {
                    return await this._awaitTurnComplete(sessionId, accept.promptId, accept.lastEventId, signal, clientId);
                }
                finally {
                    releasePromptSlot();
                }
            }
            if (!res.ok) {
                throw await this.failOnError(res, 'POST /session/:id/prompt', sessionId);
            }
            return (await res.json());
        }
        finally {
            if (releaseOnExit)
                releasePromptSlot();
        }
    }
    /**
     * Fire-and-forget prompt trigger. Returns the 202 acceptance
     * envelope (`{ promptId, lastEventId }`) without waiting for the
     * turn to complete. The caller is responsible for observing
     * `turn_complete` / `turn_error` on the session's SSE stream,
     * matching by `promptId`.
     *
     * This is the recommended path for callers that already maintain a
     * long-lived SSE subscription (like `DaemonSessionClient`) â€”
     * avoids the extra SSE connection that {@link prompt} opens for
     * the temporary 202 fallback.
     *
     * Falls back to `prompt()` for legacy 200 daemons.
     *
     * Note: this method does not enforce the local pending-prompt cap.
     * Callers that need early-fail behavior should use {@link prompt} or
     * reserve a slot before calling this method.
     */
    async promptNonBlocking(sessionId, req, signal, clientId) {
        const res = await this.transport.fetch(`${this.baseUrl}/session/${urlEncode(sessionId)}/prompt`, {
            method: 'POST',
            headers: this.headers({ 'Content-Type': 'application/json' }, clientId),
            body: JSON.stringify(req),
            signal,
        });
        if (res.status === 202) {
            return (await res.json());
        }
        if (!res.ok) {
            throw await this.failOnError(res, 'POST /session/:id/prompt', sessionId);
        }
        return (await res.json());
    }
    async _awaitTurnComplete(sessionId, promptId, lastEventId, signal, clientId) {
        const sseAbort = new AbortController();
        const composedSignal = signal
            ? composeAbortSignals([signal, sseAbort.signal])
            : sseAbort.signal;
        try {
            const events = this.subscribeEvents(sessionId, {
                lastEventId,
                signal: composedSignal,
            });
            for await (const event of events) {
                const result = matchTurnEvent(event, promptId);
                if (result !== undefined)
                    return result;
            }
            throw new Error('SSE stream ended');
        }
        catch (err) {
            if (signal?.aborted &&
                err instanceof DOMException &&
                err.name === 'AbortError') {
                this.cancel(sessionId, clientId).catch(() => { });
                throw err;
            }
            throw err;
        }
        finally {
            if (!sseAbort.signal.aborted)
                sseAbort.abort();
        }
    }
    /**
     * Bump the daemon's last-seen bookkeeping for this session. The
     * route is short-lived â€” drives diagnostics and future revocation
     * policy -- so it goes through the standard
     * `fetchTimeoutMs`. Older daemons return 404 for
     * `/heartbeat`; clients should pre-flight
     * `caps.features.client_heartbeat` before calling.
     */
    async heartbeat(sessionId, clientId) {
        return await this.fetchWithTimeout(`${this.baseUrl}/session/${urlEncode(sessionId)}/heartbeat`, {
            method: 'POST',
            headers: this.headers({ 'Content-Type': 'application/json' }, clientId),
            body: '{}',
        }, async (res) => {
            if (!res.ok) {
                throw await this.failOnError(res, 'POST /session/:id/heartbeat');
            }
            return (await res.json());
        });
    }
    async cancel(sessionId, clientId) {
        await this.fetchWithTimeout(`${this.baseUrl}/session/${urlEncode(sessionId)}/cancel`, {
            method: 'POST',
            headers: this.headers({ 'Content-Type': 'application/json' }, clientId),
            body: '{}',
        }, async (res) => {
            if (!res.ok && res.status !== 204) {
                throw await this.failOnError(res, 'POST /session/:id/cancel');
            }
            // Drain so undici doesn't keep the socket pinned waiting for
            // the consumer (matches the respondToPermission rationale).
            try {
                await res.body?.cancel();
            }
            catch {
                /* body already consumed or no body */
            }
        });
    }
    // -- Events stream -----------------------------------------------------
    async *subscribeEvents(sessionId, opts = {}) {
        // Delegate entirely to the transport. The transport handles
        // connect-phase timeout, Last-Event-ID, maxQueued, content-type
        // validation, and SSE parsing (for REST) or JSON-RPC notification
        // filtering (for ACP transports).
        yield* this.transport.subscribeEvents(sessionId, {
            lastEventId: opts.lastEventId,
            maxQueued: opts.maxQueued,
            signal: opts.signal,
            connectTimeoutMs: this.fetchTimeoutMs || undefined,
        });
    }
    // -- Permissions -------------------------------------------------------
    /**
     * Cast a permission vote. Returns true when the daemon accepted the vote,
     * false on 404 (request unknown or already resolved by another client â€”
     * the typical "lost the race" outcome under multi-client fan-out).
     */
    async respondToPermission(requestId, response, clientId) {
        return await this.fetchWithTimeout(`${this.baseUrl}/permission/${urlEncode(requestId)}`, {
            method: 'POST',
            headers: this.headers({ 'Content-Type': 'application/json' }, clientId),
            body: JSON.stringify(response),
        }, async (res) => {
            if (res.status === 200) {
                // Drain the body so undici doesn't keep the underlying socket
                // pinned waiting for the consumer. On long-running clients with
                // frequent permission votes this would exhaust the connection
                // pool. Use `res.body?.cancel()` rather than `await res.json()`
                // because the daemon returns `{}` (no useful payload here) and
                // cancel is cheaper than a parse round-trip.
                try {
                    await res.body?.cancel();
                }
                catch {
                    /* body already consumed or no body */
                }
                return true;
            }
            if (res.status === 404) {
                try {
                    await res.body?.cancel();
                }
                catch {
                    /* body already consumed or no body */
                }
                return false;
            }
            throw await this.failOnError(res, 'POST /permission/:requestId');
        });
    }
    /**
     * Cast a permission vote against an explicit daemon session. New clients
     * should prefer this once `capabilities.features` includes
     * `session_permission_vote`; the legacy request-id-only route remains for
     * older daemons.
     */
    async respondToSessionPermission(sessionId, requestId, response, clientId) {
        return await this.fetchWithTimeout(`${this.baseUrl}/session/${urlEncode(sessionId)}/permission/${urlEncode(requestId)}`, {
            method: 'POST',
            headers: this.headers({ 'Content-Type': 'application/json' }, clientId),
            body: JSON.stringify(response),
        }, async (res) => {
            if (res.status === 200) {
                try {
                    await res.body?.cancel();
                }
                catch {
                    /* body already consumed or no body */
                }
                return true;
            }
            if (res.status === 404) {
                try {
                    await res.body?.cancel();
                }
                catch {
                    /* body already consumed or no body */
                }
                return false;
            }
            throw await this.failOnError(res, 'POST /session/:id/permission/:requestId');
        });
    }
    // -- Session lifecycle ---------------------------------------------------
    /**
     * Close a daemon session. The daemon treats DELETE as idempotent for SDK
     * callers: both 204 (closed) and 404 (already gone) resolve successfully.
     */
    async closeSession(sessionId, clientId) {
        return await this.fetchWithTimeout(`${this.baseUrl}/session/${urlEncode(sessionId)}`, {
            method: 'DELETE',
            headers: this.headers({}, clientId),
        }, async (res) => {
            if (res.status === 204 || res.status === 404) {
                try {
                    await res.body?.cancel();
                }
                catch {
                    /* body already consumed or no body */
                }
                return;
            }
            throw await this.failOnError(res, 'DELETE /session/:id');
        });
    }
    async detachSession(sessionId, clientId) {
        if (!clientId)
            return;
        return await this.fetchWithTimeout(`${this.baseUrl}/session/${urlEncode(sessionId)}/detach`, {
            method: 'POST',
            headers: this.headers({}, clientId),
        }, async (res) => {
            if (res.status === 204 || res.status === 404) {
                try {
                    await res.body?.cancel();
                }
                catch {
                    /* body already consumed or no body */
                }
                return;
            }
            throw await this.failOnError(res, 'POST /session/:id/detach');
        });
    }
    async deleteSessionsData(sessionIds, clientId) {
        return await this.fetchWithTimeout(`${this.baseUrl}/sessions/delete`, {
            method: 'POST',
            headers: this.headers({ 'Content-Type': 'application/json' }, clientId),
            body: JSON.stringify({ sessionIds }),
        }, async (res) => {
            if (res.ok) {
                return (await res.json());
            }
            throw await this.failOnError(res, 'POST /sessions/delete');
        });
    }
    async archiveSessionsData(sessionIds, clientId) {
        return await this.fetchWithTimeout(`${this.baseUrl}/sessions/archive`, {
            method: 'POST',
            headers: this.headers({ 'Content-Type': 'application/json' }, clientId),
            body: JSON.stringify({ sessionIds }),
        }, async (res) => {
            if (res.ok) {
                return (await res.json());
            }
            throw await this.failOnError(res, 'POST /sessions/archive');
        });
    }
    async unarchiveSessionsData(sessionIds, clientId) {
        return await this.fetchWithTimeout(`${this.baseUrl}/sessions/unarchive`, {
            method: 'POST',
            headers: this.headers({ 'Content-Type': 'application/json' }, clientId),
            body: JSON.stringify({ sessionIds }),
        }, async (res) => {
            if (res.ok) {
                return (await res.json());
            }
            throw await this.failOnError(res, 'POST /sessions/unarchive');
        });
    }
    // -- Auth device-flow ---------------------------------------------------
    /**
     * Start an OAuth device-flow login for the given provider. The daemon
     * polls the IdP in the background and emits typed `auth_device_flow_*`
     * SSE events; callers can also poll `getDeviceFlow(...)`.
     *
     * Per-provider singleton: a repeat call while a flow is already pending
     * for the same provider is an idempotent take-over and returns the
     * existing entry rather than starting a fresh IdP request. The
     * `attached` field on the result distinguishes the two cases.
     */
    async startDeviceFlow(opts) {
        return await this.fetchWithTimeout(`${this.baseUrl}/workspace/auth/device-flow`, {
            method: 'POST',
            headers: this.headers({ 'Content-Type': 'application/json' }, opts.clientId),
            body: JSON.stringify({ providerId: opts.providerId }),
        }, async (res) => {
            if (res.status !== 200 && res.status !== 201) {
                throw await this.failOnError(res, 'POST /workspace/auth/device-flow');
            }
            return (await res.json());
        });
    }
    async getDeviceFlow(deviceFlowId, opts = {}) {
        // Forward `signal` into `fetchWithTimeout`, which composes it
        // with the per-request `fetchTimeoutMs` controller. Without this,
        // an `awaitCompletion` caller that aborts mid-poll could not cancel
        // the in-flight GET -- only the post-await guard would notice, but
        // that runs only after the body is already settled (or the
        // daemon-side `fetchTimeoutMs` fires, which can be 30s+).
        return await this.fetchWithTimeout(`${this.baseUrl}/workspace/auth/device-flow/${urlEncode(deviceFlowId)}`, { headers: this.headers({}, opts.clientId), signal: opts.signal }, async (res) => {
            if (!res.ok) {
                throw await this.failOnError(res, 'GET /workspace/auth/device-flow/:id');
            }
            return (await res.json());
        });
    }
    /**
     * Cancel a pending device-flow. Idempotent: terminal entries return
     * 204 (no-op); unknown ids return 404 â€” both resolve here, matching
     * the SDK's `closeSession` shape.
     */
    async cancelDeviceFlow(deviceFlowId, opts = {}) {
        return await this.fetchWithTimeout(`${this.baseUrl}/workspace/auth/device-flow/${urlEncode(deviceFlowId)}`, {
            method: 'DELETE',
            headers: this.headers({}, opts.clientId),
        }, async (res) => {
            if (res.status === 204 || res.status === 404) {
                try {
                    await res.body?.cancel();
                }
                catch {
                    /* body already consumed or no body */
                }
                return;
            }
            throw await this.failOnError(res, 'DELETE /workspace/auth/device-flow/:id');
        });
    }
    /** Snapshot of persisted auth credentials + currently pending device-flows. */
    async getAuthStatus(opts = {}) {
        return await this.fetchWithTimeout(`${this.baseUrl}/workspace/auth/status`, { headers: this.headers({}, opts.clientId) }, async (res) => {
            if (!res.ok) {
                throw await this.failOnError(res, 'GET /workspace/auth/status');
            }
            return (await res.json());
        });
    }
    async getAuthProviders() {
        return await this.fetchWithTimeout(`${this.baseUrl}/workspace/auth/providers`, { headers: this.headers() }, async (res) => {
            if (!res.ok) {
                throw await this.failOnError(res, 'GET /workspace/auth/providers');
            }
            return (await res.json());
        });
    }
    async installAuthProvider(req) {
        return await this.fetchWithTimeout(`${this.baseUrl}/workspace/auth/provider`, {
            method: 'POST',
            headers: this.headers({ 'Content-Type': 'application/json' }),
            body: JSON.stringify(req),
        }, async (res) => {
            if (!res.ok) {
                throw await this.failOnError(res, 'POST /workspace/auth/provider');
            }
            return (await res.json());
        });
    }
    async addWorkspace(cwd, options = {}) {
        return await this.fetchWithTimeout(`${this.baseUrl}/workspaces`, {
            method: 'POST',
            headers: this.headers({ 'Content-Type': 'application/json' }),
            body: JSON.stringify({
                cwd,
                ...(options.persist ? { persist: true } : {}),
            }),
        }, async (res) => {
            if (!res.ok) {
                throw await this.failOnError(res, 'POST /workspaces');
            }
            return (await res.json());
        });
    }
    // -- Lifecycle / disposal ------------------------------------------------
    /**
     * Release transport resources (WS close, etc.). Idempotent.
     * After `dispose()`, further calls to `fetch` / `subscribeEvents`
     * on the underlying transport throw `DaemonTransportClosedError`.
     */
    dispose() {
        this.transport.dispose();
    }
    // -- Session artifacts ---------------------------------------------------
    async listSessionArtifacts(sessionId, clientId) {
        return await this.jsonRequest(`/session/${urlEncode(sessionId)}/artifacts`, 'GET /session/:id/artifacts', { clientId });
    }
    async addSessionArtifact(sessionId, artifact, clientId) {
        return await this.jsonRequest(`/session/${urlEncode(sessionId)}/artifacts`, 'POST /session/:id/artifacts', {
            method: 'POST',
            body: artifact,
            clientId,
        });
    }
    async removeSessionArtifact(sessionId, artifactId, clientId) {
        return await this.jsonRequest(`/session/${urlEncode(sessionId)}/artifacts/${urlEncode(artifactId)}`, 'DELETE /session/:id/artifacts/:artifactId', {
            method: 'DELETE',
            clientId,
        });
    }
    // -- Session metadata ----------------------------------------------------
    /**
     * Patch mutable session metadata and return the effective stored metadata
     * reported by the daemon.
     */
    async updateSessionMetadata(sessionId, metadata, clientId) {
        return await this.fetchWithTimeout(`${this.baseUrl}/session/${urlEncode(sessionId)}/metadata`, {
            method: 'PATCH',
            headers: this.headers({ 'Content-Type': 'application/json' }, clientId),
            body: JSON.stringify(metadata),
        }, async (res) => {
            if (res.status === 200) {
                const body = (await res.json());
                return typeof body.displayName === 'string'
                    ? { displayName: body.displayName }
                    : {};
            }
            throw await this.failOnError(res, 'PATCH /session/:id/metadata');
        });
    }
}
export class WorkspaceDaemonClient {
    client;
    workspaceSelector;
    constructor(client, workspaceSelector) {
        this.client = client;
        this.workspaceSelector = workspaceSelector;
    }
    workspaceMcp() {
        return this.get('/mcp', 'GET /workspaces/:workspace/mcp');
    }
    initializeWorkspaceMcp() {
        return this.post('/mcp/initialize', 'POST /workspaces/:workspace/mcp/initialize', {});
    }
    reloadWorkspaceMcp() {
        return this.post('/mcp/reload', 'POST /workspaces/:workspace/mcp/reload', {});
    }
    workspaceVoice(clientId) {
        return this.client.workspaceJsonRequest(this.workspaceSelector, '/voice', 'GET /workspaces/:workspace/voice', { clientId, mode: 'rest' });
    }
    setWorkspaceVoice(update, clientId) {
        return this.client.workspaceJsonRequest(this.workspaceSelector, '/voice', 'POST /workspaces/:workspace/voice', { method: 'POST', body: update, clientId, mode: 'rest' });
    }
    transcribeWorkspaceVoice(audio, opts) {
        return this.client.workspaceVoiceTranscriptionRequest(this.workspaceSelector, audio, opts);
    }
    workspaceGit() {
        return this.client.workspaceJsonRequest(this.workspaceSelector, '/git', 'GET /workspaces/:workspace/git', { mode: 'rest' });
    }
    workspaceGitDiff() {
        return this.client.workspaceJsonRequest(this.workspaceSelector, '/git/diff', 'GET /workspaces/:workspace/git/diff', { mode: 'rest' });
    }
    workspaceGitDiffFile(path, oldPath) {
        const query = `/git/diff/file?path=${urlEncode(path)}` +
            (oldPath != null ? `&oldPath=${urlEncode(oldPath)}` : '');
        return this.client.workspaceJsonRequest(this.workspaceSelector, query, 'GET /workspaces/:workspace/git/diff/file', { mode: 'rest' });
    }
    workspaceSkills() {
        return this.get('/skills', 'GET /workspaces/:workspace/skills');
    }
    workspaceProviders() {
        return this.get('/providers', 'GET /workspaces/:workspace/providers');
    }
    workspaceHooks() {
        return this.get('/hooks', 'GET /workspaces/:workspace/hooks');
    }
    workspaceEnv() {
        return this.get('/env', 'GET /workspaces/:workspace/env');
    }
    workspacePreflight() {
        return this.get('/preflight', 'GET /workspaces/:workspace/preflight');
    }
    workspaceTools() {
        return this.get('/tools', 'GET /workspaces/:workspace/tools');
    }
    workspaceMemory() {
        return this.get('/memory', 'GET /workspaces/:workspace/memory');
    }
    remove(options) {
        const body = options?.force === undefined
            ? undefined
            : {
                force: options.force,
            };
        return this.client.workspaceJsonRequest(this.workspaceSelector, '', 'DELETE /workspaces/:workspace', {
            method: 'DELETE',
            ...(body ? { body } : {}),
            ...(options?.timeoutMs !== undefined
                ? { timeoutMs: options.timeoutMs }
                : {}),
            mode: 'rest',
        });
    }
    writeWorkspaceMemory(req, clientId) {
        return this.post('/memory', 'POST /workspaces/:workspace/memory', { ...req, scope: 'workspace' }, clientId);
    }
    listWorkspaceAgents() {
        return this.get('/agents', 'GET /workspaces/:workspace/agents');
    }
    createWorkspaceAgent(req, clientId) {
        return this.post('/agents', 'POST /workspaces/:workspace/agents', { ...req, scope: req.scope ?? 'workspace' }, clientId);
    }
    getWorkspaceAgent(agentType) {
        return this.get(`/agents/${urlEncode(agentType)}`, 'GET /workspaces/:workspace/agents/:agentType');
    }
    updateWorkspaceAgent(agentType, req, opts = {}) {
        const query = opts.scope ? `?scope=${urlEncode(opts.scope)}` : '';
        return this.post(`/agents/${urlEncode(agentType)}${query}`, 'POST /workspaces/:workspace/agents/:agentType', req, opts.clientId);
    }
    async deleteWorkspaceAgent(agentType, opts = {}) {
        const query = opts.scope ? `?scope=${urlEncode(opts.scope)}` : '';
        return await this.client.workspaceNoContentRequest(this.workspaceSelector, `/agents/${urlEncode(agentType)}${query}`, 'DELETE /workspaces/:workspace/agents/:agentType', {
            method: 'DELETE',
            clientId: opts.clientId,
            okNotFoundCode: 'agent_not_found',
        });
    }
    async listWorkspaceSessionsPage(options) {
        if (options?.sourceType !== undefined || options?.sourceId !== undefined) {
            await this.client.requireCapability('session_source_metadata');
        }
        const requestedPageSize = options?.pageSize ?? DEFAULT_SESSION_LIST_PAGE_SIZE;
        const pageSize = Math.max(1, Math.min(1000, Math.round(Number.isFinite(requestedPageSize)
            ? requestedPageSize
            : DEFAULT_SESSION_LIST_PAGE_SIZE)));
        const query = new URLSearchParams({ size: String(pageSize) });
        if (options?.cursor !== undefined)
            query.set('cursor', options.cursor);
        if (options?.archiveState !== undefined) {
            query.set('archiveState', options.archiveState);
        }
        if (options?.view !== undefined)
            query.set('view', options.view);
        if (options?.group !== undefined)
            query.set('group', options.group);
        if (options?.parentSessionId !== undefined) {
            query.set('parentSessionId', options.parentSessionId);
        }
        if (options?.sourceType !== undefined) {
            query.set('sourceType', options.sourceType);
        }
        if (options?.sourceId !== undefined) {
            query.set('sourceId', options.sourceId);
        }
        return await this.get(`/sessions?${query.toString()}`, 'GET /workspaces/:workspace/sessions');
    }
    async listWorkspaceSessions(options) {
        const page = await this.listWorkspaceSessionsPage(options);
        return page.sessions;
    }
    getWorkspaceSessionInfo() {
        return this.get('/session-info', 'GET /workspaces/:workspace/session-info');
    }
    /**
     * Read one page from an active persisted session transcript in this
     * workspace.
     * The daemon performs replay locally without attaching to the session or
     * starting ACP. This method always uses native REST transport.
     */
    getSessionTranscriptPage(sessionId, opts = {}) {
        return this.client.workspaceJsonRequest(this.workspaceSelector, `/session/${urlEncode(sessionId)}/transcript${transcriptPageSuffix(opts)}`, 'GET /workspaces/:workspace/session/:id/transcript', { clientId: opts.clientId, mode: 'rest' });
    }
    /** Export an active persisted session from this registered workspace. */
    exportSession(sessionId, opts = {}) {
        return this.client.sessionExportRequest(`/workspaces/${this.workspaceSelector}/session/${urlEncode(sessionId)}/export`, 'GET /workspaces/:workspace/session/:id/export', opts);
    }
    /** Export an archived persisted session from this registered workspace. */
    exportArchivedSession(sessionId, opts = {}) {
        return this.client.sessionExportRequest(`/workspaces/${this.workspaceSelector}/session/${urlEncode(sessionId)}/archive/export`, 'GET /workspaces/:workspace/session/:id/archive/export', opts);
    }
    listSessionGroups() {
        return this.get('/session-groups', 'GET /workspaces/:workspace/session-groups');
    }
    async createSessionGroup(input) {
        const body = await this.post('/session-groups', 'POST /workspaces/:workspace/session-groups', input);
        return body.group;
    }
    async updateSessionGroup(groupId, update) {
        const body = await this.client.workspaceJsonRequest(this.workspaceSelector, `/session-groups/${urlEncode(groupId)}`, 'PATCH /workspaces/:workspace/session-groups/:groupId', { method: 'PATCH', body: update });
        return body.group;
    }
    deleteSessionGroup(groupId) {
        return this.client.workspaceJsonRequest(this.workspaceSelector, `/session-groups/${urlEncode(groupId)}`, 'DELETE /workspaces/:workspace/session-groups/:groupId', { method: 'DELETE' });
    }
    updateSessionOrganization(sessionId, update, clientId) {
        return this.client.workspaceJsonRequest(this.workspaceSelector, `/session/${urlEncode(sessionId)}/organization`, 'PATCH /workspaces/:workspace/session/:id/organization', { method: 'PATCH', body: update, clientId });
    }
    deleteSessionsData(sessionIds, clientId) {
        return this.post('/sessions/delete', 'POST /workspaces/:workspace/sessions/delete', { sessionIds }, clientId);
    }
    archiveSessionsData(sessionIds, clientId) {
        return this.post('/sessions/archive', 'POST /workspaces/:workspace/sessions/archive', { sessionIds }, clientId);
    }
    unarchiveSessionsData(sessionIds, clientId) {
        return this.post('/sessions/unarchive', 'POST /workspaces/:workspace/sessions/unarchive', { sessionIds }, clientId);
    }
    readWorkspaceFile(filePath, opts = {}, clientId) {
        const query = new URLSearchParams({ path: filePath });
        if (opts.maxBytes !== undefined)
            query.set('maxBytes', String(opts.maxBytes));
        if (opts.line !== undefined)
            query.set('line', String(opts.line));
        if (opts.limit !== undefined)
            query.set('limit', String(opts.limit));
        return this.get(`/file?${query.toString()}`, 'GET /workspaces/:workspace/file', clientId);
    }
    readWorkspaceFileBytes(filePath, opts = {}, clientId) {
        const query = new URLSearchParams({ path: filePath });
        if (opts.offset !== undefined)
            query.set('offset', String(opts.offset));
        if (opts.maxBytes !== undefined)
            query.set('maxBytes', String(opts.maxBytes));
        return this.get(`/file/bytes?${query.toString()}`, 'GET /workspaces/:workspace/file/bytes', clientId);
    }
    fileStat(filePath) {
        const query = new URLSearchParams({ path: filePath });
        return this.get(`/stat?${query.toString()}`, 'GET /workspaces/:workspace/stat');
    }
    dirList(dirPath) {
        const query = new URLSearchParams({ path: dirPath });
        return this.get(`/list?${query.toString()}`, 'GET /workspaces/:workspace/list');
    }
    glob(pattern, opts = {}) {
        const query = new URLSearchParams({ pattern });
        if (opts.maxResults !== undefined) {
            query.set('maxResults', String(opts.maxResults));
        }
        return this.client.workspaceJsonRequest(this.workspaceSelector, `/glob?${query.toString()}`, 'GET /workspaces/:workspace/glob', { signal: opts.signal });
    }
    writeWorkspaceFile(req, clientId) {
        return this.post('/file/write', 'POST /workspaces/:workspace/file/write', req, clientId);
    }
    editWorkspaceFile(req, clientId) {
        return this.post('/file/edit', 'POST /workspaces/:workspace/file/edit', req, clientId);
    }
    workspaceSettings(opts) {
        return this.get('/settings', 'GET /workspaces/:workspace/settings', opts?.clientId);
    }
    setWorkspaceSetting(
    // The workspace-qualified settings route is workspace-only (see
    // QUALIFIED_WRITE_SCOPES); only the primary DaemonClient writes user scope.
    scope, key, value, opts) {
        return this.post('/settings', 'POST /workspaces/:workspace/settings', {
            scope,
            key,
            value,
            ...(opts?.mcpServerMutation
                ? { mcpServerMutation: opts.mcpServerMutation }
                : {}),
        }, opts?.clientId);
    }
    workspaceTrust(opts) {
        return this.get('/trust', 'GET /workspaces/:workspace/trust', opts?.clientId);
    }
    requestWorkspaceTrustChange(request, clientId) {
        return this.post('/trust/request', 'POST /workspaces/:workspace/trust/request', request, clientId);
    }
    workspacePermissions(opts) {
        return this.get('/permissions', 'GET /workspaces/:workspace/permissions', opts?.clientId);
    }
    setWorkspacePermissionRules(ruleType, rules, opts) {
        return this.post('/permissions', 'POST /workspaces/:workspace/permissions', { scope: 'workspace', ruleType, rules: [...rules] }, opts?.clientId);
    }
    setWorkspaceToolEnabled(toolName, enabled, opts) {
        return this.post(`/tools/${urlEncode(toolName)}/enable`, 'POST /workspaces/:workspace/tools/:name/enable', { enabled }, opts?.clientId);
    }
    setWorkspaceSkillEnabled(skillName, enabled, opts) {
        return this.post(`/skills/${urlEncode(skillName)}/enable`, 'POST /workspaces/:workspace/skills/:name/enable', { enabled }, opts?.clientId);
    }
    restartMcpServer(serverName, opts) {
        const query = opts?.entryIndex === undefined
            ? ''
            : `?entryIndex=${urlEncode(String(opts.entryIndex))}`;
        return this.post(`/mcp/${urlEncode(serverName)}/restart${query}`, 'POST /workspaces/:workspace/mcp/:server/restart', {}, opts?.clientId, opts?.timeoutMs ?? MCP_RESTART_DEFAULT_TIMEOUT_MS);
    }
    reload(opts) {
        return this.post('/reload', 'POST /workspaces/:workspace/reload', {}, opts?.clientId, opts?.timeoutMs);
    }
    initWorkspace(opts) {
        return this.post('/init', 'POST /workspaces/:workspace/init', opts?.force === true ? { force: true } : {}, opts?.clientId);
    }
    workspaceExtensions() {
        return this.client.workspaceJsonRequest(this.workspaceSelector, '/extensions', 'GET /workspaces/:workspace/extensions', { mode: 'rest' });
    }
    setExtensionActivation(extensionId, state, clientId) {
        return this.client.workspaceJsonRequest(this.workspaceSelector, `/extensions/${urlEncode(extensionId)}/activation`, 'PUT /workspaces/:workspace/extensions/:extensionId/activation', { method: 'PUT', body: { state }, clientId, mode: 'rest' });
    }
    clearExtensionActivation(extensionId, clientId) {
        return this.client.workspaceJsonRequest(this.workspaceSelector, `/extensions/${urlEncode(extensionId)}/activation`, 'DELETE /workspaces/:workspace/extensions/:extensionId/activation', { method: 'DELETE', clientId, mode: 'rest' });
    }
    refreshExtensionRuntime(clientId) {
        return this.client.workspaceJsonRequest(this.workspaceSelector, '/extensions/refresh', 'POST /workspaces/:workspace/extensions/refresh', { method: 'POST', body: {}, clientId, mode: 'rest' });
    }
    get(path, label, clientId) {
        return this.client.workspaceJsonRequest(this.workspaceSelector, path, label, { clientId });
    }
    post(path, label, body, clientId, timeoutMs) {
        return this.client.workspaceJsonRequest(this.workspaceSelector, path, label, { method: 'POST', body, clientId, timeoutMs });
    }
}
/**
 * `AbortSignal.timeout` is in every Node version this package supports
 * (`engines.node >=22.0.0` ships it natively). The feature-detect below
 * is defensive against non-Node runtimes â€” browsers / edge workers /
 * stripped-down V8 hosts that may consume the SDK and ship an
 * incomplete `AbortSignal` shape.
 */
// Exported solely for direct unit testing â€” production callers go
// through `fetchWithTimeout` above. The polyfill branch only fires on
// runtimes where `AbortSignal.timeout` isn't natively available
// (non-Node hosts), which can't easily be exercised from the public
// API surface in unit tests.
export function abortTimeout(ms) {
    const tFn = AbortSignal.timeout;
    if (typeof tFn === 'function')
        return tFn.call(AbortSignal, ms);
    const ctrl = new AbortController();
    // `.unref()` so a fast-resolving fetch doesn't keep the event loop
    // alive waiting for this timer to fire (the call is `await`-ed so
    // a long-lived event loop is the caller's problem, not ours).
    // Also clear the timer when the controller aborts via another path
    // (the composed callerSignal aborts first) so we don't accumulate
    // pending timers across many fast calls in the polyfill path.
    // Native `AbortSignal.timeout()` aborts with a DOMException whose
    // `name === 'TimeoutError'` (per WHATWG). Constructor signature is
    // `new DOMException(message, name)` â€” calling `new DOMException(
    // 'TimeoutError')` would set the *message* to "TimeoutError" and
    // leave `name` at its default ("Error"), so callers doing
    // `if (err.name === 'TimeoutError')` would see the polyfill
    // differently from the native runtime.
    const handle = setTimeout(() => ctrl.abort(new DOMException('timeout', 'TimeoutError')), ms);
    if (typeof handle === 'object' && handle && 'unref' in handle) {
        handle.unref();
    }
    ctrl.signal.addEventListener('abort', () => clearTimeout(handle), { once: true });
    return ctrl.signal;
}
/**
 * `AbortSignal.any` is available natively in every Node version this
 * package supports (`engines.node >=22.0.0` ships it). The polyfill
 * branch below is defensive against non-Node runtimes (browsers /
 * edge workers / stripped-down V8 hosts) that may consume the SDK
 * and lack `AbortSignal.any` â€” without it those callers would throw
 * `TypeError: AbortSignal.any is not a function` on every
 * non-streaming method.
 *
 * The polyfill creates a fresh controller and forwards the first abort
 * from any input signal, including any that are already aborted at call
 * time. It does NOT support every native edge-case (cleanup of remaining
 * listeners after the first fire is best-effort), but for `fetch`-style
 * single-shot use the difference is invisible.
 */
// Exported solely for direct unit testing â€” see note on `abortTimeout`.
export function composeAbortSignals(signals) {
    const anyFn = AbortSignal.any;
    if (typeof anyFn === 'function')
        return anyFn.call(AbortSignal, signals);
    const ctrl = new AbortController();
    // Track per-input listener so we can detach them all on the FIRST
    // abort (whichever input fires). Without this, callers who reuse a
    // long-lived AbortSignal (e.g. a session-scope cancel signal that
    // never fires for the lifetime of the SDK client) accumulate one
    // listener per SDK call â€” slow leak that retains the closure +
    // controller of every prior call.
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
    // Also detach if our composed controller aborts via some other path
    // (e.g. its consumer aborted independently â€” defense-in-depth).
    ctrl.signal.addEventListener('abort', detachAll, { once: true });
    return ctrl.signal;
}
/**
 * Check whether a daemon SSE event is a `turn_complete` or
 * `turn_error` matching `promptId`. Returns `PromptResult` on
 * `turn_complete`, throws `DaemonHttpError` on `turn_error`,
 * returns `undefined` for non-matching / unrelated events.
 *
 * Extracted so both `DaemonClient._awaitTurnComplete` (temporary SSE
 * fallback) and `DaemonSessionClient.prompt` (existing subscription
 * path) share the same matching logic.
 */
export function matchTurnEvent(event, promptId) {
    if (event.type === 'turn_complete') {
        const data = event.data;
        if (data.promptId === promptId) {
            return { stopReason: data.stopReason ?? 'end_turn' };
        }
    }
    if (event.type === 'turn_error') {
        const data = event.data;
        if (data.promptId === promptId) {
            throw Object.assign(new DaemonHttpError(500, data.code ?? 'turn_error', data.message ?? 'Prompt failed'), { _daemonTurnError: true });
        }
    }
    return undefined;
}
export function isNonBlockingAccepted(result) {
    return 'promptId' in result && 'lastEventId' in result;
}
//# sourceMappingURL=DaemonClient.js.map