/**
 * Resources RPC Handlers
 *
 * Handles workspace resource export/import (sources, skills, automations).
 */
import type { RpcServer } from '@craft-agent/server-core/transport';
import type { HandlerDeps } from '../handler-deps';
export declare const HANDLED_CHANNELS: readonly [any, any];
export declare function registerResourcesHandlers(server: RpcServer, deps: HandlerDeps): void;
