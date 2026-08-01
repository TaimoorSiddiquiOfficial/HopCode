/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type { Application, Request } from 'express';
export { resolveWebShellDir } from './web-shell-resolver.js';
/**
 * Build the Web Shell CSP. `frame-ancestors` defaults to `'none'` (the caller
 * also sets `X-Frame-Options: DENY`) to block clickjacking. When the daemon is
 * started with `--allow-origin chrome-extension://<id>`, those extension
 * origins are allowed to frame the shell so the extension can host the UI in a
 * Chrome side panel (issue #5626); X-Frame-Options is dropped in that case
 * since it can't express an allowlist.
 */
export declare function buildWebShellCsp(frameAncestors?: readonly string[]): string;
/** Default (no-framing) Web Shell CSP. */
export declare const WEB_SHELL_CSP: string;
/**
 * True when the request is a top-level document navigation (address-bar
 * load, link click, or refresh) rather than a programmatic fetch/XHR.
 *
 * Mirrors the `bypass` discriminator in `packages/web-shell/vite.config.ts`
 * so the daemon's SPA fallback claims exactly the requests the dev proxy
 * would have served `index.html` for — and leaves API fetches (which carry
 * `Accept: application/json`) to fall through to the JSON routes / 404.
 */
export declare function isDocumentNavigation(req: Request): boolean;
/**
 * Mount the Web Shell static assets BEFORE `bearerAuth`. The shell carries no
 * secrets and a browser cannot attach an `Authorization` header to a
 * `<script src>` subresource or an address-bar navigation, so gating these
 * would just break the UI. The front-end's own API calls still carry the
 * bearer via `getDaemonAuthHeaders()`.
 *
 *  - `GET /assets/*` — hashed, immutable build chunks (long-cache).
 *  - `GET /` — the HTML shell, always (so `curl /` shows the UI too).
 *
 * Caller must have already verified `webShellDir` exists.
 */
export declare function mountWebShellAssets(app: Application, webShellDir: string, frameAncestors?: readonly string[]): void;
/**
 * Mount the SPA deep-link fallback (for navigations like `/session/<id>`).
 * Registered AFTER all API routes — just before the error handler — so real
 * routes, INCLUDING their `bearerAuth` 401s, always win and only genuine 404
 * misses fall through to the shell.
 *
 * This is what keeps a token-gated daemon honest: a navigation with an
 * attacker-controlled `Accept: text/html` to an authed route (e.g.
 * `/capabilities`, `/health` on a non-loopback bind) hits that route's real
 * response / 401, not this shell. Because real routes run first, no per-path
 * denylist is needed.
 *
 * Only GET/HEAD document navigations are claimed; API fetches send
 * `Accept: application/json`, fail `isDocumentNavigation`, and fall through to
 * the standard JSON 404.
 */
export declare function mountWebShellSpaFallback(app: Application, webShellDir: string, frameAncestors?: readonly string[]): void;
