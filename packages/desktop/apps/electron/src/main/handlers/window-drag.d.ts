import type { RpcServer } from '@craft-agent/server-core/transport';
import type { HandlerDeps } from './handler-deps';
export declare const GUI_HANDLED_CHANNELS: readonly [any, any, any];
export declare function registerWindowDragGuiHandlers(server: RpcServer, deps: HandlerDeps): void;
