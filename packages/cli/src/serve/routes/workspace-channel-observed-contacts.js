/**
 * @license
 * Copyright 2026 Qwen Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { daemonObservedContactsPath } from '../../commands/channel/runtime.js';
import { OBSERVED_CONTACT_MAX_FRESH_WITHIN_SECONDS, ObservedChannelContactStore, } from '../../commands/channel/observed-contact-store.js';
import { requireTrustedWorkspaceRuntime, resolveWorkspaceRuntimeFromParam, } from '../workspace-route-runtime.js';
const DEFAULT_FRESH_WITHIN_SECONDS = 7 * 24 * 60 * 60;
function parseFreshWithinSeconds(req) {
    const raw = req.query['freshWithinSeconds'];
    if (raw === undefined)
        return DEFAULT_FRESH_WITHIN_SECONDS;
    if (typeof raw !== 'string' || !/^\d+$/u.test(raw))
        return undefined;
    const value = Number(raw);
    if (!Number.isSafeInteger(value) ||
        value < 1 ||
        value > OBSERVED_CONTACT_MAX_FRESH_WITHIN_SECONDS) {
        return undefined;
    }
    return value;
}
function sendContacts(req, res, workspaceCwd) {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    const freshWithinSeconds = parseFreshWithinSeconds(req);
    if (freshWithinSeconds === undefined) {
        res.status(400).json({
            error: `freshWithinSeconds must be an integer from 1 to ${OBSERVED_CONTACT_MAX_FRESH_WITHIN_SECONDS}.`,
            code: 'invalid_freshness',
        });
        return;
    }
    try {
        const store = new ObservedChannelContactStore(daemonObservedContactsPath(workspaceCwd));
        res.status(200).json(store.list({ freshWithinSeconds }));
    }
    catch {
        process.stderr.write('qwen serve: observed channel contacts unavailable.\n');
        res.status(500).json({
            error: 'Observed channel contacts are unavailable.',
            code: 'channel_observed_contacts_unavailable',
        });
    }
}
export function registerWorkspaceChannelObservedContactRoutes(app, deps) {
    app.get('/workspace/channel/observed-contacts', (req, res) => {
        sendContacts(req, res, deps.primaryWorkspace);
    });
    app.get('/workspaces/:workspace/channel/observed-contacts', (req, res) => {
        const runtime = resolveWorkspaceRuntimeFromParam(deps.workspaceRegistry, req, res);
        if (!runtime || !requireTrustedWorkspaceRuntime(runtime, res))
            return;
        sendContacts(req, res, runtime.workspaceCwd);
    });
}
//# sourceMappingURL=workspace-channel-observed-contacts.js.map