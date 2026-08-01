/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { writeStdoutLine, writeStderrLine } from '../../utils/stdioHelpers.js';
import { ensureAuthenticated, gh, setGhHost } from './lib/gh.js';
import { git, gitOpt, gitRaw, refExists, releaseWorktree } from './lib/git.js';
import { PINNED_DIFF_CONFIG, PINNED_DIFF_FLAGS } from './lib/diff-flags.js';
import { REVIEW_TMP_DIR, reviewBranch, tmpFile, worktreePath, } from './lib/paths.js';
import { buildDiffPlan, DEFAULT_MAX_CHUNK_LINES, READ_FILE_CHAR_CAP, } from './lib/diff-plan.js';
import { buildPlanReport, warnOnReportSize, stringifyPlanReport, } from './lib/report.js';
import { resolveMergeBase } from './lib/merge-base.js';
/** Count lines of `<ref>:<path>`, or 0 if it does not exist there. */
function fileLineCount(ref, path) {
    try {
        const buf = gitRaw('show', `${ref}:${path}`);
        if (buf.length === 0)
            return 0;
        let n = 0;
        for (const b of buf)
            if (b === 0x0a)
                n++;
        // A final line without a trailing newline still counts.
        return buf[buf.length - 1] === 0x0a ? n : n + 1;
    }
    catch {
        return 0; // absent at this ref: created by the PR, or deleted by it
    }
}
/** The real git surface `resolveMergeBase` runs against. */
const gitProbe = {
    fetch: (remote, ref) => gitOpt('fetch', remote, ref) !== null,
    refExists,
    mergeBase: (a, b) => gitOpt('merge-base', a, b),
};
function tryRemove(action) {
    try {
        action();
    }
    catch {
        /* idempotent — silent on missing target */
    }
}
function cleanStale(prNumber) {
    releaseWorktree(worktreePath(prNumber));
    const ref = reviewBranch(prNumber);
    if (refExists(ref)) {
        tryRemove(() => execFileSync('git', ['branch', '-D', ref], { stdio: 'pipe' }));
    }
}
async function runFetchPr(args) {
    const { pr_number: prNumber, owner_repo: ownerRepo, remote, out } = args;
    if (ownerRepo.indexOf('/') < 0) {
        throw new Error('owner_repo must look like "owner/repo"');
    }
    ensureAuthenticated();
    // 1. Clean any stale worktree / branch from an earlier run.
    cleanStale(prNumber);
    // 2. Fetch PR HEAD into a unique local ref.
    const ref = reviewBranch(prNumber);
    try {
        git('fetch', remote, `pull/${prNumber}/head:${ref}`);
    }
    catch (err) {
        throw new Error(`Failed to fetch PR #${prNumber} from remote "${remote}": ${err.message}`);
    }
    const fetchedSha = git('rev-parse', ref);
    // 3. Fetch PR metadata via gh CLI. Cross-repo flag tells the LLM whether
    //    to switch into lightweight mode.
    let meta;
    try {
        const json = gh('pr', 'view', prNumber, '--repo', ownerRepo, '--json', 'headRefName,headRefOid,baseRefName,additions,deletions,changedFiles,isCrossRepository');
        meta = JSON.parse(json);
    }
    catch (err) {
        // Roll back the fetched ref so the next run starts clean.
        tryRemove(() => execFileSync('git', ['branch', '-D', ref], { stdio: 'pipe' }));
        throw new Error(`Failed to fetch PR #${prNumber} metadata: ${err.message}`);
    }
    // 4. Create the ephemeral worktree.
    const wt = worktreePath(prNumber);
    try {
        mkdirSync(dirname(wt), { recursive: true });
        git('worktree', 'add', wt, ref);
    }
    catch (err) {
        tryRemove(() => execFileSync('git', ['branch', '-D', ref], { stdio: 'pipe' }));
        throw new Error(`Failed to create worktree at ${wt}: ${err.message}`);
    }
    mkdirSync(REVIEW_TMP_DIR, { recursive: true });
    // 5. Capture the diff to a file and partition it. Written as raw bytes:
    //    CRLF normalisation would rewrite every hunk of a CRLF file, and the
    //    diff must keep its trailing newline to stay a valid patch.
    const { sha: mergeBaseSha, baseFetchFailed } = resolveMergeBase(remote, meta.baseRefName, ref, gitProbe);
    if (baseFetchFailed) {
        writeStderrLine(`WARNING: could not fetch ${remote}/${meta.baseRefName}. The merge-base ` +
            `is resolved from a possibly stale local ref, so the diff may not be ` +
            `the one under review.`);
    }
    const diffRel = tmpFile(`pr-${prNumber}`, 'diff.txt');
    let diffPath = null;
    let diffPathAbsolute = null;
    let diffText = '';
    if (mergeBaseSha) {
        try {
            // Every knob user config could turn is pinned in `lib/diff-flags.ts`,
            // shared with `capture-local` so the two capture paths cannot drift into
            // producing diffs that parse differently.
            const buf = gitRaw(...PINNED_DIFF_CONFIG, 'diff', ...PINNED_DIFF_FLAGS, `${mergeBaseSha}..${fetchedSha}`);
            writeFileSync(diffRel, buf);
            diffText = buf.toString('utf8');
            diffPath = diffRel;
            diffPathAbsolute = resolve(diffRel);
        }
        catch (err) {
            writeStderrLine(`Failed to capture diff: ${err.message}`);
        }
    }
    else {
        writeStderrLine(`Could not resolve merge-base of ${meta.baseRefName} and ${ref}; ` +
            `agents will have to fall back to running \`git diff\` themselves.`);
    }
    // `buildDiffPlan` throws when the chunks do not tile the diff — a coverage
    // hole. That must be loud, but it must not take the whole review with it: the
    // throw would fire after the worktree exists and before any report is
    // written. Degrade to the documented `diffPath: null` path instead, which
    // tells the skill to fall back and warn the user that coverage is partial.
    let plan;
    try {
        plan = buildDiffPlan(diffText, args.maxChunkLines);
    }
    catch (err) {
        writeStderrLine(`WARNING: could not partition the diff (${err.message}). ` +
            `Falling back to a diff-less report; coverage will be partial.`);
        diffPath = null;
        diffPathAbsolute = null;
        plan = buildDiffPlan('', args.maxChunkLines);
    }
    // 6. Emit the report.
    const result = {
        prNumber,
        ownerRepo,
        remote,
        ref,
        fetchedSha,
        worktreePath: wt,
        baseRefName: meta.baseRefName,
        headRefName: meta.headRefName,
        isCrossRepository: meta.isCrossRepository,
        diffStat: {
            files: meta.changedFiles,
            additions: meta.additions,
            deletions: meta.deletions,
        },
        mergeBaseSha,
        baseFetchFailed,
        diffPath,
        diffPathAbsolute,
        ...buildPlanReport(plan, (path) => fileLineCount(fetchedSha, path)),
    };
    writeFileSync(out, stringifyPlanReport(result), 'utf8');
    writeStdoutLine(`Wrote fetch-pr report to ${out}`);
    if (diffPath)
        writeStdoutLine(`Wrote review diff to ${diffPath}`);
    // Surface diff stats to stderr so a human running the command interactively
    // sees something useful even without inspecting the JSON.
    writeStderrLine(`PR #${prNumber} (${ownerRepo}): ${meta.changedFiles} files, +${meta.additions}/-${meta.deletions}, base=${meta.baseRefName}, head=${meta.headRefName}`);
    warnOnReportSize(out, READ_FILE_CHAR_CAP);
    writeStderrLine(`Diff: ${plan.diffLines} lines (${plan.srcDiffLines} source, ` +
        `${plan.testDiffLines} test, ${plan.docsDiffLines} docs, ` +
        `${plan.generatedDiffLines} generated) ` +
        `/ ${plan.diffChars} chars -> ${plan.chunks.length} review chunk(s)`);
    const heavy = result.files.filter((f) => f.heavy);
    if (heavy.length > 0) {
        writeStderrLine(`Heavily rewritten (whole-file invariant review): ${heavy
            .map((f) => `${f.path} (${f.changedLines}L, ${f.rewriteRatio})`)
            .join(', ')}`);
    }
}
export const fetchPrCommand = {
    command: 'fetch-pr <pr_number> <owner_repo>',
    describe: 'Prepare a PR review worktree: clean stale state, fetch the PR HEAD, create a worktree, and write a JSON state report',
    builder: (yargs) => yargs
        .positional('pr_number', {
        type: 'string',
        demandOption: true,
        describe: 'PR number',
    })
        .positional('owner_repo', {
        type: 'string',
        demandOption: true,
        describe: 'GitHub "owner/repo"',
    })
        .option('remote', {
        type: 'string',
        default: 'origin',
        describe: 'Git remote to fetch from (use "upstream" for fork-based workflows)',
    })
        .option('out', {
        type: 'string',
        demandOption: true,
        describe: 'Output JSON path (will be overwritten)',
    })
        .option('host', {
        type: 'string',
        describe: 'GitHub host for this PR (GitHub Enterprise). Routes every gh call in this command via GH_HOST; omit for github.com.',
    })
        .option('max-chunk-lines', {
        type: 'number',
        default: DEFAULT_MAX_CHUNK_LINES,
        describe: 'Target size, in diff lines, of each review chunk. A chunk boundary falls on a hunk boundary; a hunk larger than this is split only at a top-level declaration, never inside a function.',
    }),
    handler: async (argv) => {
        setGhHost(argv.host);
        await runFetchPr(argv);
    },
};
//# sourceMappingURL=fetch-pr.js.map