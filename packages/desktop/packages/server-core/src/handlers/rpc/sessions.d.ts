import { type RpcServer } from '@craft-agent/server-core/transport';
import type { HandlerDeps } from '../handler-deps';
type SessionListRefreshLogger = Pick<HandlerDeps['platform']['logger'], 'warn'>;
export declare function waitForSessionListExternalRefresh(refreshPromise: Promise<void> | undefined, { log, timeoutMs, workspaceId, }: {
    log: SessionListRefreshLogger;
    timeoutMs?: number;
    workspaceId?: string;
}): Promise<void>;
/**
 * Clean up session file watcher for a client.
 * Called from main process disconnect hooks to prevent watcher leaks.
 */
export declare function cleanupSessionFileWatchForClient(clientId: string): void;
export declare const HANDLED_CHANNELS: readonly [any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any];
export declare function registerSessionsHandlers(server: RpcServer, deps: HandlerDeps): void;
export {};
