/**
 * @license
 * Copyright 2026 Qwen Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type { Request, Response } from 'express';
import type { WorkspaceRegistry, WorkspaceRuntime } from './workspace-registry.js';
export interface WorkspaceRouteContext {
    readonly runtime: WorkspaceRuntime;
    readonly routePrefix: string;
}
export declare function isPortableAbsolutePath(value: string): boolean;
export declare function resolveRegisteredWorkspaceRuntimeByPathSelector(registry: WorkspaceRegistry, selector: string): WorkspaceRuntime | undefined;
export declare function resolveManagedWorkspaceRuntimeByPathSelector(registry: WorkspaceRegistry, selector: string): WorkspaceRuntime | undefined;
export declare function resolveWorkspaceRuntimeFromParam(registry: WorkspaceRegistry, req: Request, res: Response, paramName?: string): WorkspaceRuntime | null;
export declare function resolveManagedWorkspaceRuntimeFromParam(registry: WorkspaceRegistry, req: Request, res: Response, paramName?: string): WorkspaceRuntime | null;
export declare function requireTrustedWorkspaceRuntime(runtime: WorkspaceRuntime, res: Response): boolean;
export declare function sendUntrustedWorkspaceResponse(res: Response, extra?: {
    sessionId?: string;
    workspaceCwd?: string;
    workspaceId?: string;
}): void;
export declare function getWorkspaceRouteContext(req: Request): WorkspaceRouteContext | undefined;
export declare function setWorkspaceRouteContext(req: Request, context: WorkspaceRouteContext): void;
export declare function sendWorkspaceMismatch(res: Response, registry: WorkspaceRegistry): void;
