/**
 * Core Agent Module
 *
 * Provides shared functionality for agent backends.
 * These modules are provider-agnostic and can be composed into any agent implementation.
 *
 * Modules:
 * - PermissionManager: Tool permission evaluation and mode management
 * - SourceManager: External data source state tracking
 * - PromptBuilder: System prompt and context building
 * - PathProcessor: Path expansion and normalization
 * - ConfigValidator: Pre-write configuration validation
 * - ConfigWatcherManager: Hot-reload config file watching
 * - SessionLifecycleManager: Session state and abort handling
 * - UsageTracker: Token usage and context window tracking
 * - PrerequisiteManager: Prerequisite reading enforcement (guide.md before source tools)
 */
export type { RecoveryMessage, PermissionManagerConfig, ToolPermissionResult, SourceManagerConfig, PromptBuilderConfig, ContextBlockOptions, PathProcessorConfig, ConfigValidatorConfig, ConfigValidationResult, ConfigFileType, PermissionMode, ModeConfig, CompiledApiEndpointRule, CompiledBashPattern, MismatchAnalysis, PermissionPaths, ToolCheckResult, } from './types.ts';
export type { ConfigWatcherManagerCallbacks, ConfigWatcherManagerConfig, } from './config-watcher-manager.ts';
export type { SessionState, SessionLifecycleConfig, } from './session-lifecycle.ts';
export { AbortReason } from './session-lifecycle.ts';
export type { MessageUsage, SessionUsage, UsageUpdate, UsageTrackerConfig, } from './usage-tracker.ts';
export { PERMISSION_MODE_ORDER, PERMISSION_MODE_CONFIG, SAFE_MODE_CONFIG, } from './types.ts';
export { PermissionManager } from './permission-manager.ts';
export { SourceManager } from './source-manager.ts';
export { PromptBuilder } from './prompt-builder.ts';
export { PathProcessor, expandPath, normalizePath, pathStartsWith, toPortablePath, } from './path-processor.ts';
export { ConfigValidator } from './config-validator.ts';
export { ConfigWatcherManager, createConfigWatcherManager, } from './config-watcher-manager.ts';
export { SessionLifecycleManager, createSessionLifecycleManager, } from './session-lifecycle.ts';
export { UsageTracker, createUsageTracker, } from './usage-tracker.ts';
export { type PreToolUseContext, type PathExpansionResult, type SkillQualificationResult, type MetadataStrippingResult, type ConfigValidationResult as PreToolUseConfigValidationResult, type PreToolUseCheckResult, type PreToolUseInput, type PermissionManagerLike, type PrerequisiteManagerLike, BUILT_IN_TOOLS, FILE_PATH_TOOLS, CONFIG_WRITE_TOOLS, expandToolPaths, qualifySkillName, stripToolMetadata, stripMcpMetadata, // deprecated alias for backwards compatibility
validateConfigWrite, runPreToolUseChecks, shouldPromptInAskMode, } from './pre-tool-use.ts';
export { PrerequisiteManager } from './prerequisite-manager.ts';
export type { PrerequisiteRule, PrerequisiteCheckResult, PrerequisiteManagerConfig, } from './prerequisite-manager.ts';
export { AGENTS_PLUGIN_NAME } from '../../skills/types.ts';
