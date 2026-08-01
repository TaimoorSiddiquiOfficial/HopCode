/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type { CommandModule } from 'yargs';
/**
 * Open the Web Shell in a browser once the daemon is listening. Extracted from
 * the `serve` handler so it is unit-testable. Best-effort:
 *  - gated on `--open`, the UI actually being mounted (`webShellMounted`), and
 *    `shouldLaunchBrowser()` (false in CI / SSH / headless);
 *  - wildcard bind hosts (`0.0.0.0` / `[::]`) are rewritten to loopback so the
 *    URL is client-addressable;
 *  - the token rides in the URL fragment (`#token=`), which is never sent to
 *    the server, and the daemon's already-resolved (trimmed) token is used so
 *    it matches what the server authenticates against;
 *  - any launch failure is logged, never thrown, so it can't take down the
 *    already-listening daemon.
 *
 * Exported for tests.
 */
export declare function maybeOpenWebShellBrowser(handle: {
    url: string;
    webShellMounted: boolean;
    resolvedToken?: string;
    runtimeReady?: Promise<void>;
}, open: boolean): Promise<void>;
interface ServeArgs {
    port: number;
    hostname: string;
    token?: string;
    'max-sessions': number;
    'max-total-sessions'?: number;
    'max-pending-prompts-per-session': number;
    'max-connections': number;
    'event-ring-size': number;
    'compacted-replay-max-bytes': number;
    workspace?: string | string[];
    'require-auth': boolean;
    'enable-session-shell': boolean;
    'tls-cert'?: string;
    'tls-key'?: string;
    web: boolean;
    open: boolean;
    'http-bridge': boolean;
    'mcp-client-budget'?: number;
    'mcp-budget-mode'?: 'enforce' | 'warn' | 'off';
    'allow-origin'?: string[];
    'allow-private-auth-base-url': boolean;
    'prompt-deadline-ms'?: number;
    'writer-idle-timeout-ms'?: number;
    'channel-idle-timeout-ms'?: number;
    'session-reap-interval-ms'?: number;
    'session-idle-timeout-ms'?: number;
    'permission-response-timeout-ms'?: number;
    'rate-limit'?: boolean;
    'rate-limit-prompt'?: number;
    'rate-limit-mutation'?: number;
    'rate-limit-read'?: number;
    'rate-limit-window-ms'?: number;
    experimentalLsp?: boolean;
    channel?: string[];
}
export declare const serveCommand: CommandModule<unknown, ServeArgs>;
export {};
