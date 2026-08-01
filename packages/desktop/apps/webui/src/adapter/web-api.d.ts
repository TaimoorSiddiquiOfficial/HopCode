/**
 * Web API adapter — browser-compatible ElectronAPI implementation.
 *
 * Reuses the same WsRpcClient + buildClientApi() + CHANNEL_MAP from the Electron app.
 * Overrides LOCAL_ONLY methods (window management, native dialogs, etc.) with web equivalents.
 *
 * Auth: the browser's session cookie (set by /api/auth) is automatically sent
 * on the WebSocket upgrade request — no bearer token needed.
 */
import { WsRpcClient } from '../../../electron/src/transport/client';
import type { ElectronAPI } from '../../../electron/src/shared/types';
export interface WebApiOptions {
    /** WebSocket server URL (ws:// or wss://) */
    serverUrl: string;
    /** Workspace ID to connect as. */
    workspaceId?: string;
}
export declare function createWebApi(options: WebApiOptions): {
    api: ElectronAPI;
    client: WsRpcClient;
};
