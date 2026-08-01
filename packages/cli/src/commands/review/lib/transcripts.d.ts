/**
 * @license
 * Copyright 2026 Qwen Team
 * SPDX-License-Identifier: Apache-2.0
 */
/** One subagent, as the harness recorded it. */
export interface AgentRecord {
    agentId: string;
    agentName: string;
    /** The prompt the agent was launched with — the transcript's first record. */
    launchPrompt: string;
    /** Tool calls that came back without an error. */
    successfulToolCalls: number;
    /**
     * Successful tool calls whose arguments named the diff file.
     *
     * The difference between this and `successfulToolCalls` is the difference
     * between an agent that did *something* and one that opened *the diff*. The old
     * check could not tell them apart: it credited a chunk to any agent that made
     * one successful call, and a `glob` for test files is a successful call. What a
     * review has to be able to say is that someone opened the lines it is about to
     * certify.
     */
    diffToolCalls: number;
    /**
     * Diff line ranges this agent demonstrably read, 1-based and inclusive.
     *
     * Taken from the `offset`/`limit` of its successful `read_file` calls on the
     * diff. This is what it *did*, next to what it was *told* to do — an agent
     * handed the bare diff path with no territory (a reverse-audit pass, a
     * verifier) can still show which lines it opened.
     */
    diffReads: Array<[number, number]>;
    /**
     * The arguments of every successful tool call, serialized.
     *
     * So a check can ask "did this agent open *that* file" of any path, not only the
     * diff. The one that matters is the agent's own brief: the launch prompt now
     * points at it rather than containing it, and whether the agent read it is a fact
     * the harness wrote down, not a hope.
     */
    successfulCallArgs: string[];
    /** The agent's own final text, as the harness saw it. */
    finalText: string;
    /** When the transcript was last written. */
    mtimeMs: number;
}
/** Why no transcripts could be read. Never conflated with "the agents idled". */
export declare class TranscriptsUnavailableError extends Error {
}
/**
 * Where this session's subagent transcripts live.
 *
 * Both halves come from the environment the CLI exported, never from an argument:
 * a path the model can choose is a path the model can point somewhere flattering.
 * `QWEN_CODE_PROJECT_DIR` exists because the project dir is keyed on the session's
 * *launch* cwd, and this subcommand may well be running inside a PR worktree the
 * skill `cd`-ed into — recomputing it from `process.cwd()` yields a directory that
 * never existed.
 */
export declare function transcriptDir(env?: NodeJS.ProcessEnv): string;
/**
 * Every subagent this session launched, as the harness recorded it.
 *
 * `since` drops transcripts older than the plan they are supposed to be evidence
 * for. The transcript dir is scoped to the *session*, not the review, and nothing
 * prunes it — so a second `/review` in one session would otherwise be satisfied
 * by the first one's agents, and the diff path is stable across runs, so the
 * collision is silent. Pass the plan's mtime.
 */
export declare function readTranscripts(since?: number, env?: NodeJS.ProcessEnv, diffPath?: string): AgentRecord[];
/**
 * Was this agent given any way to reach the diff?
 *
 * The launch prompt is the harness's record of what the orchestrator actually
 * asked for. A chunk agent whose prompt never names the diff file could not have
 * read it, however confident its answer sounds — and 23 of 23 real ones were
 * launched exactly that way, then said the sentence their prompt had handed them.
 *
 * This is checked against the *prompt*, not the agent's behaviour, because it
 * names the actor that actually failed. "Relaunch the agent" cannot fix a prompt
 * with no diff in it; the second launch is as blind as the first.
 */
export declare function wasGivenTheDiff(rec: AgentRecord, diffPath: string): boolean;
