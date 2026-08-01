/**
 * @license
 * Copyright 2026 Qwen Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { TranscriptsUnavailableError } from './transcripts.js';
export interface CoverageFromTranscripts {
    /** True only when every chunk was reviewed by an agent that could and did. */
    ok: boolean;
    /** How many subagent transcripts the harness wrote for this run. */
    agents: number;
    /**
     * Chunk agents launched with a prompt that never named the diff.
     *
     * They cannot have read it. This is not a whiff and must not be reported as
     * one: relaunching an agent whose prompt has no diff in it produces a second
     * agent that also cannot read the diff. The prompt is the defect.
     */
    blindAgents: string[];
    /** Agents that made no successful tool call: they read nothing. */
    idleAgents: string[];
    /**
     * Agents pointed at diff lines that never opened the diff.
     *
     * They worked — they just worked on something else. An agent handed chunk 3 and
     * a diff path, which then spends its run grepping the source tree, has reviewed
     * the post-change file and not the change. The old check credited it: any one
     * successful call was enough.
     */
    unopenedAgents: string[];
    /**
     * Chunks whose agent got something other than the prompt the CLI built for it.
     *
     * "Pass what it prints to the agent verbatim" is prose, and prose is what this
     * skill keeps discovering it cannot rely on. Dogfooded, the orchestrator invoked
     * `agent-prompt` for all five chunks and then **paraphrased** what came back:
     * the delivered prompt had dropped the instruction not to recite a stock
     * sentence, dropped the half-read warning, and replaced the project's review
     * rules with a three-sentence summary of its own.
     */
    rewrittenPrompts: string[];
    /**
     * Agents the plan requires that this review did not launch.
     *
     * Every other field here asks a question of an agent that ran. An agent that did
     * not run leaves no transcript to ask, so its absence is invisible — which is how
     * a real PR review shipped having never launched Agent 0 at all, on a review whose
     * job includes asking whether the PR fixes the thing it claims to. The roster is
     * derived from the plan; nothing in it is supplied by the caller.
     */
    missingRoles: string[];
    /**
     * The exact `agent-prompt` selector that rebuilds each missing brief, in the
     * same order as its `missingRoles` entries would list them per-role. For
     * stderr, never for the body: a human-facing label does not name its role id.
     */
    missingRoleSelectors: string[];
    /**
     * Required agents that never opened the brief they were pointed at.
     *
     * The launch prompt names the brief rather than containing it — a 4 652-character
     * prompt is not something an orchestrator pastes twelve times, and the run that
     * was asked to delivered 2 893 characters of it. So the instructions arrive only
     * if the agent reads the file. Whether it did is a tool call, and the harness
     * wrote it down.
     */
    unreadBriefs: string[];
    /** Chunk ids no working agent covered. */
    missingChunks: number[];
    /** Chunk ids an agent declared unreachable. */
    uncoverableChunks: number[];
    /** Chunk ids a working agent actually reviewed. */
    coveredChunks: number[];
}
/**
 * What the agents of this run actually did, as the harness recorded it.
 *
 * Nothing here is supplied by the caller except the plan path. The transcripts
 * are found from the environment the CLI exported; their contents are the
 * harness's, written at launch and flushed per event.
 *
 * Transcripts older than the plan are ignored. The transcript directory is scoped
 * to the session, not the review, and nothing prunes it — so a second `/review`
 * in one session would otherwise be satisfied by the first one's agents. The diff
 * path is stable across runs, which makes that collision silent.
 */
export declare function coverageFromTranscripts(planPath: string, env?: NodeJS.ProcessEnv): CoverageFromTranscripts;
export interface VerificationReport {
    /** True when every required Step 4/5 agent ran and read its brief. */
    ok: boolean;
    /**
     * Self-explanatory gap lines, shaped to drop straight into
     * `unreviewedDimensions` — each carries its own ` — ` reason, so
     * `compose-review` renders it verbatim rather than appending the whiff sentence.
     * These reach the POSTED review body: author-facing register, no internal
     * commands.
     */
    gaps: string[];
    /**
     * The per-shape fix for each gap, in the same order — for stderr, where the
     * orchestrator reads. Never rendered into the body.
     */
    remediation: string[];
}
/**
 * Did Step 4 (verify) and Step 5 (reverse audit) actually run, and read their
 * briefs?
 *
 * `check-coverage` proves Step 3 was done — but it runs at Step 3D, *before* these
 * two, so its roster (`requiredAgents`) cannot reach them. And their count is not
 * in the plan: verify shards on the finding count (`ceil(N/8)`), reverse audit
 * loops until it goes dry. So this is not an exact roster — it is a floor, and it
 * is asked only by `compose-review`, which runs only at high effort. A low/medium
 * quick pass has no verify and no reverse audit, and never reaches here (it emits
 * no verdict, so it calls no `compose-review`).
 *
 * The floor is deliberately one agent per step, for the failure it exists to catch:
 * the step skipped **wholesale**, or run with agents that never opened their brief —
 * the same silent omission the rest of this file is a response to. Per-chunk
 * completeness of a Step 3B reverse audit is the orchestrator's Step 5 loop
 * contract, disclosed through `unreviewedDimensions` when a scope is left
 * outstanding; this does not re-litigate it.
 *
 * Like everything here, nothing is supplied by the caller but the plan path. The
 * proof is the intersection of two artifacts with different authors: the prompt the
 * CLI recorded building (`reverse-audit` / `reverse-audit--chunk-N` / `verify`) and
 * the harness's transcript of an agent launched with it that opened its brief.
 */
export declare function verificationGaps(planPath: string, opts: {
    postsFindings: boolean;
}, env?: NodeJS.ProcessEnv): VerificationReport;
export { TranscriptsUnavailableError };
