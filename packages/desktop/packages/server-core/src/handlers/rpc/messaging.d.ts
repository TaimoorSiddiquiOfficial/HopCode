/**
 * Messaging RPC handlers — UI ↔ Server communication for messaging config and bindings.
 */
import type { RpcServer } from '../../transport/types';
import type { HandlerDeps } from '../handler-deps';
export declare function registerMessagingHandlers(server: RpcServer, deps: HandlerDeps): void;
