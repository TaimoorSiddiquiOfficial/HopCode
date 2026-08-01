import type { Content } from '@google/genai';
import type { Config } from '../../config/config.js';
export declare const FORK_SUBAGENT_TYPE = "fork";
/**
 * Fork subagent availability gate.
 *
 * Fork is available in interactive sessions. Non-interactive sessions
 * (e.g. `hopcode -p`, SDK headless, CI/CD) lack a terminal UI for fork progress
 * display and permission prompts, which can cause hangs or silent failures.
 *
 * Forking is an explicit choice — the caller selects it with
 * `subagent_type: "fork"`. Omitting `subagent_type` always resolves to the
 * general-purpose subagent, never a fork. Regular top-level subagents run in
 * the background by default; callers can set `run_in_background: false` for an
 * inline result. When fork is unavailable, an explicit `subagent_type: "fork"`
 * falls back to the general-purpose subagent.
 */
export declare function isForkSubagentEnabled(config: Config): boolean;
export declare const FORK_BOILERPLATE_TAG = "fork-boilerplate";
export declare const FORK_DIRECTIVE_PREFIX = "Directive: ";
export declare const FORK_AGENT: {
    name: string;
    description: string;
    tools: string[];
    systemPrompt: string;
    approvalMode: string;
    level: "session";
};
export declare const FORK_DEFAULT_MAX_TURNS = 200;
export declare function runInForkContext<T>(fn: () => Promise<T>): Promise<T>;
export declare function isInForkExecution(): boolean;
export declare const FORK_PLACEHOLDER_RESULT = "Fork started \u2014 processing in background";
/**
 * Build functionResponse parts for every open function call in a model message.
 *
 * Shared by the fork subagent (agent.ts) and background agent history
 * construction (e.g. extractionAgentPlanner.ts) to close open tool calls
 * before injecting history into a new agent session.
 *
 * @param assistantMessage - The model message that may contain functionCall parts.
 * @param placeholderOutput - The placeholder string to use as each response's output.
 */
export declare function buildFunctionResponseParts(assistantMessage: Content, placeholderOutput: string): Array<{
    functionResponse: {
        id: string | undefined;
        name: string | undefined;
        response: {
            output: string;
        };
    };
}>;
/**
 * Build extra history messages for a forked subagent.
 *
 * When the last model message has function calls, we must include matching
 * function responses in a user message (Gemini API requirement). The
 * directive is embedded in this same user message to avoid consecutive
 * user messages.
 *
 * When there are no function calls, we return [] — the parent history
 * already ends with a model text message and the directive will be sent
 * as the task_prompt by agent-headless (model → user alternation is OK).
 *
 * @param directive - The fork directive text (user's prompt)
 * @param assistantMessage - The last model message from the parent history
 * @returns Extra messages to append to history (may be empty)
 */
export declare function buildForkedMessages(directive: string, assistantMessage: Content): Content[];
/**
 * Notice injected into a subagent that has been spun up inside an isolated
 * git worktree (via `AgentTool` `isolation: 'worktree'`). Tells the agent
 * to confine all file operations to the worktree path and to re-read any
 * file inherited from the parent's context before editing it.
 *
 * Mirrors claude-code's `buildWorktreeNotice` in
 * `tools/AgentTool/forkSubagent.ts`.
 */
export declare function buildWorktreeNotice(parentCwd: string, worktreeCwd: string): string;
/**
 * Notice for a sub-agent pinned to a caller-owned worktree via `working_dir`.
 *
 * Deliberately narrower than {@link buildWorktreeNotice}: that one describes a
 * freshly provisioned copy of the parent's tree, so it asks the agent to
 * translate inherited paths and to re-read files the parent may have touched.
 * A pinned worktree is instead the code the agent was asked to work on, and its
 * cwd already IS that directory — telling it to prefix absolute paths or to
 * translate the parent's paths would contradict the caller's own instructions.
 */
export declare function buildPinnedWorktreeNotice(worktreeCwd: string): string;
export declare function buildChildMessage(directive: string): string;
