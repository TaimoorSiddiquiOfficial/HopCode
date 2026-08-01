/**
 * @license
 * Copyright 2026 Qwen Team
 * SPDX-License-Identifier: Apache-2.0
 */
export function reviewMode(plan) {
    if (typeof plan.worktreePath === 'string' && plan.worktreePath) {
        return 'pr-worktree';
    }
    if (Array.isArray(plan.untrackedFiles))
        return 'local';
    return 'diff-only';
}
/**
 * The topology gate, in code.
 *
 * The same two numbers the skill's prose turns on. It is here so the roster and
 * the reader cannot disagree about which fan-out was owed — a disagreement that
 * would show up as a review being told it forgot eleven agents it was never
 * supposed to launch.
 */
export function isTerritoryFanOut(plan) {
    const src = Number(plan.srcDiffLines ?? 0);
    const total = Number(plan.diffLines ?? 0);
    return !(src <= 500 && total <= 3200);
}
/** Does the diff remove or replace anything? If not, 1b has nothing to audit. */
function hasDeletions(plan) {
    const files = Array.isArray(plan.files) ? plan.files : [];
    // No `files[]` at all is not "no deletions" — it is "we do not know", and the
    // safe answer to that is to run the audit. An agent with nothing to find costs
    // one return; a removed guard nobody looked for costs whatever it was guarding.
    if (files.length === 0)
        return true;
    return files.some((f) => Number(f?.removedLines ?? 0) > 0);
}
/** A PR number the plan actually resolved: a positive integer, as a number or the
 *  string `fetch-pr` writes. `null`, `0`, `''` and non-numeric junk are 'no PR'. */
function isPositivePrNumber(value) {
    if (typeof value === 'number')
        return Number.isInteger(value) && value > 0;
    if (typeof value === 'string')
        return /^\d+$/.test(value) && Number(value) > 0;
    return false;
}
/** Source files rewritten heavily enough that the diff is the wrong frame. */
function heavyFiles(plan) {
    const files = Array.isArray(plan.files) ? plan.files : [];
    return files
        .filter((f) => f?.heavy === true && typeof f.path === 'string')
        .map((f) => f.path);
}
/**
 * Every agent this plan requires, and the key each one's prompt is recorded under.
 *
 * Maxima are not requirements: Agent 8 is optional by construction ("launch none
 * when no domain stands out — the common case"), so it is not here. Nothing in this
 * list is discretionary. If a role is in it, a review that did not launch it has a
 * dimension nobody reviewed, and must not certify the diff.
 */
export function requiredAgents(plan) {
    const mode = reviewMode(plan);
    const out = [];
    const add = (role, file) => out.push({ key: file ? `${role}--${file}` : role, role, file });
    // Issue fidelity needs a pull request to fetch, and the PR number is only in the
    // plan when the review resolved one locally. A cross-repo lightweight review does
    // run Agent 0 — it is pure GitHub API — but its plan does not carry the number,
    // so this cannot require it, and says so rather than pretending.
    // A positive PR number, not merely `!== undefined`: a plan carrying
    // `prNumber: null`, `0` or `''` is 'no PR resolved', and requiring Agent 0 for
    // it would block a review over an issue agent that had nothing to fetch.
    // `fetch-pr` writes the number as a STRING (`"6766"`), so accept a numeric
    // string as well as a number — checking `typeof === 'number'` alone would drop
    // Agent 0 from every real PR review.
    // Any mode, not just pr-worktree: a lightweight cross-repo plan now carries
    // the PR identity too (plan-diff --pr/--repo, passed only when pr-context
    // succeeded), and a review that fetched the PR's context owes the
    // issue-fidelity pass regardless of whether it has a worktree. Both halves of
    // the identity, because the brief builder needs both — requiring an agent
    // nobody could build would wedge the run.
    if (isPositivePrNumber(plan.prNumber) && typeof plan.ownerRepo === 'string') {
        add('0');
    }
    if (isTerritoryFanOut(plan)) {
        // Step 3B: one agent per territory, plus the agents no territory can see. A
        // chunk agent owns every dimension *for its own lines*, so 1a and 2–6 do not
        // run as whole-diff agents here — but the test matrix does, because a chunk
        // agent sees either an implementation or its test, rarely both.
        const chunks = Array.isArray(plan.chunks) ? plan.chunks : [];
        for (const c of chunks) {
            if (Number.isSafeInteger(c?.id)) {
                out.push({
                    key: `chunk-${c.id}`,
                    role: 'chunk',
                    chunk: c.id,
                });
            }
        }
        add('test-matrix');
    }
    else {
        // Step 3A: every dimension, each walking the whole diff.
        add('1a');
        add('2');
        add('3');
        add('4');
        add('5');
        add('6a');
        add('6b');
        add('6c');
    }
    // Both topologies. 1b owns the deleted side; 1c owns the cross-file walk and
    // needs a tree to grep.
    if (hasDeletions(plan))
        add('1b');
    if (mode !== 'diff-only') {
        add('1c');
        add('7');
    }
    // A largely-rewritten file is not reviewable as a diff: the two ends of an
    // invariant sit two thousand lines apart. Three agents, one checklist slice each
    // — measured, one agent holding all eight checks found one of five defects and
    // the same model split three ways found all five.
    //
    // **Step 3B only.** `heavy` is decided independently of topology (`lib/heavy.ts`):
    // a 300-line source file with ~120 changed lines clears the rewrite-ratio branch
    // while `srcDiffLines` stays under 500 — a Step 3A review. Step 3A launches no
    // invariant agents (its dimension agents each walk the whole diff, so they
    // already see both ends of a file), and the skill's 3A section never mentions
    // them. Requiring them there demanded agents the review was never meant to launch,
    // and `check-coverage` then exit-3'd an otherwise-complete small PR. Gate the loop
    // on the topology that actually runs them.
    if (isTerritoryFanOut(plan)) {
        for (const file of heavyFiles(plan)) {
            add('invariant-a', file);
            add('invariant-b', file);
            add('invariant-c', file);
        }
    }
    return out;
}
//# sourceMappingURL=roster.js.map