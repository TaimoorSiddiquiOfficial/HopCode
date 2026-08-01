/**
 * Classification of external URLs for `shell.openExternal`-style handlers.
 *
 * We use a blocklist instead of an allowlist: the OS only dispatches URL
 * schemes that have a registered handler, so passing through
 * `obsidian://`, `vscode://`, etc. is safe in practice. Known-dangerous
 * schemes (XSS primitives and `file:` as an RCE vector on Windows) stay
 * explicitly blocked.
 */
export type UrlClassification = {
    kind: 'dangerous';
    reason: string;
} | {
    kind: 'internal-deeplink';
} | {
    kind: 'safe-external';
};
export declare function classifyExternalUrl(rawUrl: string): UrlClassification;
export declare function isSafeExternalUrl(rawUrl: string): boolean;
