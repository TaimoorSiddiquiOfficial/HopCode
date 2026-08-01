/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { getServeProtocolVersions } from '../capabilities.js';
import { advertisedMaxPendingPromptsPerSession, advertisedMaxSessions, } from '../server/serve-features.js';
import { CAPABILITIES_SCHEMA_VERSION, } from '../types.js';
export function registerCapabilitiesRoutes(app, deps) {
    app.get('/capabilities', (_req, res) => {
        const runtimes = deps.workspaceRegistry.list();
        const multiWorkspace = runtimes.length > 1;
        const features = deps.currentServeFeatures();
        const runtimeRemoval = features.includes('workspace_runtime_removal');
        const envelope = {
            v: CAPABILITIES_SCHEMA_VERSION,
            protocolVersions: getServeProtocolVersions(),
            ...(deps.HopCodeVersion
                ? { HopCodeVersion: deps.HopCodeVersion }
                : {}),
            mode: deps.mode,
            features,
            modelServices: [],
            // Surface the primary workspace so clients can omit `cwd` on
            // `POST /session`; multi-workspace clients use `workspaces[]`.
            workspaceCwd: deps.boundWorkspace,
            // Advertise supported transport families so SDK clients can
            // auto-negotiate the best available transport via negotiateTransport().
            transports: ['rest'],
            // Active mediation policy under the `policy` namespace.
            policy: { permission: deps.permissionPolicy },
            limits: {
                maxPendingPromptsPerSession: advertisedMaxPendingPromptsPerSession(deps.maxPendingPromptsPerSession),
                ...(multiWorkspace
                    ? {
                        maxSessionsPerWorkspace: advertisedMaxSessions(deps.maxSessionsPerWorkspace),
                        maxTotalSessions: deps.maxTotalSessions === undefined ||
                            deps.maxTotalSessions === 0 ||
                            deps.maxTotalSessions === Number.POSITIVE_INFINITY
                            ? null
                            : deps.maxTotalSessions,
                    }
                    : {}),
            },
            workspaces: runtimes.map((runtime) => ({
                id: runtime.workspaceId,
                cwd: runtime.workspaceCwd,
                primary: runtime.primary,
                trusted: runtime.trusted,
                ...(runtimeRemoval ? { removable: runtime.removable === true } : {}),
            })),
            supportedLanguages: deps.languageCodes,
        };
        res.status(200).json(envelope);
    });
}
//# sourceMappingURL=capabilities.js.map