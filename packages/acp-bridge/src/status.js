/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { SkillError } from '@hoptrendy/hopcode-core';
export const STATUS_SCHEMA_VERSION = 1;
/**
 * Closed enumeration of structured error categories surfaced on diagnostic
 * status cells. Cells produced by `/workspace/preflight`, `/workspace/env`,
 * and (eventually) the MCP guardrails route share this taxonomy so SDK
 * consumers can branch on a known set rather than parsing free-form strings.
 */
export const SERVE_ERROR_KINDS = [
    'missing_binary',
    'blocked_egress',
    'auth_env_error',
    'init_timeout',
    'protocol_error',
    'missing_file',
    'parse_error',
    'stat_failed',
    // Budget refusal under `--mcp-budget-mode=enforce`.
    // Surfaced on per-server `mcp_server` cells (refused at discovery)
    // and on the workspace-level `mcp_budget` cell (any refusal this pass).
    'budget_exhausted',
    // Runtime MCP mutation routes
    'mcp_budget_would_exceed',
    'mcp_server_spawn_failed',
    'invalid_config',
    // Prompt deadline + writer idle timeout
    'prompt_deadline_exceeded',
    'writer_idle_timeout',
];
/**
 * Typed timeout raised by `withTimeout` in the bridge. Lets the diagnostic
 * mapping helper recognize init/heartbeat/extMethod timeouts via `instanceof`
 * instead of regex-matching message strings.
 */
export class BridgeTimeoutError extends Error {
    label;
    timeoutMs;
    constructor(label, timeoutMs) {
        super(`AcpSessionBridge ${label} timed out after ${timeoutMs}ms`);
        this.name = 'BridgeTimeoutError';
        this.label = label;
        this.timeoutMs = timeoutMs;
    }
}
/**
 * Raised when the bridge observes its ACP child's transport closing while
 * a request is in flight (workspace status, session/* restore, or
 * mid-prompt). Replaces three `new Error('agent channel closed …')` sites
 * so `mapDomainErrorToErrorKind` can recognize the failure via
 * `instanceof` rather than regex-matching `.message`. The `context` suffix
 * preserves the legacy message wording so log greps and existing
 * diagnostic surfaces keep working.
 */
export class BridgeChannelClosedError extends Error {
    context;
    constructor(context) {
        super(`agent channel closed ${context}`);
        this.name = 'BridgeChannelClosedError';
        this.context = context;
    }
}
/**
 * Raised by `defaultSpawnChannelFactory` when neither `hopcode_cli_entry` nor
 * `process.argv[1]` resolves to a path that can be re-spawned for the ACP
 * child. Replaces a generic `new Error(...)` so `mapDomainErrorToErrorKind`
 * can return `'missing_binary'` via `instanceof` rather than regex-matching
 * `.message`. The constructor message is preserved verbatim so existing
 * operator-facing diagnostics stay byte-for-byte compatible.
 */
export class MissingCliEntryError extends Error {
    constructor() {
        super('Cannot determine CLI entry path for spawning the ACP child: ' +
            'process.argv[1] is empty and hopcode_cli_entry is unset. ' +
            'Set hopcode_cli_entry to the absolute path of the hopcode entry ' +
            'script (e.g. `export hopcode_cli_entry=$(which qwen)`) to override.');
        this.name = 'MissingCliEntryError';
    }
}
export const SERVE_STATUS_EXT_METHODS = {
    workspaceMcp: 'hopcode.status/workspace/mcp',
    workspaceMcpTools: 'hopcode.status/workspace/mcp/tools',
    workspaceMcpResources: 'hopcode.status/workspace/mcp/resources',
    workspaceSkills: 'hopcode.status/workspace/skills',
    workspaceTools: 'hopcode.status/workspace/tools',
    workspaceProviders: 'hopcode.status/workspace/providers',
    workspaceMemory: 'hopcode.status/workspace/memory',
    workspaceAgents: 'hopcode.status/workspace/agents',
    workspacePreflight: 'hopcode.status/workspace/preflight',
    sessionContext: 'hopcode.status/session/context',
    sessionContextUsage: 'hopcode.status/session/context_usage',
    sessionSupportedCommands: 'hopcode.status/session/supported_commands',
    sessionTasks: 'hopcode.status/session/tasks',
    sessionStats: 'hopcode.status/session/stats',
    sessionLspStatus: 'hopcode.status/session/lsp',
    sessionTranscript: 'hopcode.status/session/transcript',
    sessionRewindSnapshots: 'hopcode.status/session/rewind_snapshots',
    workspaceHooks: 'hopcode.status/workspace/hooks',
    sessionHooks: 'hopcode.status/session/hooks',
    workspaceExtensions: 'hopcode.status/workspace/extensions',
    // Process-wide rss/cpu of this ACP child, self-reported to the daemon for
    // the Daemon Status resource charts (workspace-scoped; no sessionId).
    workspaceResource: 'hopcode/status/workspace/resource',
};
/**
 * Control-plane (mutation) ACP extMethods introduced in Mutation control.
 * Distinct from `SERVE_STATUS_EXT_METHODS` so reviewers can grep mutation
 * surface independently from read-only diagnostics. Each route in
 * `server.ts` forwards through the matching extMethod into `acpAgent.ts`
 * which then mutates Config / ToolRegistry / McpClientManager state.
 */
export const SERVE_CONTROL_EXT_METHODS = {
    sessionClose: 'hopcode/control/session/close',
    sessionApprovalMode: 'hopcode/control/session/approval_mode',
    sessionBranch: 'hopcode/control/session/branch',
    sessionForkAgent: 'hopcode/control/session/fork_agent',
    sessionRecap: 'hopcode/control/session/recap',
    sessionGenerationStart: 'hopcode/control/session/generation/start',
    sessionGenerationCancel: 'hopcode/control/session/generation/cancel',
    sessionBtw: 'hopcode/control/session/btw',
    sessionShellHistory: 'hopcode/control/session/shell_history',
    sessionLanguage: 'hopcode/control/session/language',
    sessionRewind: 'hopcode/control/session/rewind',
    sessionContinue: 'hopcode/control/session/continue',
    sessionTitle: 'hopcode/control/session/title',
    sessionParent: 'hopcode/control/session/parent',
    sessionSource: 'hopcode/control/session/source',
    sessionArtifactsPersist: 'hopcode/control/session/artifacts/persist',
    workspaceMcpRestart: 'hopcode/control/workspace/mcp/restart',
    workspaceMcpManage: 'hopcode/control/workspace/mcp/manage',
    workspaceMcpInitialize: 'hopcode/control/workspace/mcp/initialize',
    workspaceMcpReload: 'hopcode/control/workspace/mcp/reload',
    workspaceAgentGenerate: 'hopcode/control/workspace/agents/generate',
    workspaceMemoryRememberAvailability: 'hopcode/control/workspace/memory/remember/availability',
    workspaceMemoryRemember: 'hopcode/control/workspace/memory/remember',
    workspaceMemoryForget: 'hopcode/control/workspace/memory/forget',
    workspaceMemoryDream: 'hopcode/control/workspace/memory/dream',
    // Runtime MCP server mutation ext-methods
    sessionTaskCancel: 'hopcode/control/session/task/cancel',
    sessionGoalClear: 'hopcode/control/session/goal/clear',
    /**
     * Read a live session's `/goal` state. The active goal lives only in the
     * child's in-memory store, so this is the sole authoritative source for the
     * condition, its running turn count and the judge's last verdict. Params:
     * `{ sessionId }`; result: `{ active: ActiveGoalView | null }`.
     */
    sessionGoalGet: 'hopcode/control/session/goal/get',
    workspaceMcpRuntimeAdd: 'hopcode/control/workspace/mcp/runtime-add',
    workspaceMcpRuntimeRemove: 'hopcode/control/workspace/mcp/runtime-remove',
    workspaceReload: 'hopcode/control/workspace/reload',
    workspaceSkillsRefresh: 'hopcode/control/workspace/skills/refresh',
    workspaceExtensionsRefresh: 'hopcode/control/workspace/extensions/refresh',
    /**
     * Reverse tool channel (issue #5626, Phase 2). Unlike every other entry
     * here — which the PARENT serve process calls DOWN into the `hopcode --acp`
     * child — this one is called by the CHILD UP into the parent: a
     * client-hosted (extension) MCP server's `sendSdkMcpMessage` round-trips a
     * JSON-RPC `mcp_message` from the child's `McpClientManager` back to the
     * parent's `ClientMcpRegistrar`, which pushes it down the daemon WS to the
     * client and returns the correlated response. Params: `{ server, payload }`;
     * result: `{ payload }`.
     */
    clientMcpMessage: 'hopcode/control/client_mcp/message',
    sessionCd: 'hopcode/control/session/cd',
    /**
     * Also called by the CHILD UP into the parent (like `clientMcpMessage`): the
     * `create_sub_session` tool, running inside a child's agent turn, asks the
     * daemon to spawn a fresh top-level sub-session and run a prompt in it. Params:
     * `{ prompt, completion:'sent'|'first-turn', model?, name?, callerSessionId? }`;
     * result: `{ sessionId, result?, stopReason? }` (result present only for the
     * `first-turn` mode, which waits for the sub-session's first turn to finish).
     */
    createSubSession: 'hopcode/control/create-sub-session',
};
export const IDLE_HOOK_EVENTS = {
    PreToolUse: { description: 'Before tool execution', matcherKind: 'toolName' },
    PostToolUse: { description: 'After tool execution', matcherKind: 'toolName' },
    PostToolUseFailure: {
        description: 'After tool execution fails',
        matcherKind: 'toolName',
    },
    PostToolBatch: { description: 'After a batch of tool calls resolves' },
    Notification: {
        description: 'When notifications are sent',
        matcherKind: 'notificationType',
    },
    UserPromptSubmit: { description: 'When the user submits a prompt' },
    UserPromptExpansion: {
        description: 'When a slash command expands into a prompt',
        matcherKind: 'commandName',
    },
    SessionStart: {
        description: 'When a new session is started',
        matcherKind: 'sessionTrigger',
    },
    MessageDisplay: {
        description: 'Repeatedly, as the assistant reply streams',
    },
    Stop: { description: 'Right before HopCode concludes its response' },
    SubagentStart: {
        description: 'When a subagent is started',
        matcherKind: 'agentType',
    },
    SubagentStop: {
        description: 'Right before a subagent concludes its response',
        matcherKind: 'agentType',
    },
    PreCompact: {
        description: 'Before conversation compaction',
        matcherKind: 'trigger',
    },
    PostCompact: {
        description: 'After conversation compaction',
        matcherKind: 'trigger',
    },
    SessionEnd: {
        description: 'When a session is ending',
        matcherKind: 'sessionTrigger',
    },
    PermissionRequest: {
        description: 'When a permission dialog is displayed',
        matcherKind: 'toolName',
    },
    PermissionDenied: {
        description: 'When a tool call is denied',
        matcherKind: 'toolName',
    },
    StopFailure: {
        description: 'When the turn ends due to an API error',
        matcherKind: 'error',
    },
    TodoCreated: { description: 'When a new todo item is created' },
    TodoCompleted: { description: 'When a todo item is marked as completed' },
    InstructionsLoaded: {
        description: 'When an instruction or context file is loaded',
        matcherKind: 'filePath',
    },
};
export function createIdleWorkspaceExtensionsStatus(workspaceCwd) {
    return {
        v: STATUS_SCHEMA_VERSION,
        workspaceCwd,
        initialized: false,
        extensions: [],
    };
}
export function createIdleWorkspaceHooksStatus(workspaceCwd) {
    return {
        v: STATUS_SCHEMA_VERSION,
        workspaceCwd,
        initialized: false,
        disabled: false,
        hooks: [],
        events: IDLE_HOOK_EVENTS,
    };
}
export function createIdleWorkspaceMemoryStatus(workspaceCwd) {
    return {
        v: STATUS_SCHEMA_VERSION,
        workspaceCwd,
        initialized: false,
        files: [],
        totalBytes: 0,
        fileCount: 0,
        ruleCount: 0,
    };
}
export function createIdleWorkspaceAgentsStatus(workspaceCwd) {
    return {
        v: STATUS_SCHEMA_VERSION,
        workspaceCwd,
        agents: [],
    };
}
export function createIdleWorkspaceMcpStatus(workspaceCwd) {
    // The budget feature: an idle workspace has zero live clients and no enforcement
    // pressure. `budgetMode` is `'off'` (regardless of how the operator
    // configured it) because no discovery has run, so no reservation
    // could have happened. `budgets` is an empty array, not absent —
    // the daemon DOES support the surface, the snapshot just has
    // nothing to report yet. Older daemons omitting the array entirely
    // are still spec-compliant; consumers default-coalesce to `[]`.
    return {
        v: STATUS_SCHEMA_VERSION,
        workspaceCwd,
        initialized: false,
        discoveryState: 'not_started',
        servers: [],
        clientCount: 0,
        budgetMode: 'off',
        budgets: [],
    };
}
export function createIdleWorkspaceSkillsStatus(workspaceCwd) {
    return {
        v: STATUS_SCHEMA_VERSION,
        workspaceCwd,
        initialized: false,
        skills: [],
    };
}
export function createIdleWorkspaceProvidersStatus(workspaceCwd) {
    return {
        v: STATUS_SCHEMA_VERSION,
        workspaceCwd,
        initialized: false,
        providers: [],
    };
}
/**
 * Idle envelope for `/workspace/env` when the bridge
 * has no `DaemonStatusProvider` injected (Mode A in-process consumers,
 * tests, embedded callers that don't need daemon-host cells). Single
 * construction site so future optional-field additions to
 * `ServeWorkspaceEnvStatus` only need updating in one place — the
 * production builder in `cli/src/serve/env-snapshot.ts buildEnvStatusFromProcess`
 * and this helper would otherwise diverge silently (TS won't flag a
 * missing optional field).
 *
 * Note: `initialized: true` matches `buildEnvStatusFromProcess` —
 * the daemon answers env from `process.*` state without consulting
 * ACP, so even an "empty" envelope is initialized.
 */
export function createIdleEnvStatus(workspaceCwd, acpChannelLive) {
    return {
        v: STATUS_SCHEMA_VERSION,
        workspaceCwd,
        initialized: true,
        acpChannelLive,
        cells: [],
    };
}
/**
 * The six preflight kinds that require a live ACP child to populate. Shared
 * between `createIdleAcpPreflightCells` (idle placeholder) and the
 * ACP-side `buildAcpPreflightCells` builder so the two sides cannot drift
 * — a future contributor adding a new ACP kind in one place sees the
 * other surface immediately.
 */
export const ACP_PREFLIGHT_KINDS = [
    'auth',
    'mcp_discovery',
    'skills',
    'providers',
    'tool_registry',
    'egress',
];
/**
 * Idle ACP cells: emitted when the daemon has no live ACP child. The bridge
 * stitches these in alongside its daemon-level cells so `/workspace/preflight`
 * always returns a complete cell set without spawning a child.
 */
export function createIdleAcpPreflightCells() {
    return ACP_PREFLIGHT_KINDS.map((kind) => ({
        kind,
        status: 'not_started',
        locality: 'acp',
        hint: 'spawn a session to populate',
    }));
}
const SKILL_PARSE_CODES = new Set([
    'PARSE_ERROR',
    'INVALID_CONFIG',
    'INVALID_NAME',
]);
const SKILL_FILE_CODES = new Set([
    'FILE_ERROR',
    'NOT_FOUND',
]);
const FS_MISSING_CODES = new Set([
    'ENOENT',
    'EACCES',
    'EPERM',
]);
// `ModelConfigError` subclasses live inside core's models module and are not
// re-exported on the public package surface. We classify them by the `name`
// field that each subclass sets via `this.name = new.target.name`.
const MODEL_CONFIG_ERROR_NAMES = new Set([
    'StrictMissingCredentialsError',
    'StrictMissingModelIdError',
    'MissingApiKeyError',
    'MissingModelError',
    'MissingBaseUrlError',
    'MissingAnthropicBaseUrlEnvError',
]);
/**
 * Map a thrown domain error onto one of the closed `ServeErrorKind` literals
 * so diagnostic cells can render structured remediation. Recognition is
 * `instanceof`-based for bridge-owned errors; cross-package classes
 * (`SkillError`, `TrustGateError`, model-config) are matched by `.code` or
 * `.name` because bundle duplication can break `instanceof` symmetry.
 *
 * Returns `undefined` when no rule matches; callers should leave `errorKind`
 * unset rather than coercing an unrelated error into a misleading category.
 */
export function mapDomainErrorToErrorKind(err) {
    if (err instanceof BridgeTimeoutError)
        return 'init_timeout';
    if (err instanceof BridgeChannelClosedError)
        return 'protocol_error';
    if (err instanceof MissingCliEntryError)
        return 'missing_binary';
    // `SkillError` is defined in `@hoptrendy/hopcode-core/skills`; same
    // cross-package bundling concern as `TrustGateError` below — when this
    // function is consumed from outside the monorepo (or under a bundler
    // that doesn't dedupe `file:` workspace deps), the `SkillError` class
    // identity at the throw site (cli's `SkillManager`) can diverge from
    // the one resolved here through acp-bridge's `@hoptrendy/hopcode-core`
    // dependency, silently making `instanceof` return `false` and
    // dropping the skill `errorKind` classification on diagnostic cells.
    // The `OR .name === 'SkillError'` branch keeps classification working
    // regardless of which copy of the class the value carries.
    if (err instanceof SkillError ||
        err?.name === 'SkillError') {
        const code = err.code;
        if (code && SKILL_PARSE_CODES.has(code))
            return 'parse_error';
        if (code && SKILL_FILE_CODES.has(code))
            return 'missing_file';
        return undefined;
    }
    if (err instanceof SyntaxError)
        return 'parse_error';
    if (!(err instanceof Error))
        return undefined;
    // `TrustGateError` is defined in `@hoptrendy/hopcode-core/config`; we
    // match by `.name` rather than `instanceof` because cross-package bundling
    // can produce duplicate class instances where `instanceof` returns false.
    if (err.name === 'TrustGateError')
        return 'auth_env_error';
    if (MODEL_CONFIG_ERROR_NAMES.has(err.name))
        return 'auth_env_error';
    const code = err.code;
    if (typeof code === 'string' && FS_MISSING_CODES.has(code)) {
        return 'missing_file';
    }
    return undefined;
}
//# sourceMappingURL=status.js.map