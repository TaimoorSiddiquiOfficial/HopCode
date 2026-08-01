/**
 * Network proxy utility functions (pure — no Electron deps).
 *
 * Parses NO_PROXY rules and determines whether a given URL should bypass the proxy.
 */
/** Split a comma-separated string into trimmed, non-empty entries. */
export declare function splitCommaSeparated(str: string | undefined): string[];
export interface NoProxyRule {
    /** Exact hostname or domain suffix (without leading dot). */
    host: string;
    /** Optional port restriction. */
    port?: number;
    /** If true, matches any hostname (wildcard `*`). */
    wildcard: boolean;
}
/**
 * Parse a comma-separated NO_PROXY string into structured rules.
 *
 * Supported formats per entry:
 *   - `*`                 → wildcard, bypass everything
 *   - `example.com`       → exact host match
 *   - `.example.com`      → suffix match (subdomain)
 *   - `example.com:8080`  → host + port
 *   - `192.168.1.1`       → exact IP literal
 */
export declare function parseNoProxyRules(noProxy: string | undefined): NoProxyRule[];
export declare function shouldBypassProxy(url: string | URL, rules: NoProxyRule[]): boolean;
