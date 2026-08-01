/**
 * Chunked Transfer RPC Handlers
 *
 * Enables large-payload RPC calls (e.g. sessions:import, resources:import)
 * to be split across multiple small WebSocket messages. This works behind
 * proxies and tunnels (Cloudflare, nginx) that have message-size limits.
 *
 * Protocol:
 *   1. transfer:start  → allocate temp dir, return transferId
 *   2. transfer:chunk  → write one chunk to temp file (repeat N times)
 *   3. transfer:commit → reassemble, execute deferred RPC, clean up
 *   4. transfer:abort  → best-effort cleanup after client-side failure/cancel
 */
import type { HandlerFn, RpcServer } from '../../transport/types';
export declare function setTransferableHandler(channel: string, handler: HandlerFn): void;
export declare function __resetTransferStateForTests(): void;
export declare function registerTransferHandlers(server: RpcServer): void;
