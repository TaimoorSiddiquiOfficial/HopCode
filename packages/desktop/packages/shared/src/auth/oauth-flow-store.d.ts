/**
 * OAuthFlowStore — in-memory store for pending OAuth flows.
 *
 * Lives server-side. Never serialized, never sent to clients.
 * Keyed by `state` (CSRF token) for O(1) lookup on oauth:complete.
 * 5-minute TTL with lazy + periodic cleanup.
 */
import type { LoadedSource } from '../sources/types.ts';
import type { OAuthProvider } from './oauth-flow-types.ts';
export interface PendingOAuthFlow {
    flowId: string;
    state: string;
    codeVerifier: string;
    redirectUri: string;
    source: LoadedSource;
    clientId: string;
    clientSecret?: string;
    tokenEndpoint: string;
    provider: OAuthProvider;
    ownerClientId: string;
    workspaceId: string;
    sourceSlug: string;
    sessionId?: string;
    authRequestId?: string;
    createdAt: number;
    expiresAt: number;
}
export declare class OAuthFlowStore {
    private flows;
    private cleanupTimer;
    constructor();
    store(flow: PendingOAuthFlow): void;
    getByState(state: string): PendingOAuthFlow | null;
    remove(state: string): void;
    /** Prune expired entries. Called on interval + lazily on access. */
    cleanup(): void;
    /** Stop the periodic cleanup timer (for graceful shutdown). */
    dispose(): void;
    /** Number of pending flows (for diagnostics). */
    get size(): number;
}
/**
 * Create a PendingOAuthFlow with default TTL.
 * Convenience helper used by the oauth:start handler.
 */
export declare function createPendingFlow(params: Omit<PendingOAuthFlow, 'createdAt' | 'expiresAt'>): PendingOAuthFlow;
