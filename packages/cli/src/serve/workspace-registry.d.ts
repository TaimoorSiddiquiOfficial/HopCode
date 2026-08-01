/**
 * @license
 * Copyright 2026 Qwen Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { type AcpSessionBridge } from './acp-session-bridge.js';
import type { ClientMcpSenderRegistry } from './acp-http/client-mcp-sender-registry.js';
import type { WorkspaceFileSystemFactory } from './fs/index.js';
import type { DaemonWorkspaceService } from './workspace-service/types.js';
export interface WorkspaceRuntimeEnvMetadata {
    readonly mode: 'parent-process' | 'runtime-overlay';
    readonly overlayKeys: readonly string[];
    readonly effectiveEnv?: Readonly<NodeJS.ProcessEnv>;
    readonly envFilePaths?: readonly string[];
    readonly envFileReadFailed?: boolean;
    readonly envFileReadFailures?: ReadonlyArray<{
        readonly path: string;
        readonly error: string;
    }>;
    readonly fallbackReason?: string;
}
export interface WorkspaceRuntime {
    readonly workspaceId: string;
    readonly workspaceCwd: string;
    readonly primary: boolean;
    readonly trusted: boolean;
    /** Whether this runtime may be removed without restarting the daemon. */
    readonly removable?: boolean;
    /** Persistent registration ids that restore this runtime on daemon startup. */
    readonly registrationIds?: readonly string[];
    readonly env: WorkspaceRuntimeEnvMetadata;
    readonly bridge: AcpSessionBridge;
    readonly workspaceService: DaemonWorkspaceService;
    readonly routeFileSystemFactory: WorkspaceFileSystemFactory;
    readonly clientMcpSenderRegistry: ClientMcpSenderRegistry;
}
export type WorkspaceSessionOwnerResolution = {
    readonly kind: 'found';
    readonly runtime: WorkspaceRuntime;
} | {
    readonly kind: 'not_found';
} | {
    readonly kind: 'ambiguous';
    readonly runtimes: readonly WorkspaceRuntime[];
};
export type WorkspaceSessionLifecycleEvent = {
    readonly type: 'registered';
    readonly sessionId: string;
    readonly workspaceCwd: string;
} | {
    readonly type: 'removed';
    readonly sessionId: string;
    readonly workspaceCwd: string;
};
export interface WorkspaceSessionOwnerIndex {
    register(sessionId: string, workspaceCwd: string): void;
    remove(sessionId: string, workspaceCwd?: string): void;
    getWorkspaceCwds(sessionId: string): readonly string[];
    removeWorkspace(workspaceCwd: string): void;
    handleBridgeSessionLifecycle(event: WorkspaceSessionLifecycleEvent): void;
}
export interface WorkspaceRegistry {
    readonly primary: WorkspaceRuntime;
    list(): readonly WorkspaceRuntime[];
    getByWorkspaceCwd(workspaceCwd: string): WorkspaceRuntime | undefined;
    getByWorkspaceId(workspaceId: string): WorkspaceRuntime | undefined;
    resolveWorkspaceCwd(workspaceCwd: string | undefined): WorkspaceRuntime | undefined;
    resolveLiveSessionOwner(sessionId: string): WorkspaceSessionOwnerResolution;
    add(runtime: WorkspaceRuntime): void;
    listManaged(): readonly WorkspaceRuntime[];
    getManagedByWorkspaceCwd(workspaceCwd: string): WorkspaceRuntime | undefined;
    getManagedByWorkspaceId(workspaceId: string): WorkspaceRuntime | undefined;
    beginDrain(runtime: WorkspaceRuntime): boolean;
    cancelDrain(runtime: WorkspaceRuntime): void;
    completeDrain(runtime: WorkspaceRuntime): void;
}
export interface WorkspaceRegistryOptions {
    readonly sessionOwnerIndex?: WorkspaceSessionOwnerIndex;
}
export declare function createWorkspaceSessionOwnerIndex(): WorkspaceSessionOwnerIndex;
export declare function createWorkspaceRegistry(inputRuntimes: readonly WorkspaceRuntime[], options?: WorkspaceRegistryOptions): WorkspaceRegistry;
export declare function createSingleWorkspaceRegistry(runtime: WorkspaceRuntime, options?: WorkspaceRegistryOptions): WorkspaceRegistry;
