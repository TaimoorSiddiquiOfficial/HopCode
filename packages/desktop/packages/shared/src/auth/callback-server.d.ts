import { type AppType } from './callback-page.ts';
export { generateCallbackPage, type AppType } from './callback-page.ts';
export interface CallbackPayload {
    query: Record<string, string>;
}
export interface CallbackServer {
    promise: Promise<CallbackPayload>;
    url: string;
    /** Close the callback server. Call this on component unmount to clean up. */
    close: () => void | Promise<void>;
}
export interface CreateCallbackServerOptions {
    appType?: AppType;
    /** Deep link URL to redirect to after successful auth (e.g., craftagents://auth-complete) */
    deeplinkUrl?: string;
    /** Fixed port to bind to. If set, only that port is tried (no range scanning). */
    port?: number;
    /** URL paths to accept as callbacks. Default: ['/callback', '/oauth/callback']. */
    callbackPaths?: string[];
}
/**
 * Creates an OAuth callback server by binding directly to a port in the range
 * START_PORT .. START_PORT + MAX_PORT_ATTEMPTS - 1.
 *
 * Unlike a check-then-bind approach, this eliminates the TOCTOU race condition
 * by attempting to bind the real server on each candidate port. If the port is
 * already in use (EADDRINUSE), the server is closed and the next port is tried.
 */
export declare function createCallbackServer(options?: CreateCallbackServerOptions): Promise<CallbackServer>;
