/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type { BridgeFileSystem } from '@hoptrendy/acp-bridge';
import type { WorkspaceFileSystemFactory } from './fs/workspace-file-system.js';
/**
 * Adapter factory. Pass the existing `WorkspaceFileSystemFactory`
 * (the same instance `createServeApp` / `runHopCodeServe` build for
 * HTTP fs routes) — both paths share the same `fsAuditEmit` channel
 * + trust gate snapshot so an operator gets a unified audit stream.
 */
export declare function createBridgeFileSystemAdapter(factory: WorkspaceFileSystemFactory): BridgeFileSystem;
