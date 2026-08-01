/**
 * Node HTTP ↔ Web Standard adapter.
 *
 * Bridges Node.js `(IncomingMessage, ServerResponse)` callbacks to
 * the web-standard `(Request) => Response` handler used by the WebUI.
 * This lets us serve the WebUI from the same HTTPS server that the
 * WsRpcServer creates for WebSocket connections.
 */
import type { IncomingMessage, ServerResponse } from 'node:http';
type WebHandler = (req: Request) => Promise<Response> | Response;
/**
 * Wrap a web-standard fetch handler as a Node HTTP request listener.
 * WebSocket upgrade requests are NOT routed through this adapter —
 * the `ws` library intercepts them at the 'upgrade' event level.
 */
export declare function nodeHttpAdapter(handler: WebHandler): (req: IncomingMessage, res: ServerResponse) => void;
export {};
