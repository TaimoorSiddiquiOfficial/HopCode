/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 *
 * CDP browser-level emulation layer for the Plan C "CDP tunnel" (issue #5626).
 *
 * A CDP client connects to the daemon's `/cdp`
 * WebSocket expecting a browser-level CDP endpoint, but behind the tunnel is a
 * single real tab driven via `chrome.debugger` (page-level only). This class
 * synthesizes the missing browser-level topology so puppeteer connects and gets
 * one page:
 *
 *   - a two-level `tab` -> `page` target tree, and
 *   - the recursive `Target.setAutoAttach` handshake puppeteer's
 *     `ExtensionTransport` relies on.
 *
 * Browser-domain commands are answered locally; page-domain commands (tagged
 * with the page session id) are forwarded to the real tab via
 * {@link CdpEmulatorCallbacks.forwardToTab}, and tab events are re-tagged with
 * the page session id on the way back via {@link CdpBrowserEmulator.emitTabEvent}.
 *
 * See `packages/chrome-extension/docs/06-plan-c-cdp-tunnel.md`.
 */
/** Stable synthetic ids for the single tab/page this tunnel exposes. */
const TAB_TARGET_ID = 'qwen-cdp-tab';
const PAGE_TARGET_ID = 'qwen-cdp-page';
const TAB_SESSION_ID = 'qwen-cdp-tab-session';
const PAGE_SESSION_ID = 'qwen-cdp-page-session';
// Must match CDP_PROTOCOL_VERSION in packages/chrome-extension/src/background/cdp-bridge.ts.
const CDP_PROTOCOL_VERSION = '1.3';
/** CDP error code for "command failed" (matches Chrome's generic server error). */
const SERVER_ERROR = -32000;
export class CdpBrowserEmulator {
    cb;
    tab;
    pageSessionId = PAGE_SESSION_ID;
    constructor(cb, tab = {}) {
        this.cb = cb;
        this.tab = tab;
    }
    /**
     * Refresh the synthetic tab/page targetInfo (url/title) once the extension
     * acks `cdp_attach`, so puppeteer's `page.url()`/`page.title()` reflect the
     * real page rather than the `about:blank` placeholder used before attach.
     */
    setTabInfo(info) {
        this.tab = { ...this.tab, ...info };
    }
    tabTargetInfo() {
        return {
            targetId: TAB_TARGET_ID,
            type: 'tab',
            title: this.tab.title ?? 'tab',
            url: this.tab.url ?? 'about:blank',
            attached: false,
            canAccessOpener: false,
        };
    }
    pageTargetInfo() {
        return {
            targetId: PAGE_TARGET_ID,
            type: 'page',
            title: this.tab.title ?? 'page',
            url: this.tab.url ?? 'about:blank',
            attached: false,
            canAccessOpener: false,
        };
    }
    /**
     * Handle one frame from the puppeteer client. Browser/tab-domain frames are
     * answered locally; page-session frames are forwarded to the real tab.
     */
    async handleFromClient(frame) {
        const { id, method, params, sessionId } = frame;
        // ── browser-level (no sessionId): synthesize the browser topology ──
        if (!sessionId) {
            switch (method) {
                case 'Browser.getVersion':
                    return this.cb.reply({
                        id,
                        result: {
                            protocolVersion: CDP_PROTOCOL_VERSION,
                            product: 'QwenCDPTunnel/1.0',
                            revision: '@qwen',
                            userAgent: 'QwenCDPTunnel',
                            jsVersion: 'unknown',
                        },
                    });
                case 'Target.getBrowserContexts':
                    return this.cb.reply({ id, result: { browserContextIds: [] } });
                case 'Target.setDiscoverTargets':
                    this.cb.reply({
                        method: 'Target.targetCreated',
                        params: { targetInfo: this.tabTargetInfo() },
                    });
                    this.cb.reply({
                        method: 'Target.targetCreated',
                        params: { targetInfo: this.pageTargetInfo() },
                    });
                    return this.cb.reply({ id, result: {} });
                case 'Target.setAutoAttach':
                    // browser level attaches the tab session (the page session is
                    // attached on the recursive setAutoAttach against the tab session).
                    this.cb.reply({
                        method: 'Target.attachedToTarget',
                        params: {
                            targetInfo: this.tabTargetInfo(),
                            sessionId: TAB_SESSION_ID,
                            waitingForDebugger: false,
                        },
                    });
                    return this.cb.reply({ id, result: {} });
                case 'Target.getTargets':
                    return this.cb.reply({
                        id,
                        result: {
                            targetInfos: [this.tabTargetInfo(), this.pageTargetInfo()],
                        },
                    });
                case 'Target.getTargetInfo':
                    return this.cb.reply({
                        id,
                        result: { targetInfo: this.pageTargetInfo() },
                    });
                default:
                    // TODO(#5626): return SERVER_ERROR once the emulator covers every
                    // browser-level command a CDP client sends. Until then the
                    // empty-result ack keeps puppeteer from hanging on optional commands;
                    // surface the unknown ones so the coverage gap stays visible.
                    this.cb.log?.(`qwen serve: /cdp unsupported browser-level CDP method: ${method ?? '(none)'}`);
                    return this.cb.reply({ id, result: {} });
            }
        }
        // ── tab session: recursive auto-attach mints the page session ──
        if (sessionId === TAB_SESSION_ID) {
            if (method === 'Target.setAutoAttach') {
                this.cb.reply({
                    method: 'Target.attachedToTarget',
                    sessionId: TAB_SESSION_ID,
                    params: {
                        targetInfo: this.pageTargetInfo(),
                        sessionId: PAGE_SESSION_ID,
                        waitingForDebugger: false,
                    },
                });
                return this.cb.reply({ id, sessionId, result: {} });
            }
            // ack other tab-session commands (e.g. Runtime.runIfWaitingForDebugger).
            return this.cb.reply({ id, sessionId, result: {} });
        }
        // ── page session: forward to the real tab via the extension ──
        if (sessionId === PAGE_SESSION_ID) {
            try {
                const result = await this.cb.forwardToTab(method ?? '', params);
                return this.cb.reply({ id, sessionId, result });
            }
            catch (err) {
                const e = err;
                return this.cb.reply({
                    id,
                    sessionId,
                    error: {
                        code: e.code ?? SERVER_ERROR,
                        message: e.message ?? 'CDP forward failed',
                        data: e.data,
                    },
                });
            }
        }
        // unknown session — return a CDP error rather than a fake-success `{}`, so a
        // command to a stale/unrecognized session surfaces instead of silently
        // no-op'ing (which puppeteer would read as success with no effect).
        return this.cb.reply({
            id,
            sessionId,
            error: {
                code: SERVER_ERROR,
                message: `Unknown CDP session: ${sessionId ?? '(none)'}`,
            },
        });
    }
    /**
     * Re-emit a CDP event that arrived from the real tab (via the extension),
     * tagged with the page session id so puppeteer routes it to its Page.
     */
    emitTabEvent(method, params) {
        this.cb.reply({ method, params, sessionId: PAGE_SESSION_ID });
    }
}
//# sourceMappingURL=cdp-browser-emulator.js.map