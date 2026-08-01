/**
 * PairingCodeManager — issues and validates one-time pairing codes.
 *
 * Codes are 6-digit, 5-minute TTL, in-memory only (never persisted).
 * Rate-limited per workspace (default: 10 codes/minute) to prevent brute-force
 * enumeration if a bot token ever leaks.
 *
 * Consumption is atomic: consume() returns the entry exactly once, then deletes
 * it. A wrong code does not count against the issuing rate limit (consume is
 * called by incoming chat messages which are their own side-channel).
 */
import type { PlatformType } from './types';
export interface PairingEntry {
    workspaceId: string;
    sessionId: string;
    platform: PlatformType;
    code: string;
    expiresAt: number;
}
export interface GeneratedPairing {
    code: string;
    expiresAt: number;
}
export declare const PAIRING_TTL_MS: number;
export declare const PAIRING_RATE_LIMIT_PER_MINUTE = 10;
/**
 * Per-sender ceiling on `/pair` attempts. With a 6-digit decimal code and a
 * 5-minute TTL, a brute-force needs on the order of 500k attempts per target
 * code. 5/minute × 5 minutes = 25 tries across the TTL — a ~25/1,000,000
 * upper bound. That's defence-in-depth; the real guarantee is the short TTL.
 */
export declare const PAIR_CONSUME_RATE_PER_MINUTE = 5;
export declare class PairingCodeManager {
    private readonly ttlMs;
    private readonly ratePerMinute;
    private readonly consumeRatePerMinute;
    /** Key: `${platform}:${code}` */
    private readonly entries;
    /** Key: workspaceId */
    private readonly buckets;
    /** Key: `${workspaceId}:${platform}:${senderId}` — counts attempts, right or wrong. */
    private readonly consumeBuckets;
    constructor(ttlMs?: number, ratePerMinute?: number, consumeRatePerMinute?: number);
    /**
     * Issue a new pairing code.
     * @throws Error with code 'RATE_LIMIT' when the workspace exceeds the per-minute cap.
     */
    generate(workspaceId: string, sessionId: string, platform: PlatformType): GeneratedPairing;
    /**
     * Consume a code. Returns the entry once then deletes it.
     * Returns null if unknown, expired, or workspace does not match.
     */
    consume(workspaceId: string, platform: PlatformType, code: string): PairingEntry | null;
    /** Invalidate all codes for a workspace. Used on platform disconnect. */
    clearWorkspace(workspaceId: string): void;
    /**
     * Per-sender throttle for `/pair` attempts. Counts on entry, NOT after
     * validation — otherwise wrong guesses cost nothing and the throttle is
     * decorative. Sender identity is always scoped with workspaceId+platform
     * so a leaked senderId can't bleed across workspaces.
     *
     * Returns `true` if the caller may attempt another consume, `false` if
     * they've hit the per-minute cap.
     */
    canConsume(workspaceId: string, platform: PlatformType, senderId: string): boolean;
    private key;
    private randomCode;
    private checkRate;
    /** Purge expired entries. O(n) but n is tiny (per-workspace, 5-min window). */
    private gc;
}
