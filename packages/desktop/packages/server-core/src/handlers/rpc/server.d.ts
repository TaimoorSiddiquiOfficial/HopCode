import type { ServerHealth } from '@craft-agent/core/types';
import type { RpcServer } from '@craft-agent/server-core/transport';
import type { HandlerDeps } from '../handler-deps';
import type { ServerHandlerContext } from '../../bootstrap/headless-start';
export declare const HANDLED_CHANNELS: readonly [any, any, any, any, any, any];
export declare function registerServerHandlers(server: RpcServer, deps: HandlerDeps, ctx: ServerHandlerContext): void;
export declare function getHealthCheck(deps: Pick<HandlerDeps, 'sessionManager'>): ServerHealth;
