import { type RpcServer } from '@craft-agent/server-core/transport';
import type { HandlerDeps } from '../handler-deps';
export declare const HANDLED_CHANNELS: readonly [any, any, any, any];
/**
 * Complete an OAuth flow: validate state, exchange code for tokens, store credentials.
 *
 * Shared between the `oauth:complete` RPC handler (called by Electron) and the
 * `/api/oauth/callback` HTTP route (called by the relay for WebUI).
 *
 * @param opts.clientId - RPC client ID (for ownership validation). Omit for HTTP callback.
 * @param opts.workspaceId - Workspace ID (for ownership validation). Omit for HTTP callback.
 */
export declare function completeOAuthFlow(opts: {
    code: string;
    state: string;
    flowStore: {
        getByState(state: string): any;
        remove(state: string): void;
    };
    credManager: {
        exchangeAndStore(...args: any[]): Promise<any>;
    };
    sessionManager: {
        completeAuthRequest(...args: any[]): Promise<void>;
    };
    pushSourcesChanged: (workspaceId: string) => void;
    logger: {
        info(msg: string): void;
    };
    clientId?: string;
    workspaceId?: string | null;
}): Promise<{
    success: boolean;
    error?: string;
    email?: string;
}>;
export declare function registerOAuthHandlers(server: RpcServer, deps: HandlerDeps): void;
