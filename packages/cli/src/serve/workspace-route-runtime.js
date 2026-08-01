/**
 * @license
 * Copyright 2026 Qwen Team
 * SPDX-License-Identifier: Apache-2.0
 */
import path from 'node:path';
import { canonicalizeWorkspace } from './acp-session-bridge.js';
export function isPortableAbsolutePath(value) {
    return (path.isAbsolute(value) ||
        /^[A-Za-z]:[\\/]/.test(value) ||
        /^\\\\[^\\]+\\[^\\]+/.test(value));
}
function isUncPath(value) {
    return /^\\\\[^\\]+\\[^\\]+/.test(value);
}
function normalizePortableAbsolutePath(value) {
    if (/^[A-Za-z]:[\\/]/.test(value) || /^\\\\[^\\]+\\[^\\]+/.test(value)) {
        return path.win32.normalize(value).toLowerCase();
    }
    return path.resolve(value);
}
export function resolveRegisteredWorkspaceRuntimeByPathSelector(registry, selector) {
    const exact = registry.getByWorkspaceCwd(selector);
    if (exact)
        return exact;
    if (path.isAbsolute(selector) && !isUncPath(selector)) {
        try {
            const canonicalSelector = canonicalizeWorkspace(selector);
            const canonicalMatch = registry.getByWorkspaceCwd(canonicalSelector);
            if (canonicalMatch)
                return canonicalMatch;
            for (const runtime of registry.list()) {
                if (canonicalizeWorkspace(runtime.workspaceCwd) === canonicalSelector) {
                    return runtime;
                }
            }
        }
        catch {
            // Fall through to lexical matching; unresolved selectors still return
            // workspace_mismatch without probing UNC/network paths.
        }
    }
    const normalizedSelector = normalizePortableAbsolutePath(selector);
    return registry
        .list()
        .find((runtime) => normalizePortableAbsolutePath(runtime.workspaceCwd) ===
        normalizedSelector);
}
export function resolveManagedWorkspaceRuntimeByPathSelector(registry, selector) {
    const exact = registry.getManagedByWorkspaceCwd(selector);
    if (exact)
        return exact;
    if (path.isAbsolute(selector) && !isUncPath(selector)) {
        try {
            const canonicalSelector = canonicalizeWorkspace(selector);
            const canonicalMatch = registry.getManagedByWorkspaceCwd(canonicalSelector);
            if (canonicalMatch)
                return canonicalMatch;
            for (const runtime of registry.listManaged()) {
                if (canonicalizeWorkspace(runtime.workspaceCwd) === canonicalSelector) {
                    return runtime;
                }
            }
        }
        catch {
            // Fall through to lexical matching for unavailable paths.
        }
    }
    const normalizedSelector = normalizePortableAbsolutePath(selector);
    return registry
        .listManaged()
        .find((runtime) => normalizePortableAbsolutePath(runtime.workspaceCwd) ===
        normalizedSelector);
}
export function resolveWorkspaceRuntimeFromParam(registry, req, res, paramName = 'workspace') {
    const selector = (req.params[paramName] ?? '');
    const byId = registry.getByWorkspaceId(selector);
    if (byId)
        return byId;
    if (!isPortableAbsolutePath(selector)) {
        res.status(400).json({
            error: `\`:${paramName}\` must decode to a workspace id or absolute path`,
            code: 'workspace_mismatch',
        });
        return null;
    }
    const runtime = resolveRegisteredWorkspaceRuntimeByPathSelector(registry, selector);
    if (!runtime) {
        sendWorkspaceMismatch(res, registry);
        return null;
    }
    return runtime;
}
export function resolveManagedWorkspaceRuntimeFromParam(registry, req, res, paramName = 'workspace') {
    const selector = (req.params[paramName] ?? '');
    const byId = registry.getManagedByWorkspaceId(selector);
    if (byId)
        return byId;
    if (!isPortableAbsolutePath(selector)) {
        res.status(400).json({
            error: `\`:${paramName}\` must decode to a workspace id or absolute path`,
            code: 'workspace_mismatch',
        });
        return null;
    }
    const runtime = resolveManagedWorkspaceRuntimeByPathSelector(registry, selector);
    if (!runtime) {
        res.status(400).json({
            error: 'Workspace mismatch: the requested workspace is not registered with this daemon.',
            code: 'workspace_mismatch',
        });
        return null;
    }
    return runtime;
}
export function requireTrustedWorkspaceRuntime(runtime, res) {
    if (runtime.trusted)
        return true;
    sendUntrustedWorkspaceResponse(res);
    return false;
}
export function sendUntrustedWorkspaceResponse(res, extra) {
    res.status(403).json({
        error: 'Workspace is not trusted.',
        code: 'untrusted_workspace',
        ...extra,
    });
}
export function getWorkspaceRouteContext(req) {
    return req
        .workspaceRouteContext;
}
export function setWorkspaceRouteContext(req, context) {
    req.workspaceRouteContext = context;
}
export function sendWorkspaceMismatch(res, registry) {
    const runtimes = registry.list();
    res.status(400).json({
        error: 'Workspace mismatch: the requested workspace is not registered with this daemon.',
        code: 'workspace_mismatch',
        workspaceCount: runtimes.length,
    });
}
//# sourceMappingURL=workspace-route-runtime.js.map