/**
 * Convert stored proxy settings into environment variables for subprocesses.
 * Returns an empty object when proxy is disabled or not configured.
 */
export declare function getProxyEnvVars(): Record<string, string>;
