/**
 * Browser-side external URL opener for WebUI and Viewer.
 *
 * `window.open(url, '_blank', 'noopener,noreferrer')` is unreliable for
 * non-http schemes in cross-origin HTTPS contexts: Chrome opens a
 * detached tab that never hits the external-protocol dispatcher, and
 * the URL ends up rewritten relative to the current origin (e.g.
 * `https://<host>/obsidian://foo` → 404).
 *
 * An ordinary anchor click on a real `<a>` in the DOM does go through
 * the link-navigation path, which triggers the OS protocol handler
 * prompt. We keep `window.open` for http/https so the new-tab UX is
 * identical to today.
 */
export type OpenExternalUrlResult = {
    opened: true;
} | {
    opened: false;
    reason: 'dangerous';
    detail: string;
} | {
    opened: false;
    reason: 'internal-deeplink';
} | {
    opened: false;
    reason: 'malformed';
};
export declare function openExternalUrl(rawUrl: string): OpenExternalUrlResult;
