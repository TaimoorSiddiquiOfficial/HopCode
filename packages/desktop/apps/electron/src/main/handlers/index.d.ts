import type { HandlerDeps } from './handler-deps';
import type { RpcServer } from '@craft-agent/server-core/transport';
import { registerCoreRpcHandlers, type ServerHandlerContext } from '@craft-agent/server-core/handlers/rpc';
export { registerCoreRpcHandlers };
export declare function registerGuiRpcHandlers(server: RpcServer, deps: HandlerDeps): void;
export declare function registerAllRpcHandlers(server: RpcServer, deps: HandlerDeps, serverCtx?: ServerHandlerContext): void;
