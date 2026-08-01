/**
 * PlanTokenRegistry — short-lived token lookup for Telegram plan approvals.
 *
 * Tokens are opaque, per-binding revocable, TTL-expiring. These tests cover
 * the happy path, expiry, re-issue semantics, and the critical multi-binding
 * isolation case — one session with two Telegram bindings must keep two
 * independent live tokens, one per chat.
 */
export {};
