/**
 * @license
 * Copyright 2026 Qwen Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type { CommandModule } from 'yargs';
import { isWorkspaceMember } from './lib/workspaces.js';
export type ProbeVerdict = 'gated' | 'inert' | 'inconclusive';
export interface FileEntry {
    path: string;
    kind: string;
}
export { isWorkspaceMember };
export interface EfficacyPlan {
    /** Test files the diff adds or changes that the test command never collects. */
    unreachable: string[];
    /** Test files worth probing — they are reachable, so they can be run. */
    probes: string[];
    /** Production files to revert to base for the probe. */
    revert: string[];
}
/**
 * Split the diff into what to report and what to run.
 *
 * A diff with no source changes has nothing to gate, so it gets no probe: a
 * test-only PR (a new test for old code) must not be told its tests are inert.
 */
export declare function planTestEfficacy(files: FileEntry[], workspaceGlobs: string[]): EfficacyPlan;
/**
 * Rule on the revert probe, **per test file**.
 *
 * Per-file, not per-run, and that distinction is load-bearing. One `vitest run`
 * covers every probe at once, but a run-level verdict lets one honest test cover
 * for a useless one: the gating test fails, the run reports failures, and the
 * inert test sitting beside it is scored `gated` too. Every inert test with a
 * working sibling would be invisible — which is the exact defect this command
 * exists to find. (Found by running it, not by unit-testing it. The unit tests
 * for the run-level classifier all passed.) `testResults[].name` carries the
 * file, so the mapping is available; use it.
 *
 * The three-way asymmetry is deliberate:
 *
 * - `inert` — this file's tests PASSED with the source change reverted. They do
 *   not gate the change. This is a finding.
 * - `gated` — at least one ASSERTION in this file failed. It caught the revert;
 *   it is doing its job. Requires a real assertion failure, never a bare
 *   non-zero exit: reverting source routinely breaks a test's own compile (it
 *   imports a symbol the diff introduced), and a compile error proves nothing
 *   about whether the test would catch a behavioural regression.
 * - `inconclusive` — everything else: the file collected nothing, an
 *   import/type error, unparseable output. Do NOT let this read as `gated`; a
 *   review that mistakes "it errored" for "it caught the bug" is back where it
 *   started.
 */
export declare function classifyProbeRun(exitCode: number, stdout: string, probes: string[], stderr?: string): Array<{
    file: string;
    verdict: ProbeVerdict;
    detail: string;
}>;
/**
 * Remove `join(worktree, relPath)` without following a PR-controlled symlink.
 *
 * `rmSync` follows symlinks in the path PREFIX, and the revert set is
 * PR-controlled: a diff that turns `dir` into a symlink to an outside directory
 * and has the probe delete `dir/victim` would make `rmSync` follow `dir` and
 * delete the outside file — a real P0 a reviewer reproduced. The lexical
 * `escapes the worktree` guard cannot catch it, because `dir/victim` is lexically
 * inside the tree; the escape happens at runtime through the link.
 *
 * So walk every component from the worktree root down and refuse if any
 * ANCESTOR is a symlink — the target must be reachable through real directories
 * only. The final component being a symlink is fine: `rmSync` unlinks the link
 * itself, not what it points at, which is exactly what reverting an added
 * symlink should do. A missing component means there is nothing to remove
 * (`force` rm is already a no-op there), so return quietly.
 */
export declare function safeRmWithin(worktree: string, relPath: string): void;
/**
 * The `inconclusive` detail for a probe worktree that could not be created.
 *
 * Pure, and extracted for that reason: the branch it lives on fires only when
 * `git worktree add` fails, and there is no portable way to force that in a
 * real-git test — the one lever (making `.git/worktrees` unwritable) is bypassed
 * by root and behaves differently under CI's unprivileged user, so a test built
 * on it would assert one thing locally and another in CI. The composition is the
 * part with logic in it, so it is testable here on its own.
 *
 * The stale-sweep's stderr is folded in because it is usually the explanation:
 * when `add` fails on a leftover the sweep could not clear, the sweep is what
 * says why.
 */
export declare function probeCreateFailureDetail(err: unknown, sweepStderr: string): string;
/**
 * The warning for a probe worktree that survived its discard.
 *
 * Pure, and for the same reason as its sibling above: the branch it lives on
 * fires only when the path outlives both `worktree remove` and `rmSync`, which
 * no portable test can force. The reason is what makes it useful — whoever has
 * to delete the tree by hand needs to know WHY it would not go, and a bare
 * "could not remove <path>" tells them nothing. Prefer the exception (`rmSync`
 * hit EPERM/EBUSY); fall back to what git said when it refused to unregister.
 */
export declare function probeCleanupFailureDetail(probeTree: string, removeError: unknown, sweepStderr: string): string;
export declare const testEfficacyCommand: CommandModule;
