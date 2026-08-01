import type { RpcServer } from '@craft-agent/server-core/transport';
import type { HandlerDeps } from '../handler-deps';
export { registerSessionsHandlers, cleanupSessionFileWatchForClient } from './sessions';
import type { ServerHandlerContext } from '../../bootstrap/headless-start';
export type { ServerHandlerContext } from '../../bootstrap/headless-start';
export { getHealthCheck } from './server';
export declare function registerCoreRpcHandlers(server: RpcServer, deps: HandlerDeps, serverCtx?: ServerHandlerContext): void;
