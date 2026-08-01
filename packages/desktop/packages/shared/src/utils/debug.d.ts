/**
 * Enable debug logging. Call this when --debug flag is passed.
 */
export declare function enableDebug(): void;
/**
 * Check if debug mode is enabled.
 */
export declare function isDebugEnabled(): boolean;
/**
 * Debug logging utility that auto-routes based on environment.
 * Only logs when debug mode is enabled via --debug flag.
 *
 * Output routing:
 * - Electron main: console + file
 * - Electron renderer: console (DevTools)
 * - CLI/scripts: console only
 *
 * @example
 * debug('Processing request')
 * debug('User data', { id: 123 })
 */
export declare function debug(message: string, ...args: unknown[]): void;
/**
 * Create a scoped logger for a specific module.
 * Scope appears in brackets: [scope] message
 *
 * @example
 * const log = createLogger('agent');
 * log.debug('Starting session');
 * log.info('Connected to MCP');
 * log.error('Failed to connect', error);
 */
export declare function createLogger(scope: string): {
    debug: (message: string, ...args: unknown[]) => void;
    info: (message: string, ...args: unknown[]) => void;
    warn: (message: string, ...args: unknown[]) => void;
    error: (message: string, ...args: unknown[]) => void;
};
