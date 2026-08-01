/**
 * @license
 * Copyright 2026 Qwen Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type { RoleId } from './agent-briefs.js';
/**
 * How this review's diff was captured — which decides what can be asked of it.
 *
 * Inferred from the fields the capturing command wrote, rather than taken as an
 * argument: `fetch-pr` alone creates a worktree, `capture-local` alone reports the
 * untracked files it swept in, and `plan-diff` — the cross-repo lightweight path —
 * writes neither, because it has neither a pull request it can reach locally nor a
 * tree to look at.
 */
export type ReviewMode = 
/** Same-repo PR: a worktree, a PR number, a local tree to build and grep. */
'pr-worktree'
/** Uncommitted local changes or a single file: a tree, but no PR. */
 | 'local'
/** Cross-repo lightweight: the diff and nothing else. */
 | 'diff-only';
/** The plan, as far as the roster needs it. */
export interface RosterPlan {
    ownerRepo?: unknown;
    chunks?: Array<{
        id?: unknown;
    }>;
    files?: Array<{
        path?: unknown;
        kind?: unknown;
        heavy?: unknown;
        removedLines?: unknown;
    }>;
    srcDiffLines?: unknown;
    diffLines?: unknown;
    worktreePath?: unknown;
    prNumber?: unknown;
    untrackedFiles?: unknown;
}
/** One agent this review must launch. */
export interface RequiredAgent {
    /** The key `agent-prompt` records its prompt under, and coverage looks up. */
    key: string;
    /** A dimension role, or a Step 3B territory. */
    role: RoleId | 'chunk';
    /** The territory a chunk agent owns. */
    chunk?: number;
    /** The heavy file an invariant agent owns. */
    file?: string;
}
export declare function reviewMode(plan: RosterPlan): ReviewMode;
/**
 * The topology gate, in code.
 *
 * The same two numbers the skill's prose turns on. It is here so the roster and
 * the reader cannot disagree about which fan-out was owed — a disagreement that
 * would show up as a review being told it forgot eleven agents it was never
 * supposed to launch.
 */
export declare function isTerritoryFanOut(plan: RosterPlan): boolean;
/**
 * Every agent this plan requires, and the key each one's prompt is recorded under.
 *
 * Maxima are not requirements: Agent 8 is optional by construction ("launch none
 * when no domain stands out — the common case"), so it is not here. Nothing in this
 * list is discretionary. If a role is in it, a review that did not launch it has a
 * dimension nobody reviewed, and must not certify the diff.
 */
export declare function requiredAgents(plan: RosterPlan): RequiredAgent[];
