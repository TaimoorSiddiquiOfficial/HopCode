/**
 * Shared PreToolUse utilities and centralized PreToolUse pipeline.
 *
 * Individual utility functions (path expansion, skill qualification, etc.)
 * are used by the centralized `runPreToolUseChecks()` pipeline. Agent
 * backends call it with normalized input and translate the result to their
 * runtime-specific format.
 *
 * Pipeline steps:
 * 1. Permission mode check: Block tools disallowed by current mode
 * 2. Source blocking: Block tools from inactive MCP sources
 * 3. Prerequisite check: Block source tools until guide.md is read
 * 4. call_llm detection: Intercept mcp__session__call_llm
 * 5. Input transforms: Path expansion, config validation, skill qualification, metadata stripping
 * 6. Ask-mode prompt decision: Determine if user approval is needed
 */
import { type PermissionMode } from '../mode-manager.ts';
import { type PermissionsContext } from '../permissions-config.ts';
import type { PrerequisiteCheckResult } from './prerequisite-manager.ts';
export interface PreToolUseContext {
    /** Current working directory or workspace root */
    workspaceRootPath: string;
    /** Workspace ID for skill qualification */
    workspaceId: string;
    /** Debug callback */
    onDebug?: (message: string) => void;
}
export interface PathExpansionResult {
    /** Whether any paths were modified */
    modified: boolean;
    /** The updated input (or original if not modified) */
    input: Record<string, unknown>;
}
export interface SkillQualificationResult {
    /** Whether the skill name was qualified */
    modified: boolean;
    /** The updated input */
    input: Record<string, unknown>;
}
export interface MetadataStrippingResult {
    /** Whether metadata was stripped */
    modified: boolean;
    /** The cleaned input */
    input: Record<string, unknown>;
}
export interface ConfigValidationResult {
    /** Whether validation passed */
    valid: boolean;
    /** Error message if validation failed */
    error?: string;
}
/** SDK built-in tools that should NOT have metadata stripped */
export declare const BUILT_IN_TOOLS: Set<string>;
/** Tools that operate on file paths */
export declare const FILE_PATH_TOOLS: Set<string>;
/** Tools that can write config files */
export declare const CONFIG_WRITE_TOOLS: Set<string>;
/** File tools blocked for labels domain. */
export declare const LABELS_BLOCKED_FILE_TOOLS: Set<string>;
/**
 * Expand ~ paths in file tool inputs.
 *
 * Handles multiple path parameters:
 * - file_path: Used by Read, Write, Edit, MultiEdit
 * - notebook_path: Used by NotebookEdit
 * - path: Used by Glob, Grep
 *
 * @param toolName - The SDK tool name
 * @param input - The tool input object
 * @param onDebug - Optional debug callback
 * @returns PathExpansionResult with modified flag and updated input
 */
export declare function expandToolPaths(toolName: string, input: Record<string, unknown>, onDebug?: (message: string) => void): PathExpansionResult;
/**
 * Ensure skill names are fully-qualified with the correct plugin prefix.
 *
 * The runtime resolves skills as `pluginName:skillSlug` where the plugin name is
 * read from the workspace plugin manifest `name` field. Skills can live in 3 tiers:
 *   1. Workspace: {workspaceRoot}/skills/{slug}/ → plugin name from plugin.json
 *   2. Project:   {workingDir}/.agents/skills/{slug}/ → plugin name = ".agents"
 *   3. Global:    ~/.agents/skills/{slug}/ → plugin name = ".agents"
 *
 * This function resolves the bare slug to the correct plugin prefix by checking
 * which directory actually contains the skill. It also handles re-qualifying
 * skills that were incorrectly qualified by the UI (which always uses the
 * workspace slug, even for global/project skills).
 *
 * @param input - The Skill tool input ({ skill: string, args?: string })
 * @param workspaceSlug - The workspace plugin slug
 * @param workspaceRootPath - Absolute path to the workspace root
 * @param workingDirectory - Absolute path to the current working directory (optional)
 * @param onDebug - Optional debug callback
 * @returns SkillQualificationResult with modified flag and updated input
 */
export declare function qualifySkillName(input: Record<string, unknown>, workspaceSlug: string, workspaceRootPath?: string, workingDirectory?: string, onDebug?: (message: string) => void): SkillQualificationResult;
/**
 * Strip _intent and _displayName metadata from tool inputs.
 *
 * These fields are injected into tool schemas so the backend can provide
 * semantic intent for UI display. They must be stripped before execution to
 * avoid runtime validation errors and MCP server rejections.
 *
 * The extraction for UI happens in tool-matching.ts BEFORE this stripping.
 *
 * @param toolName - The tool name
 * @param input - The tool input object
 * @param onDebug - Optional debug callback
 * @returns MetadataStrippingResult with modified flag and cleaned input
 */
export declare function stripToolMetadata(toolName: string, input: Record<string, unknown>, onDebug?: (message: string) => void): MetadataStrippingResult;
/**
 * @deprecated Use stripToolMetadata instead. This alias is kept for backwards compatibility.
 */
export declare const stripMcpMetadata: typeof stripToolMetadata;
/**
 * Validate config file writes before they happen.
 *
 * For Write/Edit operations on workspace config files, validates the
 * resulting content before allowing the write to proceed. This prevents
 * invalid configs from ever reaching disk.
 *
 * Validates:
 * - sources/{slug}/config.json
 * - skills/{slug}/SKILL.md
 * - statuses/config.json
 * - permissions.json
 * - theme.json
 * - tool-icons/tool-icons.json
 *
 * @param toolName - 'Write' or 'Edit'
 * @param input - The tool input (with expanded paths)
 * @param workspaceRootPath - The workspace root path for detection
 * @param onDebug - Optional debug callback
 * @returns ConfigValidationResult with valid flag and optional error
 */
export declare function validateConfigWrite(toolName: string, input: Record<string, unknown>, workspaceRootPath: string, onDebug?: (message: string) => void): ConfigValidationResult;
/**
 * For selected config domains, enforce CLI usage instead of direct file operations.
 * - labels/**: strict block on Read/Write/Edit
 * - sources/{slug}/config.json: redirect on Write/Edit
 * - skills/{slug}/SKILL.md: redirect on Write/Edit
 * - automations.json: redirect on Write/Edit
 */
export declare function getConfigCliRedirect(toolName: string, input: Record<string, unknown>, workspaceRootPath: string, workingDirectory?: string): {
    message: string;
} | null;
/**
 * Block bash commands that operate on guarded config paths unless they use craft-agent commands.
 * Current guarded domains in Bash are declared in shared CLI domain policy.
 */
export declare function getConfigDomainBashRedirect(input: Record<string, unknown>, workspaceRootPath: string, workingDirectory?: string): {
    message: string;
} | null;
/**
 * Discriminated union result from `runPreToolUseChecks()`.
 * Each agent translates these into its SDK-specific format via a simple switch.
 */
export type PreToolUseCheckResult = {
    type: 'allow';
} | {
    type: 'modify';
    input: Record<string, unknown>;
} | {
    type: 'block';
    reason: string;
    source?: 'prerequisite';
} | {
    type: 'prompt';
    promptType: 'bash' | 'file_write' | 'mcp_mutation' | 'api_mutation' | 'admin_approval';
    description: string;
    command?: string;
    modifiedInput?: Record<string, unknown>;
    appName?: string;
    reason?: string;
    impact?: string;
    requiresSystemPrompt?: boolean;
    rememberForMinutes?: number;
    commandHash?: string;
    approvalTtlSeconds?: number;
} | {
    type: 'source_activation_needed';
    sourceSlug: string;
    sourceExists: boolean;
} | {
    type: 'call_llm_intercept';
    input: Record<string, unknown>;
} | {
    type: 'spawn_session_intercept';
    input: Record<string, unknown>;
};
/**
 * Input for `runPreToolUseChecks()`. Each agent builds this from its SDK-specific
 * hook input. All fields needed for the pipeline are normalized here.
 */
export interface PreToolUseInput {
    /** SDK-normalized tool name (PascalCase for built-in, mcp__server__tool for MCP) */
    toolName: string;
    /** Tool input object */
    input: Record<string, unknown>;
    /** Current session ID */
    sessionId: string;
    /** Current permission mode */
    permissionMode: PermissionMode;
    /** Absolute path to workspace root */
    workspaceRootPath: string;
    /** Workspace ID or slug for skill qualification */
    workspaceId: string;
    /** Plans folder path for the session (writes allowed in explore mode) */
    plansFolderPath?: string;
    /** Data folder path (writes allowed in explore mode for transform_data output) */
    dataFolderPath?: string;
    /** Working directory override (for skill resolution) */
    workingDirectory?: string;
    /** Currently active source slugs */
    activeSourceSlugs: string[];
    /** All available sources (for source-exists check) */
    allSourceSlugs: string[];
    /** Whether the agent supports source activation (has onSourceActivationRequest callback) */
    hasSourceActivation: boolean;
    /** PermissionManager for session-scoped whitelists */
    permissionManager: PermissionManagerLike;
    /** PrerequisiteManager for guide.md checking */
    prerequisiteManager?: PrerequisiteManagerLike;
    /** Backend metadata provided alongside a tool call */
    backendMetadata?: {
        intent?: string;
        displayName?: string;
    };
    /** Debug callback */
    onDebug?: (message: string) => void;
}
/**
 * Minimal interface for PermissionManager that runPreToolUseChecks() depends on.
 * This keeps the pipeline testable without importing the full PermissionManager.
 */
export interface PermissionManagerLike {
    isCommandWhitelisted(command: string): boolean;
    isDangerousCommand(command: string): boolean;
    getBaseCommand(command: string): string;
    extractDomainFromNetworkCommand(command: string): string | null;
    isDomainWhitelisted(domain: string): boolean;
}
/**
 * Minimal interface for PrerequisiteManager.
 */
export interface PrerequisiteManagerLike {
    checkPrerequisites(toolName: string): PrerequisiteCheckResult;
    trackBashSkillRead(input: Record<string, unknown>): boolean;
}
export declare function runPreToolUseChecks(ctx: PreToolUseInput): PreToolUseCheckResult;
interface PromptInfo {
    promptType: 'bash' | 'file_write' | 'mcp_mutation' | 'api_mutation' | 'admin_approval';
    description: string;
    command?: string;
    appName?: string;
    reason?: string;
    impact?: string;
    requiresSystemPrompt?: boolean;
    rememberForMinutes?: number;
    commandHash?: string;
    approvalTtlSeconds?: number;
}
/**
 * Determine if user approval is needed in 'ask' mode.
 *
 * Returns prompt info if user should be asked, null if auto-allowed.
 * This is the single source of truth for ask-mode decisions across agent
 * backends.
 */
export declare function shouldPromptInAskMode(toolName: string, input: Record<string, unknown>, permissionManager: PermissionManagerLike, permissionsContext: PermissionsContext, plansFolderPath?: string, onDebug?: (message: string) => void): PromptInfo | null;
export {};
