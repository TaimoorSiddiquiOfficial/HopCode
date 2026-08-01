/**
 * Resolve and apply proxy settings for channel service processes.
 *
 * The normal CLI path applies proxy via loadCliConfig -> Config constructor ->
 * setGlobalDispatcher, but channel runtimes do not call loadCliConfig. This
 * mirrors that resolution logic and also returns the resolved URL so channel
 * adapters can configure non-fetch HTTP clients.
 */
export declare function resolveProxy(cliProxy?: string, settingsProxy?: string): string | undefined;
export declare function resolveProxyUrl(cliProxy?: string, settingsProxy?: string): string | undefined;
