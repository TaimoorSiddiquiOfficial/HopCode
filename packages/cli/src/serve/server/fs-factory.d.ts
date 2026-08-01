/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type { BridgeEvent } from '@hoptrendy/acp-bridge/eventBus';
import { type WorkspaceFileSystemFactory } from '../fs/index.js';
import type { PathMutexRegistry } from '../fs/path-mutex-registry.js';
/**
 * Build a no-op fs-audit emitter that logs a warning every
 * `WARN_EVERY` dropped events. The default factory uses this so a
 * regression that silently strips audit events shows up in operator
 * logs instead of disappearing. `runHopCodeServe` replaces this with a
 * real per-session emit, so legitimate production traffic never hits
 * the warning.
 */
export declare function createDefaultFsAuditEmit(): (event: BridgeEvent) => void;
/**
 * Shared `WorkspaceFileSystemFactory` construction used by both
 * `runHopCodeServe` and `createServeApp`'s default bridge wiring.
 * Centralizes the "use the injected factory if provided, otherwise
 * build one with the given trust + audit-emit posture" logic.
 *
 * Trust is intentionally a **required** parameter — the two call
 * sites have different correct defaults:
 *   - `runHopCodeServe` defaults to `trusted: true`
 *   - `createServeApp` defaults to `trusted: false` (test-safe)
 */
export declare function resolveBridgeFsFactory(input: {
    boundWorkspaces: readonly string[];
    injected?: WorkspaceFileSystemFactory;
    trusted: boolean;
    emit?: (event: BridgeEvent) => void;
    customIgnoreFiles?: string[];
    pathLocks?: PathMutexRegistry;
}): WorkspaceFileSystemFactory;
export declare function resolveBoundWorkspacesFromIdeEnv(primaryWorkspace: string, ideWorkspacePath?: string | undefined, includeWorkspace?: (workspace: string, index: number) => boolean): string[];
