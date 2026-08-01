/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { DaemonHttpError } from './DaemonHttpError.js';
import { isNonBlockingAccepted, matchTurnEvent, normalizePendingPromptLimit, } from './DaemonClient.js';
/**
 * Session-scoped wrapper around `DaemonClient`.
 *
 * `DaemonClient` mirrors the raw HTTP API and requires a `sessionId` on each
 * method. `DaemonSessionClient` is the adapter-facing layer for TUI, channel,
 * IDE, and web backends: it binds one daemon session, forwards the existing
 * Stage 1 routes, and preserves SSE replay state. It intentionally does not
 * interpret daemon event payloads; typed event reducers belong to the protocol
 * schema layer — see `asKnownDaemonEvent` and `reduceDaemonSessionEvent` in
 * `./events.js` for the typed consumption surface.
 */
export class DaemonSessionClient {
    client;
    session;
    state;
    replaySnapshot;
    hasActivePrompt;
    historyHasMore;
    lastSeenEventId;
    subscriptionActive = false;
    /** In-flight `reattach()` so concurrent prompts re-register only once. */
    reattaching;
    promptLimit;
    _pendingPrompts = new Map();
    constructor(opts) {
        this.client = opts.client;
        this.session = { ...opts.session };
        this.state = { ...(opts.state ?? {}) };
        this.hasActivePrompt = opts.hasActivePrompt ?? false;
        this.historyHasMore = opts.historyHasMore ?? false;
        this.replaySnapshot = opts.replaySnapshot ?? {
            compactedReplay: [],
            liveJournal: [],
        };
        this.lastSeenEventId = validateLastEventId(opts.lastEventId);
        this.promptLimit =
            opts.maxPendingPromptsPerSession === undefined
                ? opts.client.maxPendingPromptsPerSession
                : normalizePendingPromptLimit(opts.maxPendingPromptsPerSession);
    }
    /**
     * Creates a new daemon session or attaches to an existing matching session.
     */
    static async createOrAttach(client, req = {}, clientId) {
        const session = await client.createOrAttachSession(req, clientId);
        // Seed the first subscription from the daemon replay ring whenever
        // events can fire during the session-creation window — otherwise
        // they land in the per-session ring before the consumer's first
        // `events()` call and never reach the live stream.
        //
        // Two such windows exist today:
        // - **Newly-created sessions** (`session.attached === false`): the
        //   child's `newSession` handler runs MCP discovery synchronously
        //   in legacy blocking mode and as background work in progressive
        //   mode. The daemon's `mcp_budget_warning` / `mcp_child_refused_batch`
        //   push events fire during this window and are buffered on
        //   `BridgeClient.earlyEvents` until `byId.set` runs, then drained
        //   into the per-session bus before `spawnOrAttach` returns. The
        //   guardrail events advertised via `mcp_guardrail_events` are
        //   useless without this seed because they predate any live
        //   subscription.
        // - **Carve-out**: attach-time `modelServiceId` and
        //   `approvalMode` changes are reported on SSE, not only the
        //   create/attach HTTP response. The original carve-out covered
        //   just model changes; approval-mode changes have the same
        //   pre-subscription event window. The unified rule below subsumes
        //   newly-created sessions while preserving re-attach semantics for
        //   callers without attach-time state changes.
        //
        // The daemon treats Last-Event-ID: 0 as "replay from the beginning
        // of the bounded ring"; if older events have already been evicted,
        // clients receive the retained suffix and continue live from there.
        const lastEventId = !session.attached || req.modelServiceId || req.approvalMode
            ? 0
            : undefined;
        return new DaemonSessionClient({
            client,
            session,
            hasActivePrompt: session.hasActivePrompt,
            lastEventId,
        });
    }
    /**
     * Loads an existing daemon session and seeds the first event subscription
     * from the start of the daemon replay ring so history replay frames emitted
     * during `session/load` are visible to this client.
     */
    static async load(client, sessionId, req = {}, clientId) {
        const { state, hasActivePrompt, compactedReplay, liveJournal, historyHasMore, lastEventId: serverLastEventId, ...session } = await client.loadSession(sessionId, req, clientId);
        return new DaemonSessionClient({
            client,
            session,
            hasActivePrompt,
            state,
            lastEventId: serverLastEventId ?? 0,
            replaySnapshot: {
                compactedReplay: compactedReplay ?? [],
                liveJournal: liveJournal ?? [],
            },
            historyHasMore,
        });
    }
    /**
     * Resumes an existing daemon session without requesting history replay.
     * When the daemon returns a watermark (`lastEventId`), uses it as the
     * initial SSE cursor. Falls back to 0 for older daemons so
     * post-resume events (e.g. `available_commands_update`) are captured.
     */
    static async resume(client, sessionId, req = {}, clientId) {
        const { state, hasActivePrompt, lastEventId: serverLastEventId, ...session } = await client.resumeSession(sessionId, req, clientId);
        return new DaemonSessionClient({
            client,
            session,
            hasActivePrompt,
            state,
            lastEventId: serverLastEventId ?? 0,
        });
    }
    get sessionId() {
        return this.session.sessionId;
    }
    get workspaceCwd() {
        return this.session.workspaceCwd;
    }
    get attached() {
        return this.session.attached;
    }
    get clientId() {
        return this.session.clientId;
    }
    get lastEventId() {
        return this.lastSeenEventId;
    }
    setLastEventId(lastEventId) {
        this.lastSeenEventId = validateLastEventId(lastEventId);
    }
    async prompt(req, signal) {
        signal?.throwIfAborted();
        if (!this.subscriptionActive) {
            return await this.withClientIdSelfHeal(() => this.client.prompt(this.sessionId, req, signal, this.clientId));
        }
        const releaseAdmission = this.client.reservePromptSlot(this.sessionId, this.promptLimit);
        let accepted;
        try {
            accepted = await this.withClientIdSelfHeal(() => this.client.promptNonBlocking(this.sessionId, req, signal, this.clientId));
            if (!isNonBlockingAccepted(accepted)) {
                releaseAdmission();
                return accepted;
            }
            if (!this.subscriptionActive) {
                throw Error('SSE stream ended');
            }
        }
        catch (err) {
            releaseAdmission();
            throw err;
        }
        return new Promise((resolve, reject) => {
            const onAbort = () => {
                const pending = this._pendingPrompts.get(accepted.promptId);
                if (pending && this._pendingPrompts.delete(accepted.promptId)) {
                    this.client.cancel(this.sessionId, this.clientId).catch(() => { });
                    pending.reject(signal.reason ?? new DOMException('Aborted', 'AbortError'));
                }
            };
            const cleanup = () => signal?.removeEventListener('abort', onAbort);
            this._pendingPrompts.set(accepted.promptId, {
                resolve: (r) => {
                    cleanup();
                    releaseAdmission();
                    resolve(r);
                },
                reject: (e) => {
                    cleanup();
                    releaseAdmission();
                    reject(e);
                },
            });
            if (signal?.aborted) {
                onAbort();
            }
            else {
                signal?.addEventListener('abort', onAbort, { once: true });
            }
        });
    }
    /**
     * Submit a prompt and return as soon as the daemon accepts it.
     *
     * This is admission-only: it does not reserve a client-side prompt slot,
     * register the prompt in `_pendingPrompts`, or wait for the matching
     * `turn_complete` / `turn_error` SSE event. Callers that need final turn
     * results should use `prompt()` or manage SSE terminal events themselves.
     */
    async submitPrompt(req, signal) {
        signal?.throwIfAborted();
        const accepted = await this.withClientIdSelfHeal(() => this.client.promptNonBlocking(this.sessionId, req, signal, this.clientId));
        if (!isNonBlockingAccepted(accepted)) {
            throw new Error('Expected non-blocking prompt acceptance');
        }
        return accepted;
    }
    /**
     * Run a prompt-admission call, recovering from a stale `clientId`.
     *
     * A daemon restart (or session reload) wipes the daemon's in-memory client
     * registration, so a prompt sent with our now-unknown `clientId` is rejected
     * at admission with `400 invalid_client_id` (see PR #5784). That rejection
     * happens before the turn is registered, so the prompt never ran — retrying
     * cannot double-execute. We re-register to obtain a fresh `clientId` and
     * retry the admission exactly once. Any other error (and a second
     * `invalid_client_id`) propagates.
     */
    async withClientIdSelfHeal(fn) {
        try {
            return await fn();
        }
        catch (err) {
            if (!isInvalidClientId(err))
                throw err;
            await this.reattach();
            return await fn();
        }
    }
    /**
     * Re-register this client against the (already-restored) session to obtain a
     * fresh daemon-assigned `clientId`. Concurrent callers coalesce onto a single
     * in-flight `resume` so we never orphan extra registrations.
     */
    async reattach() {
        if (this.reattaching)
            return this.reattaching;
        // Send no clientId so the bridge issues a fresh registration rather than
        // validating the stale one. Pass workspaceCwd explicitly: the daemon's
        // restore path resolves the workspace key before its existing-session fast
        // path, and that resolution rejects a missing/relative path.
        this.reattaching = this.client
            .resumeSession(this.sessionId, { workspaceCwd: this.workspaceCwd })
            .then((session) => {
            // Refresh only the clientId; leave the SSE cursor and ACP state intact.
            this.session.clientId = session.clientId;
        });
        try {
            await this.reattaching;
        }
        finally {
            this.reattaching = undefined;
        }
    }
    async cancel() {
        await this.client.cancel(this.sessionId, this.clientId);
    }
    /**
     * Bump the daemon's last-seen bookkeeping for this session. Adapters
     * with a long-lived view of a session (TUI/IDE/web) can fire this on
     * an interval to keep diagnostics fresh and feed future revocation
     * policy. Forwards the bound `clientId` so identified clients update
     * their per-client timestamp instead of just the session-wide one.
     */
    async heartbeat() {
        return await this.client.heartbeat(this.sessionId, this.clientId);
    }
    async artifacts() {
        return await this.client.listSessionArtifacts(this.sessionId, this.clientId);
    }
    async addArtifact(artifact) {
        return await this.client.addSessionArtifact(this.sessionId, artifact, this.clientId);
    }
    async removeArtifact(artifactId) {
        return await this.client.removeSessionArtifact(this.sessionId, artifactId, this.clientId);
    }
    async setModel(modelId) {
        return await this.client.setSessionModel(this.sessionId, modelId, this.clientId);
    }
    async getRewindSnapshots() {
        return await this.client.getRewindSnapshots(this.sessionId);
    }
    async rewind(promptId, opts) {
        return await this.client.rewindSession(this.sessionId, promptId, {
            clientId: this.clientId,
            ...(opts?.rewindFiles !== undefined
                ? { rewindFiles: opts.rewindFiles }
                : {}),
        });
    }
    async fork(directive) {
        return await this.client.forkSession(this.sessionId, { directive }, this.clientId);
    }
    /**
     * One-sentence "where did I leave off" recap of this session. See
     * `DaemonClient.recapSession` for the full contract: best-effort
     * (may return `recap: null`); the optional `signal` aborts only the
     * local HTTP fetch — the daemon-side wait + the LLM call in the ACP
     * child both run to completion regardless (no cross-process abort
     * plumbing in v1).
     */
    async recap(opts) {
        return await this.client.recapSession(this.sessionId, {
            ...(opts?.signal ? { signal: opts.signal } : {}),
            ...(this.clientId ? { clientId: this.clientId } : {}),
        });
    }
    generateContent(prompt, opts) {
        return this.client.generateSessionContent(this.sessionId, prompt, {
            ...(opts?.signal ? { signal: opts.signal } : {}),
            ...(this.clientId ? { clientId: this.clientId } : {}),
        });
    }
    async btw(question, opts) {
        return await this.client.btwSession(this.sessionId, question, {
            ...(opts?.signal ? { signal: opts.signal } : {}),
            ...(this.clientId ? { clientId: this.clientId } : {}),
        });
    }
    /**
     * Queue a user message typed while this session's turn is still running so
     * the ACP child can drain it mid-turn. Forwards the client id bound at
     * create/attach. Resolves `{ accepted: false }` when the session is idle —
     * the caller should then send the message as a normal next-turn prompt.
     */
    async enqueueMidTurnMessage(message, opts) {
        return await this.client.enqueueMidTurnMessage(this.sessionId, message, {
            ...(opts?.signal ? { signal: opts.signal } : {}),
            ...(this.clientId ? { clientId: this.clientId } : {}),
        });
    }
    async getPendingPrompts() {
        return await this.client.getPendingPrompts(this.sessionId, {
            ...(this.clientId ? { clientId: this.clientId } : {}),
        });
    }
    async removePendingPrompt(promptId) {
        return await this.client.removePendingPrompt(this.sessionId, promptId, {
            ...(this.clientId ? { clientId: this.clientId } : {}),
        });
    }
    /**
     * Execute a direct daemon-side shell command for this session. Requires the
     * daemon to opt in to direct session shell and bearer auth; this wrapper
     * automatically forwards the client id bound when the session was created
     * or attached.
     */
    async shellCommand(command, signal) {
        return await this.client.shellCommand(this.sessionId, command, {
            ...(signal ? { signal } : {}),
            ...(this.clientId ? { clientId: this.clientId } : {}),
        });
    }
    async context() {
        return await this.client.sessionContext(this.sessionId, this.clientId);
    }
    async status() {
        return await this.client.sessionStatus(this.sessionId, this.clientId);
    }
    async contextUsage(opts = {}) {
        return await this.client.sessionContextUsage(this.sessionId, opts, this.clientId);
    }
    async supportedCommands() {
        return await this.client.sessionSupportedCommands(this.sessionId, this.clientId);
    }
    async tasks() {
        return await this.client.sessionTasks(this.sessionId, this.clientId);
    }
    async lspStatus() {
        return await this.client.sessionLspStatus(this.sessionId, this.clientId);
    }
    async cancelTask(taskId, kind) {
        return await this.client.sessionTaskCancel(this.sessionId, taskId, kind, this.clientId);
    }
    async clearGoal() {
        return await this.client.sessionGoalClear(this.sessionId, this.clientId);
    }
    async stats() {
        return await this.client.sessionStats(this.sessionId, this.clientId);
    }
    async respondToPermission(requestId, response) {
        return await this.client.respondToPermission(requestId, response, this.clientId);
    }
    async respondToSessionPermission(requestId, response) {
        return await this.client.respondToSessionPermission(this.sessionId, requestId, response, this.clientId);
    }
    async close() {
        return await this.client.closeSession(this.sessionId, this.clientId);
    }
    async detach() {
        return await this.client.detachSession(this.sessionId, this.clientId);
    }
    async updateMetadata(metadata) {
        return await this.client.updateSessionMetadata(this.sessionId, metadata, this.clientId);
    }
    events(opts = {}) {
        return this.openEventSubscription(opts);
    }
    /**
     * @deprecated Use {@link events} instead. Both methods are equivalent.
     */
    subscribeEvents(opts = {}) {
        return this.openEventSubscription(opts);
    }
    openEventSubscription(opts) {
        const requestedLastEventId = validateLastEventId(opts.lastEventId);
        let started = false;
        let released = false;
        const release = () => {
            if (released)
                return;
            released = true;
            this.subscriptionActive = false;
        };
        const acquire = () => {
            if (started)
                return;
            if (this.subscriptionActive) {
                throw new Error('subscription active');
            }
            this.subscriptionActive = true;
            started = true;
        };
        const iterator = this.iterateEvents({ ...opts, lastEventId: requestedLastEventId }, release);
        return {
            next: async (value) => {
                if (!released) {
                    acquire();
                }
                return await iterator.next(value);
            },
            return: async () => {
                try {
                    return await iterator.return(undefined);
                }
                finally {
                    release();
                }
            },
            throw: async (error) => {
                try {
                    return await iterator.throw(error);
                }
                finally {
                    release();
                }
            },
            [Symbol.asyncIterator]() {
                return this;
            },
        };
    }
    async *iterateEvents(opts, release) {
        try {
            const { resume = true, ...subscribeOpts } = opts;
            const lastEventId = subscribeOpts.lastEventId ??
                (resume ? this.lastSeenEventId : undefined);
            for await (const event of this.client.subscribeEvents(this.sessionId, {
                ...subscribeOpts,
                lastEventId,
            })) {
                this._dispatchTurnEvent(event);
                yield event;
                if (event.id !== undefined) {
                    this.lastSeenEventId = Math.max(this.lastSeenEventId ?? 0, validateLastEventId(event.id));
                }
            }
        }
        finally {
            this._rejectAllPending(new Error('SSE stream ended'));
            release();
        }
    }
    _dispatchTurnEvent(event) {
        if (event.type !== 'turn_complete' && event.type !== 'turn_error')
            return;
        const promptId = event.data
            ?.promptId;
        if (!promptId)
            return;
        const pending = this._pendingPrompts.get(promptId);
        if (!pending)
            return;
        this._pendingPrompts.delete(promptId);
        try {
            const result = matchTurnEvent(event, promptId);
            if (result !== undefined)
                pending.resolve(result);
        }
        catch (err) {
            pending.reject(err);
        }
    }
    _rejectAllPending(err) {
        for (const [, pending] of this._pendingPrompts) {
            pending.reject(err);
        }
        this._pendingPrompts.clear();
    }
}
function validateLastEventId(lastEventId) {
    if (lastEventId === undefined)
        return undefined;
    if (!Number.isInteger(lastEventId) || lastEventId < 0) {
        throw new TypeError('invalid lastEventId');
    }
    return lastEventId;
}
/**
 * True for the daemon's `400 invalid_client_id` prompt-admission rejection
 * (the stale-clientId signal a daemon restart / session reload produces).
 */
function isInvalidClientId(err) {
    return (err instanceof DaemonHttpError &&
        err.status === 400 &&
        typeof err.body === 'object' &&
        err.body !== null &&
        err.body.code === 'invalid_client_id');
}
//# sourceMappingURL=DaemonSessionClient.js.map