/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
export const EVENT_SCHEMA_VERSION = 1;
const DEFAULT_MAX_QUEUED = 256;
export const DEFAULT_MAX_QUEUED_BYTES = 2 * 1024 * 1024;
/**
 * Default replay-ring depth per session. Sized for a 5-second
 * reconnect window over a chatty turn — a single long-running prompt
 * can emit hundreds of frames (test plan reports 13 for a short
 * turn, real workloads can be 10× that or more once tool-call /
 * thought streams pile up). 1000 was the original default and could
 * be exhausted by a moderate turn before the client reconnected;
 * 8000 matches the target set for chatty Stage 1
 * sessions, with ~30–60× headroom over a typical-but-busy turn at
 * the cost of a few hundred KB of RAM per session. Operators can
 * override per-daemon via `hopcode serve --event-ring-size <n>`.
 */
export const DEFAULT_RING_SIZE = 8000;
/**
 * Fraction of the frame and byte caps at which a `slow_client_warning`
 * synthetic frame is force-pushed to the at-risk subscriber. The warning
 * fires ONCE per overflow episode (tracked via `sub.warned`); the queue
 * must drain below `WARN_RESET_RATIO` for both caps before another warning
 * can fire — small hysteresis prevents flap-near-threshold spam when a
 * subscriber oscillates around 75% full.
 */
const WARN_THRESHOLD_RATIO = 0.75;
/** See `WARN_THRESHOLD_RATIO` doc. */
const WARN_RESET_RATIO = 0.375;
/**
 * Per-bus subscriber cap. With per-subscriber `maxQueued` defaulting to
 * 256 frames, 64 concurrent subscribers caps the per-session subscriber
 * memory at ~64 × 256 = 16k queued frames (worst case). Keeps a single
 * session from being opened thousands of times by an attacker to amplify
 * each `publish()` (which is O(N) over subscribers) into a CPU/memory
 * DoS. Daemon's HTTP listener also wants `server.maxConnections`
 * configured at the listener level — see `runHopCodeServe.ts`.
 */
const DEFAULT_MAX_SUBSCRIBERS = 64;
function getServerTimestamp(meta) {
    const existing = meta?.['serverTimestamp'];
    return typeof existing === 'number' && Number.isFinite(existing)
        ? existing
        : Date.now();
}
function normalizeMaxQueuedBytes(value) {
    if (value === undefined)
        return DEFAULT_MAX_QUEUED_BYTES;
    if (!Number.isSafeInteger(value) || value < 1) {
        throw new TypeError('maxQueuedBytes must be a positive safe integer');
    }
    return value;
}
export function serializedBridgeEventByteLength(event) {
    try {
        const serialized = JSON.stringify(event);
        if (serialized === undefined)
            return 0;
        return Buffer.byteLength(serialized, 'utf8');
    }
    catch {
        logEventSizingFailed(event.type);
        return 0;
    }
}
function logEventSizingFailed(type) {
    try {
        process.stderr.write(`hopcode serve: EventBus event sizing failed ${JSON.stringify({ type })}\n`);
    }
    catch {
        // Best-effort diagnostic; logging must not break publish()'s never-throws contract.
    }
}
function logSubscriberEvicted(data) {
    try {
        process.stderr.write(`hopcode serve: EventBus subscriber evicted ${JSON.stringify(data)}\n`);
    }
    catch {
        // Best-effort diagnostic; logging must not break publish()'s never-throws contract.
    }
}
function logSlowClientWarning(data) {
    try {
        process.stderr.write(`hopcode serve: EventBus slow_client_warning ${JSON.stringify(data)}\n`);
    }
    catch {
        // Best-effort diagnostic; logging must not break publish()'s never-throws contract.
    }
}
/**
 * Thrown by `EventBus.subscribe()` when the per-bus subscriber cap
 * has been reached. The SSE route catches this and surfaces a
 * `stream_error` frame so rejected clients see a readable failure
 * rather than a silent empty stream.
 */
export class SubscriberLimitExceededError extends Error {
    limit;
    constructor(limit) {
        super(`EventBus subscriber limit reached (${limit})`);
        this.name = 'SubscriberLimitExceededError';
        this.limit = limit;
    }
}
// FIXME(stage-1.5):
// `EventBus` is currently private to the SSE route handler. Stage 1.5
// should lift it to a top-level building block (likely
// `packages/event-bus`) so other agent-exposing surfaces
// (`channels/`, `dualOutput/`, `remoteInput/`, future TUI co-host
// and WebSocket transports) subscribe through the same bus instead
// of running parallel event streams. The `BridgeEvent` shape is
// already close to what's needed; what's missing is the bus being
// publicly addressable. Reference:
// https://github.com/TaimoorSiddiquiOfficial/HopCode/pull/3889#issuecomment-4427773706
export class EventBus {
    ringSize;
    maxSubscribers;
    compactionEngine;
    nextId = 1;
    ring = [];
    subs = new Set();
    maxQueuedBytes;
    closed = false;
    constructor(ringSize = DEFAULT_RING_SIZE, maxSubscribers = DEFAULT_MAX_SUBSCRIBERS, compactionEngine, opts = {}) {
        this.ringSize = ringSize;
        this.maxSubscribers = maxSubscribers;
        this.compactionEngine = compactionEngine;
        this.maxQueuedBytes = normalizeMaxQueuedBytes(opts.maxQueuedBytes);
    }
    snapshotReplay() {
        return this.compactionEngine?.snapshot();
    }
    /** Most recent id ever assigned by `publish`. 0 if no events published. */
    get lastEventId() {
        return this.nextId - 1;
    }
    /** Snapshot of the live subscriber count. */
    get subscriberCount() {
        return this.subs.size;
    }
    seedReplayEvents(inputs) {
        if (this.closed)
            return [];
        if (inputs.length === 0)
            return [];
        const events = [];
        for (const input of inputs) {
            const existingMeta = input._meta;
            const event = {
                id: this.nextId++,
                v: EVENT_SCHEMA_VERSION,
                ...input,
                _meta: {
                    ...(existingMeta ?? {}),
                    serverTimestamp: getServerTimestamp(existingMeta),
                },
            };
            events.push(event);
        }
        try {
            this.compactionEngine?.seedReplayEvents(events);
        }
        catch {
            // CompactionEngine is best-effort; mirror publish()'s never-throws
            // contract for bulk replay seeding.
        }
        // Seeded replay frames intentionally do not enter the reconnect ring. A
        // partially retained ring would no longer be a contiguous suffix of all ids
        // this bus produced, so clear it and let subscribe() surface resync for
        // stale cursors.
        this.ring.length = 0;
        return events;
    }
    /**
     * Publish an event to the bus. Returns the constructed `BridgeEvent`
     * (with `id` + `v` assigned) on success, or `undefined` when the
     * bus is closed.
     *
     * **Never throws** (never-throws contract). Closing the bus mid-publish
     * is the only abnormal path and is handled as a return-undefined
     * no-op; subscriber-enqueue failures are caught internally and
     * translated to per-subscriber eviction. Call sites can rely on
     * this — the historical `try { publish(...) } catch {}` blocks in
     * `httpAcpBridge.ts` are defense-in-depth, not load-bearing, and
     * may be removed in a future cleanup pass without changing
     * behavior. Don't add new try/catch wrappers around `publish()`.
     */
    publish(input) {
        // Publishing against a closed bus is a no-op rather than a throw.
        // The shutdown path closes per-session buses *before* awaiting
        // `channel.kill()`, which leaves a small window where the agent can
        // still emit a `sessionUpdate` notification or fire a
        // `requestPermission`. Throwing here would force every call site to
        // wrap publish in try/catch — and would corrupt state in
        // `BridgeClient.requestPermission`, where the daemon-wide pending
        // map mutation runs *before* the publish (see executor in
        // `httpAcpBridge.ts`). Returning undefined keeps callers
        // straightforward; nobody can observe a frame nobody can subscribe
        // to anyway.
        if (this.closed)
            return undefined;
        const existingMeta = input._meta;
        const event = {
            id: this.nextId++,
            v: EVENT_SCHEMA_VERSION,
            ...input,
            _meta: {
                ...(existingMeta ?? {}),
                serverTimestamp: getServerTimestamp(existingMeta),
            },
        };
        this.ring.push(event);
        try {
            this.compactionEngine?.ingest(event);
        }
        catch {
            // CompactionEngine is best-effort; a throw must not break the
            // publish() never-throws contract (never-throws).
        }
        // Eviction-by-shift is O(n) once the ring is full. At the current
        // default `ringSize=8000` (the target) the per-publish shift work
        // measures in low milliseconds on chatty sessions — still well
        // below per-frame latency budgets. A circular-buffer refactor
        // would push it to O(1) but adds index bookkeeping; deferred until
        // profiling actually flags it, or the operator bumps
        // `--event-ring-size` to an order of magnitude larger.
        if (this.ring.length > this.ringSize)
            this.ring.shift();
        let eventBytes;
        const getEventBytes = () => {
            eventBytes ??= serializedBridgeEventByteLength(event);
            return eventBytes;
        };
        // Snapshot the subscribers so an in-loop `this.subs.delete(sub)`
        // (the new immediate-eviction cleanup below) doesn't mutate the
        // Set we're iterating.
        for (const sub of Array.from(this.subs)) {
            if (sub.evicted)
                continue;
            const pushResult = sub.queue.push(event, getEventBytes);
            if (!pushResult.ok) {
                sub.evicted = true;
                // Synthetic terminal frame: NO `id` field. Otherwise it would
                // burn a slot in the per-session monotonic sequence (`nextId++`)
                // visible to every OTHER subscriber as a gap (3 → 5, missing 4).
                // Healthy subscribers would see the gap on the live stream and
                // on `Last-Event-ID: 3` resume the ring has no record of 4
                // either — silently broken contiguity contradicts the
                // `BridgeEvent.id` doc-comment. Same pattern as `stream_error`
                // in server.ts; `formatSseFrame` omits the `id:` line when
                // `id` is absent.
                const evictionData = {
                    reason: pushResult.reason,
                    droppedAfter: event.id,
                    queueSize: pushResult.liveSize,
                    maxQueued: sub.maxQueued,
                    queuedBytes: pushResult.liveBytes,
                    maxQueuedBytes: sub.maxQueuedBytes,
                    ...(pushResult.reason === 'queue_bytes_overflow'
                        ? { eventBytes: pushResult.eventBytes }
                        : {}),
                };
                logSubscriberEvicted(evictionData);
                const evictionFrame = {
                    v: EVENT_SCHEMA_VERSION,
                    type: 'client_evicted',
                    data: evictionData,
                };
                // Force-push the eviction frame; close immediately after so the
                // consumer iterator unwinds with a final synthetic event.
                sub.queue.forcePush(evictionFrame);
                sub.queue.close();
                // Note: dispose the subscription cleanly. `sub.dispose()`
                // both removes from `this.subs` AND detaches the
                // AbortSignal listener that `subscribe()` registered. Pre-
                // fix the eviction path only did `this.subs.delete(sub)`,
                // leaving the abort listener attached against the stalled
                // consumer's signal — the queue + sub closures were
                // retained until the AbortSignal itself went out of scope.
                // Under attack (thousands of stalled SSE clients) this
                // amplified into significant heap retention.
                sub.dispose();
                continue;
            }
            // Backpressure warning: synthetic `slow_client_warning` frame to
            // the at-risk subscriber when its live backlog crosses
            // `WARN_THRESHOLD_RATIO`. Fires ONCE per overflow episode (the
            // `warned` flag clears only after `WARN_RESET_RATIO` hysteresis
            // drain). Like `client_evicted` the frame carries no `id` — it
            // is private to this subscriber and must not burn a sequence
            // slot the replay ring would otherwise be missing for other
            // healthy subscribers. Force-push so the warning bypasses the
            // exact backlog cap that triggered it.
            //
            // Ordering: `forcePush` appends to the queue's back. Pushing to
            // the FRONT was considered to maximize lead-time, but (a) the
            // forward-position invariant in `BoundedAsyncQueue.next()`'s
            // `forcedInBuf` accounting is sized for "replay at front, live
            // at back" — mid-stream front-insertion would mis-count the
            // live backlog cap; and (b) when a consumer is actively
            // `await`ing `next()`, `forcePush`'s `resolvers.shift()`
            // shortcut delivers the warning immediately without ever
            // touching `buf`. The back-of-queue case only matters for
            // stalled consumers — and a stalled consumer can't drain
            // regardless of warning position, so the ordering is
            // informational by the time they finally pull it.
            //
            // The `warnThreshold` / `warnResetThreshold` are pre-computed
            // at `subscribe()` time so the per-publish hot path is one
            // integer compare per subscriber (after the `!warned`
            // short-circuit collapses warm-state checks to a single
            // boolean read).
            const liveSize = pushResult.liveSize;
            const liveBytes = pushResult.liveBytes;
            if (sub.warned &&
                liveSize <= sub.warnResetThreshold &&
                liveBytes <= sub.warnBytesResetThreshold) {
                sub.warned = false;
            }
            const frameThresholdReached = liveSize >= sub.warnThreshold;
            const byteThresholdReached = liveBytes >= sub.warnBytesThreshold;
            if (!sub.warned && (frameThresholdReached || byteThresholdReached)) {
                sub.warned = true;
                const threshold = frameThresholdReached && byteThresholdReached
                    ? 'frames_and_bytes'
                    : byteThresholdReached
                        ? 'bytes'
                        : 'frames';
                const warningData = {
                    queueSize: liveSize,
                    maxQueued: sub.maxQueued,
                    // `event.id` is always defined here — the just-published
                    // `event` is constructed at the top of `publish()` with
                    // `id: this.nextId++`. No `??` fallback needed.
                    lastEventId: event.id,
                    queuedBytes: liveBytes,
                    maxQueuedBytes: sub.maxQueuedBytes,
                    threshold,
                };
                logSlowClientWarning(warningData);
                const warningFrame = {
                    v: EVENT_SCHEMA_VERSION,
                    type: 'slow_client_warning',
                    data: warningData,
                };
                sub.queue.forcePush(warningFrame);
            }
        }
        return event;
    }
    /**
     * Note: registration is synchronous — by the time `subscribe()` returns,
     * the subscriber is already attached and will receive any subsequent
     * `publish()` even if the consumer hasn't started iterating yet. (A
     * generator-style implementation would defer registration to the first
     * `next()` call, which races with publishes that happen before the
     * consumer's first await.)
     *
     * The returned iterator is NOT safe to drive from concurrent callers —
     * two simultaneous `.next()` calls would race for the same event from
     * the underlying queue. Daemon usage is sequential (`for await ... of`
     * inside the SSE route), so this is safe in production. Callers that
     * fan an iterator out to multiple consumers must serialize themselves.
     */
    subscribe(opts = {}) {
        if (this.closed) {
            return emptyAsyncIterable();
        }
        // Per-bus subscriber cap: refuse rather than admit a subscriber
        // that would push us past the limit. An accepted-but-immediately-
        // evicted alternative would still pay the `BoundedAsyncQueue`
        // allocation + the per-publish iteration cost. Throw a typed
        // error so the SSE route can surface a `stream_error` frame to
        // the rejected client (rather than returning an empty iterable
        // that closes silently — that left oncall blind to "some
        // clients get events, some don't" under load).
        if (this.subs.size >= this.maxSubscribers) {
            throw new SubscriberLimitExceededError(this.maxSubscribers);
        }
        const maxQueued = opts.maxQueued ?? DEFAULT_MAX_QUEUED;
        const queue = new BoundedAsyncQueue(maxQueued, this.maxQueuedBytes);
        // `dispose` is assigned below (mutable so the closure can reference
        // `sub.dispose`); placeholder no-op covers the brief window between
        // `subs.add(sub)` and the real assignment so an absurdly fast
        // `publish() → forcePush → close → dispose()` race can't crash.
        const sub = {
            queue,
            evicted: false,
            maxQueued,
            warnThreshold: WARN_THRESHOLD_RATIO * maxQueued,
            warnResetThreshold: WARN_RESET_RATIO * maxQueued,
            maxQueuedBytes: this.maxQueuedBytes,
            warnBytesThreshold: WARN_THRESHOLD_RATIO * this.maxQueuedBytes,
            warnBytesResetThreshold: WARN_RESET_RATIO * this.maxQueuedBytes,
            warned: false,
            dispose: () => { },
        };
        this.subs.add(sub);
        if (opts.lastEventId !== undefined) {
            // Detect ring eviction on resume
            // (ring eviction detection): if the earliest event still in the ring has
            // `id > lastEventId + 1`, then events between `lastEventId + 1`
            // and `earliestInRing - 1` were evicted before the consumer
            // reconnected — the consumer's reducer has a gap it doesn't
            // know about. Pre-fix the resume silently succeeded ("you
            // caught up!") even though the SDK reducer's state was now
            // diverged from the daemon's truth.
            //
            // Emit `state_resync_required` as an id-less synthetic frame
            // (no `id` — same no-burn pattern as `client_evicted`, so it
            // doesn't occupy a slot in the per-session monotonic sequence
            // other subscribers observe). **Unlike `client_evicted`, the
            // stream stays OPEN after this frame** — the resync frame is
            // emitted FIRST (before replay), and replay + live frames
            // continue flowing afterward. The SDK reducer treats this as
            // "your state is stale; call loadSession before applying any
            // further deltas" — see `awaitingResync` flag in the SDK
            // reducer. The prior wording was corrected to note
            // that called this "TERMINAL" — that's misleading for oncall;
            // `client_evicted` is genuinely terminal (closes stream),
            // `state_resync_required` is recovery-oriented (keeps stream
            // open).
            //
            // Replay continues after the resync frame (per design): the
            // SDK reducer will auto-skip delta application until
            // loadSession clears the flag, but the frames stay on the
            // wire so SDK has the option to compute a "what you missed"
            // diff later. This is network-friendly (no extra reconnect).
            // Epoch-reset detection (epoch-reset detection).
            // `this.nextId` is the next id this bus will assign, so the bus has
            // only ever emitted ids `< nextId` THIS epoch. A consumer presenting
            // `lastEventId >= nextId` therefore saw an id this epoch never
            // produced — the only way that happens is a previous bus epoch
            // (daemon restart / EventBus rebuild resets `nextId` to 1 and clears
            // the ring). The `ring_evicted` check below is structurally blind to
            // this: after a restart the ring is empty (`earliestInRing ===
            // undefined`), so it is skipped and the consumer would otherwise get
            // a bare `replay_complete{replayedCount:0}` — a false "you're caught
            // up" while its accumulated reducer state is stale data from the dead
            // epoch. Emit `state_resync_required` (reason `epoch_reset`) first.
            const epochReset = opts.lastEventId >= this.nextId;
            if (epochReset) {
                queue.forcePush({
                    v: EVENT_SCHEMA_VERSION,
                    type: 'state_resync_required',
                    data: {
                        reason: 'epoch_reset',
                        lastDeliveredId: opts.lastEventId,
                        // Ring is typically empty right after a restart; fall back to
                        // `nextId` (the first id this epoch will assign) so the field
                        // stays meaningful ("fresh sequence starts here").
                        earliestAvailableId: this.ring[0]?.id ?? this.nextId,
                    },
                });
            }
            else {
                const earliestInRing = this.ring[0]?.id;
                if (earliestInRing === undefined &&
                    opts.lastEventId < this.nextId - 1) {
                    queue.forcePush({
                        v: EVENT_SCHEMA_VERSION,
                        type: 'state_resync_required',
                        data: {
                            reason: 'seeded_replay_not_in_ring',
                            lastDeliveredId: opts.lastEventId,
                            earliestAvailableId: this.nextId,
                        },
                    });
                }
                else if (earliestInRing !== undefined &&
                    earliestInRing > opts.lastEventId + 1) {
                    queue.forcePush({
                        v: EVENT_SCHEMA_VERSION,
                        type: 'state_resync_required',
                        data: {
                            reason: 'ring_evicted',
                            lastDeliveredId: opts.lastEventId,
                            earliestAvailableId: earliestInRing,
                        },
                    });
                }
            }
            // After an epoch reset the consumer's cursor belongs to a dead epoch,
            // so every current-epoch event is "new" to it. Filtering replay by the
            // stale `lastEventId` (e.g. 50) would drop the fresh low-id events
            // (1,2,3…) entirely. Replay the whole current ring in that case.
            const replayFrom = epochReset ? 0 : opts.lastEventId;
            // Force-push replay frames so they bypass the per-subscriber size
            // cap. The cap protects against a slow live consumer; replay is
            // already historical and silently dropping it would undermine the
            // `Last-Event-ID` resume contract (the consumer would think they
            // caught up). If the gap really is enormous, the queue will be
            // primed with a long backlog the consumer drains at its own pace.
            let replayedCount = 0;
            let lastReplayedId;
            for (const e of this.ring) {
                // The ring only ever contains live events (publish() always
                // assigns an id before pushing to ring), so `e.id` is never
                // undefined here — but the type system can't see that since
                // BridgeEvent.id is optional for synthetic terminal frames.
                // Guard explicitly to keep narrow typing without runtime cost.
                if (e.id !== undefined && e.id > replayFrom) {
                    queue.forcePush(e);
                    replayedCount += 1;
                    lastReplayedId = e.id;
                }
            }
            // Emit a `replay_complete` sentinel so consumers can deterministically
            // drop catch-up indicators. Fires both when replay actually
            // delivered frames AND when there was nothing to replay (so the
            // consumer always sees the transition from "catching up" to
            // "live"). Synthetic frame — no `id` so it doesn't burn a slot in
            // the per-session sequence (same pattern as `client_evicted` /
            // `state_resync_required`).
            //
            // Without this sentinel, a consumer attaching via Last-Event-ID
            // has no positive signal that replay drained — they have to
            // heuristically time out the spinner. The state_resync_required
            // path already has its own frame (above); the success path
            // needed parity.
            //
            // `replayedCount` is the actual number of frames force-pushed,
            // counted in the loop above — NOT `lastId - opts.lastEventId`,
            // which would over-count when the ring has holes (state_resync
            // path leaves a gap before the ring's earliest id).
            queue.forcePush({
                v: EVENT_SCHEMA_VERSION,
                type: 'replay_complete',
                data: {
                    // Note: `lastReplayedEventId`
                    // is the canonical wire name — the old `lastEventId` collided
                    // semantically with the SSE protocol's `Last-Event-ID` (envelope
                    // `id`) in raw daemon traces. Emit both: `lastReplayedEventId`
                    // for current SDKs and `lastEventId` as a deprecated alias so
                    // pre-rename consumers keep working (additive, non-breaking).
                    ...(lastReplayedId !== undefined
                        ? {
                            lastReplayedEventId: lastReplayedId,
                            lastEventId: lastReplayedId,
                        }
                        : {}),
                    replayedCount,
                },
            });
        }
        let disposed = false;
        const dispose = () => {
            if (disposed)
                return;
            disposed = true;
            this.subs.delete(sub);
            opts.signal?.removeEventListener('abort', onAbort);
        };
        sub.dispose = dispose;
        // Abort tears the subscription down immediately, even if the consumer
        // never iterates again — without this the entry would linger in
        // `this.subs` until somebody called `next()`/`return()`. Idempotent
        // through `disposed`, so a double-abort or race with `return()` is
        // safe.
        //
        // `{ drain: false }` so the consumer doesn't keep yielding
        // already-queued events after the abort — the subscribe doc says
        // abort closes the iterator "promptly". Draining first contradicts
        // that contract and adds post-abort work to the SSE route (each
        // drained event ends up serialized over a socket nobody is
        // listening to). The eviction path keeps default (drain=true) so
        // the synthetic `client_evicted` terminal frame still reaches the
        // consumer.
        const onAbort = () => {
            queue.close({ drain: false });
            dispose();
        };
        if (opts.signal) {
            if (opts.signal.aborted) {
                onAbort();
            }
            else {
                opts.signal.addEventListener('abort', onAbort, { once: true });
            }
        }
        return {
            [Symbol.asyncIterator]: () => ({
                async next() {
                    const r = await queue.next();
                    if (r.done)
                        dispose();
                    return r;
                },
                async return() {
                    queue.close();
                    dispose();
                    return { value: undefined, done: true };
                },
            }),
        };
    }
    /** Close all live subscribers and prevent further `publish`/`subscribe`. */
    close() {
        if (this.closed)
            return;
        this.closed = true;
        for (const sub of this.subs)
            sub.queue.close();
        this.subs.clear();
        this.compactionEngine?.close();
    }
}
function emptyAsyncIterable() {
    return {
        [Symbol.asyncIterator]: () => ({
            async next() {
                return { value: undefined, done: true };
            },
        }),
    };
}
class BoundedAsyncQueue {
    maxSize;
    maxBytes;
    buf = [];
    resolvers = [];
    closed = false;
    /**
     * O(1) snapshot of how many LIVE (non-forced) entries are in `buf`.
     * Maintained directly by `push()`/`next()`: any time a forced entry
     * is added or removed `liveCount` is untouched; any time a live entry
     * is added or removed `liveCount` moves with it. Replaces the
     * position-dependent `forcedInBuf` heuristic — `liveCount` is correct
     * no matter where in the queue the forced entries are.
     */
    liveCount = 0;
    liveBytes = 0;
    constructor(maxSize, maxBytes) {
        this.maxSize = maxSize;
        this.maxBytes = maxBytes;
    }
    /**
     * Number of LIVE (non-force-pushed) items currently waiting in the
     * buffer. Backpressure decisions in `EventBus.publish()` (the
     * `slow_client_warning` threshold) read this value.
     */
    get size() {
        return this.liveCount;
    }
    get bytes() {
        return this.liveBytes;
    }
    push(value, getBytes) {
        if (this.closed) {
            return {
                ok: false,
                reason: 'queue_overflow',
                liveSize: this.liveCount,
                liveBytes: this.liveBytes,
            };
        }
        const r = this.resolvers.shift();
        if (r) {
            r({ value, done: false });
            return {
                ok: true,
                liveSize: this.liveCount,
                liveBytes: this.liveBytes,
            };
        }
        // Cap is on the LIVE backlog only.
        if (this.liveCount >= this.maxSize) {
            return {
                ok: false,
                reason: 'queue_overflow',
                liveSize: this.liveCount,
                liveBytes: this.liveBytes,
            };
        }
        const bytes = getBytes();
        if (this.liveCount > 0 && this.liveBytes + bytes > this.maxBytes) {
            return {
                ok: false,
                reason: 'queue_bytes_overflow',
                liveSize: this.liveCount,
                liveBytes: this.liveBytes,
                eventBytes: bytes,
            };
        }
        this.buf.push({ value, forced: false, bytes });
        this.liveCount += 1;
        this.liveBytes += bytes;
        return {
            ok: true,
            liveSize: this.liveCount,
            liveBytes: this.liveBytes,
        };
    }
    /** Bypasses the size cap. Used for replay frames, eviction terminal,
     * and slow-client warnings. */
    forcePush(value) {
        if (this.closed)
            return;
        const r = this.resolvers.shift();
        if (r) {
            r({ value, done: false });
            return;
        }
        this.buf.push({ value, forced: true, bytes: 0 });
    }
    /**
     * Mark the queue closed. By default `next()` continues to drain
     * any items already in `buf` before returning `done: true` —
     * that's what the eviction path relies on (the synthetic
     * `client_evicted` frame is force-pushed THEN close is called,
     * and we want the consumer to see the terminal frame before the
     * iterator unwinds).
     *
     * Pass `{ drain: false }` to drop buffered items immediately
     * (the AbortSignal-driven unsubscribe path uses this — the
     * subscribe docstring says abort should close the iterator
     * promptly, but draining hundreds of queued events first
     * contradicts that and adds post-abort work to the SSE route).
     */
    close(opts = {}) {
        if (this.closed)
            return;
        this.closed = true;
        if (opts.drain === false) {
            // Truncate the buffer so subsequent `next()` calls see the
            // closed sentinel immediately.
            this.buf.length = 0;
            this.liveCount = 0;
            this.liveBytes = 0;
        }
        while (this.resolvers.length > 0) {
            this.resolvers.shift()({
                value: undefined,
                done: true,
            });
        }
    }
    next() {
        // Length check first — `buf.shift() !== undefined` would mis-handle a
        // queue whose element type legitimately includes `undefined`. The bus
        // never pushes undefined today, but the queue is generic.
        if (this.buf.length > 0) {
            const entry = this.buf.shift();
            if (!entry.forced) {
                this.liveCount -= 1;
                this.liveBytes -= entry.bytes;
            }
            return Promise.resolve({ value: entry.value, done: false });
        }
        if (this.closed) {
            return Promise.resolve({
                value: undefined,
                done: true,
            });
        }
        return new Promise((resolve) => this.resolvers.push(resolve));
    }
}
//# sourceMappingURL=eventBus.js.map