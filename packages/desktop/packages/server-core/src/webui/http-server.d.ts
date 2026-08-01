/**
 * Web UI HTTP handler and standalone server.
 *
 * The core logic lives in `createWebuiHandler()` which returns a web-standard
 * fetch handler `(Request) => Promise<Response>`. This handler can be:
 *
 * 1. **Embedded** — attached to the WsRpcServer's HTTPS server via the
 *    node-adapter so that HTTP and WSS share a single port.
 * 2. **Standalone** — wrapped in `Bun.serve()` via `startWebuiHttpServer()`
 *    for separate-port deployments or development.
 */
import type { PlatformServices } from '../runtime/platform';
export declare function shouldUseSecureCookies(req: Request, secureCookies?: boolean): boolean;
export interface ResolveWebSocketUrlOptions {
    publicWsUrl?: string;
    wsProtocol: 'ws' | 'wss';
    wsPort: number;
}
export declare function resolveWebSocketUrl(req: Request, { publicWsUrl, wsProtocol, wsPort }: ResolveWebSocketUrlOptions): string;
/** Dependencies for the /api/oauth/callback HTTP route (server-side OAuth completion). */
export interface OAuthCallbackDeps {
    flowStore: {
        getByState: (state: string) => any;
        remove: (state: string) => void;
    };
    credManager: {
        exchangeAndStore: (...args: any[]) => Promise<any>;
    };
    sessionManager: {
        completeAuthRequest: (...args: any[]) => Promise<void>;
    };
    pushSourcesChanged: (workspaceId: string) => void;
}
export interface WebuiHandlerOptions {
    /** Path to built web UI dist/ directory. */
    webuiDir: string;
    /** Secret used to sign JWTs — typically CRAFT_SERVER_TOKEN. */
    secret: string;
    /** Optional separate web UI password. Falls back to `secret` for verification. */
    password?: string;
    /** Explicit Secure-cookie override. When unset, infer from the request / proxy headers. */
    secureCookies?: boolean;
    /** Optional browser-facing WebSocket URL override for reverse-proxy deployments. */
    publicWsUrl?: string;
    /** RPC WebSocket protocol used when building a browser-facing fallback URL. */
    wsProtocol: 'ws' | 'wss';
    /** RPC WebSocket port used when building a browser-facing fallback URL. */
    wsPort: number;
    /** Health check function (injected from existing server handler). */
    getHealthCheck: () => {
        status: string;
    };
    /** Logger. */
    logger: PlatformServices['logger'];
    /** OAuth callback deps — when provided, enables /api/oauth/callback route. */
    oauthCallbackDeps?: OAuthCallbackDeps;
    /**
     * Trusted proxy IPs/CIDRs. When set, proxy headers (x-forwarded-for, x-forwarded-proto)
     * are only trusted from these sources. When empty/unset, proxy headers are ignored
     * and 'direct' is used as the rate-limit key.
     */
    trustedProxies?: string[];
}
export interface WebuiHandler {
    /** Web-standard fetch handler. */
    fetch: (req: Request) => Promise<Response>;
    /** Call on shutdown to release timers. */
    dispose: () => void;
    /** Inject OAuth callback deps after bootstrap (lazy wiring). */
    setOAuthCallbackDeps: (deps: OAuthCallbackDeps) => void;
}
/**
 * Create a web-standard fetch handler for the WebUI.
 *
 * This handler can be used directly with `Bun.serve({ fetch })`,
 * or adapted for Node's HTTP server via `nodeHttpAdapter()`.
 */
export declare function createWebuiHandler(options: WebuiHandlerOptions): WebuiHandler;
export interface WebuiHttpServerOptions extends WebuiHandlerOptions {
    /** Port to bind on. Use 0 for an ephemeral port in tests. */
    port: number;
}
export declare function startWebuiHttpServer(options: WebuiHttpServerOptions): Promise<{
    port: number;
    stop: () => void;
}>;
