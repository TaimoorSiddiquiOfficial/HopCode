/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Parse a `Last-Event-ID` header into a bus event id for the ACP `GET /acp`
 * SSE surface.
 *
 * NOTE: the REST `GET /session/:id/events` surface still has its own copy in
 * `server/request-helpers.ts` (the two implement the same accept/reject rule).
 * Unifying them onto this util is a worthwhile cleanup but is deliberately
 * deferred: it would change the REST surface, and this PR keeps REST untouched
 * (no behavioural side effects). Tracked as a follow-up.
 *
 * Stricter than `Number.parseInt`: accept ONLY pure decimal digits (so
 * "1abc" / "1.5" don't silently parse to 1) and reject values past
 * `Number.MAX_SAFE_INTEGER` (the EventBus's monotonic ids are bounded by it).
 * Returns `undefined` for missing/invalid headers ⇒ live-only subscription.
 * Rejections are logged with the offending value for operators; the common
 * "first connect, no resume" case (missing/empty header) is silent.
 *
 * @param logPrefix distinguishes the surface in logs, e.g. `'/acp '` vs `''`.
 */
export declare function parseLastEventId(raw: unknown, logPrefix?: string): number | undefined;
