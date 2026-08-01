/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Tracks the current git branch (or a short commit hash when detached) for
 * `cwd`, read directly from `.git` via core's gitDirect helpers — no `git`
 * subprocess. Re-reads automatically when the repository's reflog moves
 * (branch switch, commit, reset).
 */
export declare function useGitBranchName(cwd: string): string | undefined;
