/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { requireTrustedWorkspaceRuntime, resolveWorkspaceRuntimeFromParam, } from '../workspace-route-runtime.js';
export function registerWorkspaceGitRoutes(app, deps) {
    app.get('/workspace/git', async (_req, res) => {
        try {
            res
                .status(200)
                .json(await deps.gitState.getStatus(deps.boundWorkspace, deps.bridge));
        }
        catch (err) {
            deps.sendBridgeError(res, err, { route: 'GET /workspace/git' });
        }
    });
}
function resolveTrustedRuntime(registry, req, res) {
    const runtime = resolveWorkspaceRuntimeFromParam(registry, req, res);
    if (!runtime)
        return null;
    return requireTrustedWorkspaceRuntime(runtime, res) ? runtime : null;
}
export function registerWorkspaceQualifiedGitRoutes(app, deps) {
    app.get('/workspaces/:workspace/git', async (req, res) => {
        const runtime = resolveTrustedRuntime(deps.workspaceRegistry, req, res);
        if (!runtime)
            return;
        const route = 'GET /workspaces/:workspace/git';
        try {
            res
                .status(200)
                .json(await deps.gitState.getStatus(runtime.workspaceCwd, runtime.bridge));
        }
        catch (err) {
            deps.sendBridgeError(res, err, { route });
        }
    });
}
//# sourceMappingURL=workspace-git.js.map