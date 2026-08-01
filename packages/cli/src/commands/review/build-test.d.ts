/**
 * @license
 * Copyright 2026 Qwen Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type { CommandModule } from 'yargs';
import { type WorkspacePackage } from './lib/workspaces.js';
/** A command this run actually executed, and what it did. */
export interface CommandResult {
    command: string;
    /** `null` when the command was killed by the deadline. */
    exitCode: number | null;
    seconds: number;
    timedOut: boolean;
    /** Trimmed output: enough to correlate a failure with the diff. */
    output: string;
}
export interface BuildTestReport {
    /** `npm` when the workspace scoping applied; `unsupported` otherwise. */
    toolchain: 'npm' | 'unsupported';
    /** Workspace dirs the diff changed. */
    affected: string[];
    /** What was built, dependencies first — after any widening. */
    buildSet: string[];
    /** Packages the compiler asked for that the dependency graph had not predicted. */
    widenedWith: string[];
    install: CommandResult | null;
    build: CommandResult[];
    test: CommandResult[];
    /**
     * True when every build and test command exited 0. An install that exits non-zero
     * but leaves a usable tree (a failed `prepare` hook) does NOT set this false — the
     * build below is the authoritative signal, and the `note` explains the install.
     */
    ok: boolean;
    /**
     * Commands killed by the deadline. These are NOT findings: a review must not
     * file "the build timed out" as a defect in someone's pull request.
     */
    timedOut: string[];
    /** Why the run did what it did, in one line — rendered into the agent's report. */
    note: string;
}
/**
 * The environment every build/test/install command runs under.
 *
 * `QWEN_SKIP_PREPARE` is the load-bearing entry, and it is exported and tested so
 * a future edit to this env cannot silently drop it. Without it, `npm ci` builds
 * the whole project through this repo's `prepare` hook — `npm run build` + `npm
 * run bundle` over every workspace, ~190s — which is entirely wasted, because this
 * command does its own *scoped* build right after. `prepare.js` reads this exact
 * flag, and its own comment names this exact case: "Release workflow jobs set this
 * when they run explicit build/bundle steps after npm ci." In a TUI A/B on PR
 * #6866 the install-time full build was the single largest thing left in Agent 7.
 * Harmless on any repo that does not read it.
 */
export declare function buildRunEnv(base?: NodeJS.ProcessEnv): NodeJS.ProcessEnv;
/**
 * Workspace packages the compiler said it could not resolve.
 *
 * Only names that belong to a workspace of *this* repo are returned. A missing
 * third-party module is a broken install or a genuine defect in the diff — not
 * something a wider build set can fix — and widening on it would loop.
 */
export declare function unresolvedWorkspaceDeps(output: string, packages: WorkspacePackage[]): string[];
interface BuildTestArgs {
    plan: string;
    worktree: string;
    out?: string;
    timeout: number;
    install: boolean;
    /**
     * How to run a command. Injectable so the tests can build the states that are
     * hard to force out of real npm — chiefly the one that cost a live review: an
     * install that exits non-zero and leaves a working `node_modules` behind.
     */
    exec?: (command: string, cwd: string, timeoutMs: number) => CommandResult;
}
export declare function runBuildTest(args: BuildTestArgs): BuildTestReport;
export declare const buildTestCommand: CommandModule;
export {};
