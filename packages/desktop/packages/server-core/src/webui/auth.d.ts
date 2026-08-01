/**
 * Web UI session authentication.
 *
 * Cookie-based JWT session auth for the browser-served web UI.
 * - Login: verify password → issue signed JWT → set HttpOnly cookie
 * - Validation: check cookie on every HTTP request + WebSocket upgrade
 * - Rate limiting: per-IP brute-force protection on /api/auth
 */
export interface JwtPayload {
    sub: string;
    iat: number;
    exp: number;
}
export declare function signJwt(payload: JwtPayload, secret: string): Promise<string>;
export declare function verifyJwt(token: string, secret: string): Promise<JwtPayload | null>;
export declare function createSessionToken(secret: string): Promise<string>;
export declare function buildSessionCookie(jwt: string, secure: boolean): string;
export declare function buildLogoutCookie(secure?: boolean): string;
export declare function extractSessionCookie(cookieHeader: string | null): string | null;
/**
 * Hash the login password at startup. Must be called before any auth requests.
 * The hash is stored in memory — the raw password is not retained.
 */
export declare function initPasswordHash(plaintext: string): Promise<void>;
/**
 * Verify a user-supplied password against the pre-hashed password.
 * Uses Bun's built-in argon2id verification (constant-time).
 */
export declare function verifyPassword(input: string): Promise<boolean>;
export declare class RateLimiter {
    private entries;
    private readonly maxAttempts;
    private readonly windowMs;
    /** Global counter — blocks all IPs after too many total failures (defeats IP spoofing). */
    private readonly maxGlobalAttempts;
    private globalAttempts;
    private globalWindowStart;
    constructor(maxAttempts?: number, windowMs?: number, maxGlobalAttempts?: number);
    /** Returns true if the request should be allowed, false if rate-limited. */
    check(ip: string): boolean;
    /** Periodic cleanup of stale entries (call on a timer). */
    cleanup(): void;
}
export declare function validateSession(cookieHeader: string | null, secret: string): Promise<JwtPayload | null>;
