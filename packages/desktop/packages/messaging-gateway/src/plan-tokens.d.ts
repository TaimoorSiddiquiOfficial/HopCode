/**
 * PlanTokenRegistry — short-lived opaque tokens for plan approval buttons.
 *
 * Telegram's `callback_data` is capped at 64 bytes, which is too small to
 * round-trip an absolute plan path. We issue an 8-char random token per
 * plan submission, hand it out inside button IDs like `plan:accept:<token>`,
 * and look up the real `{bindingId, sessionId, planPath}` when the callback
 * fires.
 *
 * Tokens expire after `ttlMs` (default 30 min) — stale buttons resolve to
 * `null` and the gateway replies "plan expired, retry from the desktop app."
 *
 * Revocation is keyed by `bindingId`, not `sessionId`. A session with two
 * Telegram bindings gets two *independent* live tokens — one per chat —
 * and issuing a new plan on one binding only invalidates that binding's
 * previous token. The old session-scoped revocation silently invalidated
 * every other binding's buttons the moment any binding rendered a new plan.
 */
export interface PlanTokenEntry {
    bindingId: string;
    sessionId: string;
    planPath: string;
    messageId?: string;
    createdAt: number;
}
export declare class PlanTokenRegistry {
    private readonly tokens;
    private readonly ttlMs;
    constructor(ttlMs?: number);
    issue(bindingId: string, sessionId: string, planPath: string, messageId?: string): string;
    resolve(token: string): PlanTokenEntry | null;
    revoke(token: string): void;
    revokeForBinding(bindingId: string): void;
    size(): number;
}
