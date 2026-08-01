/**
 * Chunked RPC — send large payloads over WebSocket in small pieces.
 *
 * Splits a single large RPC argument into base64 chunks (~2.7MB each),
 * sends them via the transfer:start/chunk/commit protocol, and the
 * remote server reassembles and executes the original RPC handler.
 *
 * Each chunk is retried up to 3 times on failure to handle transient
 * connection issues through proxies/tunnels.
 */
import type { WsRpcClient } from '../transport/client';
/**
 * 2MB raw → ~2.7MB after base64 encoding.
 * Larger chunks = fewer round trips (a 250MB payload = ~125 chunks instead of 651).
 * Still well under common per-message proxy limits.
 */
export declare const CHUNK_SIZE: number;
/** Threshold above which we switch from direct RPC to chunked transfer. */
export declare const CHUNKED_TRANSFER_THRESHOLD: number;
export interface PreparedChunkedPayload {
    bytes: Buffer;
    checksum: string;
    chunkCount: number;
}
export declare function getChunkCount(totalBytes: number): number;
export declare function prepareChunkedPayload(value: unknown): PreparedChunkedPayload;
/**
 * Send a large RPC call in chunks over the existing WebSocket connection.
 *
 * @param client         Connected WsRpcClient to the remote server
 * @param channel        The original RPC channel (e.g. 'sessions:import')
 * @param args           The original arguments array
 * @param largeArgIndex  Which argument is the large payload (will be chunked)
 * @param onProgress     Optional callback with (sentChunks, totalChunks) for UI progress
 * @param prepared       Optional pre-serialized payload so callers can inspect size without re-serializing
 * @returns              The result from the remote handler (same as a direct invoke)
 */
export declare function invokeChunked(client: WsRpcClient, channel: string, args: any[], largeArgIndex: number, onProgress?: (sent: number, total: number) => void, prepared?: PreparedChunkedPayload): Promise<any>;
