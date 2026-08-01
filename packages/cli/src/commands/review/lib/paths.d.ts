/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
export declare const REVIEW_TMP_DIR: string;
export declare const REVIEWS_DIR: string;
export declare const REVIEW_CACHE_DIR: string;
/** Worktree path for a given PR review session. */
export declare function worktreePath(prNumber: string | number): string;
/**
 * The disposable worktree the test-efficacy probe runs in — a sibling of the
 * shared review worktree, discarded wholesale when the probe finishes (#6832).
 *
 * The one exception to this file's "paths are relative to the project root"
 * rule: this returns an ABSOLUTE path. The probe drives `git worktree add`/
 * `remove` with the shared worktree as cwd, so a relative path would resolve
 * against that worktree, not the repo root, and land the probe tree nested
 * inside the tree it is meant to sit beside. Both call sites — the probe and
 * `cleanup.ts`'s stale-tree sweep — go through here so the `-probe` suffix and
 * this normalisation stay in one place; renaming the suffix in one file used to
 * silently stop the other from sweeping.
 */
export declare function probeWorktreePath(worktree: string): string;
/** Local branch ref name for a fetched PR head. */
export declare function reviewBranch(prNumber: string | number): string;
/**
 * Per-target side-file path (review JSON, PR context, presubmit report).
 *
 * Files live under `.hopcode/tmp/` rather than the OS temp dir so the path is
 * stable across platforms (macOS's `os.tmpdir()` returns `/var/folders/...`,
 * not `/tmp` — using the project-local dir avoids that mismatch entirely)
 * and so they're scoped to the project rather than the user's whole machine.
 */
export declare function tmpFile(target: string, suffix: string): string;
/** Filename prefix used by `tmpFile`; useful for cleanup globbing. */
export declare function tmpPrefix(target: string): string;
