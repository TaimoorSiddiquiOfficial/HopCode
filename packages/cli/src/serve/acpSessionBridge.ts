/**
 * @license
 * Copyright 2025 Qwen Team
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Stage 1 HTTP→ACP bridge — backward-compat re-export shim.
 *
 * #4175 PR F1 lifted the bridge core (`BridgeClient`,
 * `defaultSpawnChannelFactory`, `createAcpSessionBridge` factory closure,
 * plus the supporting types/errors/options/status) to
 * `@hopcode/acp-bridge`. This shim preserves every existing relative
 * import path (`./acpSessionBridge.js`) so `server.ts`, `runHopCodeServe.ts`,
 * `workspaceAgents.ts`, `workspaceMemory.ts`, `index.ts`, plus the
 * bridge test suite, keep resolving without any call-site changes.
 *
 * The implementation now lives at:
 *   - `@hopcode/acp-bridge/bridge` — `createAcpSessionBridge` factory
 *   - `@hopcode/acp-bridge/bridgeClient` — `BridgeClient` class +
 *     permission record types
 *   - `@hopcode/acp-bridge/spawnChannel` — `defaultSpawnChannelFactory`
 *   - `@hopcode/acp-bridge/bridgeOptions` — `BridgeOptions` +
 *     `DaemonStatusProvider` interfaces
 *   - `@hopcode/acp-bridge/bridgeTypes` — bridge session + heartbeat
 *     types + `AcpSessionBridge` interface
 *   - `@hopcode/acp-bridge/bridgeErrors` — typed bridge error classes
 *   - `@hopcode/acp-bridge/workspacePaths` — `canonicalizeWorkspace`
 *     + `MAX_WORKSPACE_PATH_LENGTH`
 *   - `@hopcode/acp-bridge/status` — protocol-versioned status types
 *     + idle envelope helpers
 *   - `@hopcode/acp-bridge/channel` — `AcpChannel` + `ChannelFactory`
 *
 * The bridge is bound to a single canonical workspace
 * (`BridgeOptions.boundWorkspace`); multi-workspace deployments use
 * multiple daemon processes. See the module docstring on `bridge.ts`
 * in the lifted package for the full Stage 1/Stage 2 contract.
 */

export {
  createAcpSessionBridge,
  createHttpAcpBridge,
} from '@hopcode/acp-bridge/bridge';
export { defaultSpawnChannelFactory } from '@hopcode/acp-bridge/spawnChannel';
// `MAX_RESOLVED_PERMISSION_RECORDS`, `PendingPermission`,
// `PermissionResolutionRecord` re-exports were removed alongside the
// source definitions — the mediator now owns pending+resolved state.
export { BridgeClient } from '@hopcode/acp-bridge/bridgeClient';
export type { BridgeClientSessionEntry } from '@hopcode/acp-bridge/bridgeClient';

export type {
  AcpChannel,
  AcpChannelExitInfo,
  ChannelFactory,
} from '@hopcode/acp-bridge';

export type {
  BridgeOptions,
  DaemonStatusProvider,
} from '@hopcode/acp-bridge/bridgeOptions';

export type { BridgeFileSystem } from '@hopcode/acp-bridge/bridgeFileSystem';

export type {
  BridgeSpawnRequest,
  BridgeSession,
  BridgeRestoreSessionRequest,
  BridgeSessionState,
  BridgeRestoredSession,
  BridgeSessionSummary,
  SessionMetadataUpdate,
  BridgeClientRequestContext,
  BridgeHeartbeatResult,
  BridgeHeartbeatState,
  AcpSessionBridge,
  HttpAcpBridge,
} from '@hopcode/acp-bridge/bridgeTypes';

export {
  BranchWhilePromptActiveError,
  SessionNotFoundError,
  RestoreInProgressError,
  InvalidSessionScopeError,
  SessionLimitExceededError,
  WorkspaceMismatchError,
  InvalidClientIdError,
  InvalidPermissionOptionError,
  InvalidSessionMetadataError,
  WorkspaceInitConflictError,
  WorkspaceInitPathEscapeError,
  WorkspaceInitSymlinkError,
  WorkspaceInitRaceError,
  McpServerNotFoundError,
  McpServerRestartFailedError,
  SessionBusyError,
  InvalidRewindTargetError,
  NOT_CURRENTLY_GENERATING_CANCEL_MESSAGE,
  // Multi-client permission coordination errors.
  CancelSentinelCollisionError,
  PermissionForbiddenError,
  PermissionPolicyNotImplementedError,
} from '@hopcode/acp-bridge/bridgeErrors';

export {
  MAX_WORKSPACE_PATH_LENGTH,
  canonicalizeWorkspace,
} from '@hopcode/acp-bridge/workspacePaths';
