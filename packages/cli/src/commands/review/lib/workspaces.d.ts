/**
 * @license
 * Copyright 2026 Qwen Team
 * SPDX-License-Identifier: Apache-2.0
 */
/** One workspace package, as its own `package.json` describes it. */
export interface WorkspacePackage {
    /** Repo-relative directory, e.g. `packages/cli`. */
    dir: string;
    /** The npm package name, e.g. `@hoptrendy/cli`. */
    name: string;
    /** Script names it defines (`build`, `test`, …). */
    scripts: string[];
    /** The names of the other workspace packages it depends on. */
    deps: string[];
}
/**
 * Does `npm test --workspaces` reach this file?
 *
 * A test outside every workspace glob is collected by nothing. This is the whole
 * of the #6486 unreachability finding, and it needs no execution at all — just
 * the root `package.json`.
 *
 * Globs here are npm workspace globs, not full minimatch: a trailing `/*` means
 * "one path segment", a leading `!` excludes. Anything fancier is treated as a
 * literal prefix, which errs toward calling a file REACHABLE — the safe
 * direction, since a false "unreachable" finding would be posted to a PR.
 */
export declare function isWorkspaceMember(filePath: string, workspaceGlobs: string[]): boolean;
/**
 * The workspace directory that owns `filePath`, or null when none does.
 *
 * npm evaluates the globs IN ORDER and the last match wins — a positive glob
 * listed after a negation re-includes what the negation excluded. Walking them in
 * order is what lets `packages/*` own `packages/cli` while an explicitly-listed
 * `packages/channels/base` still wins over it for its own subtree: both match,
 * and the later, more specific entry is the one that decides. A two-pass filter
 * (all negations, then all positives) would let a negation win wherever it sat.
 */
export declare function workspaceDirFor(filePath: string, workspaceGlobs: string[]): string | null;
/**
 * Does the workspace list use a glob shape `workspaceDirFor` does not model?
 *
 * The walker handles exactly two shapes: a literal path, and a single trailing
 * one-segment star (`packages/` then `*`). npm also permits a globstar
 * (`packages/` then `**`), a prefix star (`packages/foo-`then `*`), and a star in
 * the middle of a path — and for those the walker matches nothing, so a diff
 * inside them yields an EMPTY affected set and the report says "no package to
 * build", a confident false green for the one deterministic check a review has.
 * A caller that cannot model the layout should fall back (report `unsupported`)
 * rather than silently pass, so this flags the shapes it must not guess about.
 */
export declare function hasUnmodeledWorkspaceGlob(globs: string[]): boolean;
/** The `workspaces` globs from a repo root's `package.json` (empty when none). */
export declare function readWorkspaceGlobs(root: string): string[];
/**
 * The root package itself, when there are no workspaces — a single-package repo.
 *
 * The most common npm repo shape has no `workspaces` field at all. Treating it as
 * one root package (dir `.`) keeps the install, the scoped deadline, and the
 * timeout-as-data semantics for that case, instead of dropping it to a fallback
 * that no longer installs. Returns null when the root has no build/test script to
 * run — there is nothing to scope, and the brief's precedence list takes over.
 */
export declare function readRootPackage(root: string): WorkspacePackage | null;
/** Expand the globs against the tree: every workspace package that exists. */
export declare function readWorkspacePackages(root: string): WorkspacePackage[];
/** The workspace dirs a change set touches, in stable order. */
export declare function affectedWorkspaces(changedFiles: string[], workspaceGlobs: string[]): string[];
/**
 * The build set: every affected workspace, everything it depends on, and
 * everything that depends on it — ordered dependencies-first.
 *
 * Dependents are in the set on purpose. A package's consumers compile against its
 * built types, so a breaking API change surfaces at *their* compile and nowhere
 * else. A build scoped to the changed package alone would come back green and
 * have compiled none of the code the change can actually break.
 *
 * `alsoBuild` is for packages the **compiler** asked for — the ones the declared
 * graph did not predict (see `build-test`'s widening loop). They are dependencies,
 * not changed code, and the distinction is the whole of this parameter: feeding
 * one back in as `affected` makes its consumers "dependents of a changed package"
 * and drags them in too. Measured on PR #6866: widening with `web-templates` that
 * way took the build set from 6 packages to 15 and built the CLI, which the PR
 * does not touch.
 */
export declare function buildSetFor(affected: string[], packages: WorkspacePackage[], alsoBuild?: string[]): string[];
