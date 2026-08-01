/**
 * Agent Backend Abstraction Layer
 *
 * This module provides the Qwen backend interface used by sessions.
 *
 * Usage:
 * ```typescript
 * import { createAgent, type AgentBackend } from '@craft-agent/shared/agent/backend';
 *
 * const agent = createAgent({
 *   provider: 'hopcode',
 *   workspace: myWorkspace,
 *   model: 'qwen3-coder',
 * });
 *
 * for await (const event of agent.chat('Hello')) {
 *   console.log(event);
 * }
 * ```
 */
export type { AgentBackend, AgentProvider, CoreBackendConfig, BackendConfig, BackendHostRuntimeContext, PermissionCallback, PlanCallback, AuthCallback, SourceChangeCallback, SourceActivationCallback, ChatOptions, BackendSessionInfo, BackendSessionListOptions, BackendSessionListResult, RecoveryMessage, SdkMcpServerConfig, LlmAuthType, LlmProviderType, AvailableCommandsSnapshot, BackendSessionMessagesResult, PostInitResult, } from './types.ts';
export { AbortReason } from './types.ts';
export { createBackend, createAgent, detectProvider, getAvailableProviders, isProviderAvailable, connectionTypeToProvider, connectionAuthTypeToBackendAuthType, resolveSessionConnection, resolveBackendContext, resolveSetupTestConnectionHint, createConfigFromConnection, createBackendFromConnection, createBackendFromResolvedContext, initializeBackendHostRuntime, resolveBackendHostTooling, fetchBackendModels, validateStoredBackendConnection, providerTypeToAgentProvider, BACKEND_CAPABILITIES, resolveModelForProvider, getDefaultAuthType, cleanupSourceRuntimeArtifacts, testBackendConnection, validateConnection, } from './factory.ts';
export { BaseEventAdapter } from './base-event-adapter.ts';
export { EventQueue } from './event-queue.ts';
