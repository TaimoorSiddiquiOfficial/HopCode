/**
 * Network proxy manager — configures both Node.js (undici) and Electron session proxies.
 *
 * - Node side: replaces the global undici dispatcher with a ProtocolProxyDispatcher
 *   that routes HTTP/HTTPS through different ProxyAgent instances and respects NO_PROXY.
 * - Electron side: calls session.setProxy() on default + browser-pane sessions.
 */
import type { NetworkProxySettings } from '@craft-agent/shared/config/types';
/**
 * Read persisted proxy settings and apply to both Node and Electron.
 * Safe to call before app.whenReady() — Electron session setup is skipped until ready.
 */
export declare function applyConfiguredProxySettings(): Promise<void>;
/**
 * Persist new proxy settings and apply immediately.
 */
export declare function updateConfiguredProxySettings(settings: NetworkProxySettings): Promise<void>;
