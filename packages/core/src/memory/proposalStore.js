/**
 * @license
 * Copyright 2026 HopCode Team (adapted from protoCLI)
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Minimal proposal store for HopCode.
 *
 * Proposals are drafted markdown files queued for user review.
 * They live under `<project>/.hopcode/evolve/proposals/` (project-scoped)
 * or `~/.hopcode/evolve/proposals/` (global).
 */
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { HOPCODE_DIR } from '../config/storage.js';
import * as os from 'node:os';
const EVOLVE_DIR = 'evolve';
const PROPOSALS_SUBDIR = 'proposals';
/**
 * Returns the proposals directory for the given project root.
 * If no projectRoot is provided, falls back to global `~/.hopcode/evolve/proposals`.
 */
export function getProposalsDir(projectRoot) {
    const base = projectRoot ?? os.homedir();
    return path.join(base, HOPCODE_DIR, EVOLVE_DIR, PROPOSALS_SUBDIR);
}
/**
 * Lists all pending proposals in the proposals directory.
 */
export async function listProposals(projectRoot) {
    const dir = getProposalsDir(projectRoot);
    let entries;
    try {
        entries = await fs.readdir(dir);
    }
    catch {
        return [];
    }
    const mdFiles = entries.filter((f) => f.endsWith('.md'));
    const results = [];
    await Promise.allSettled(mdFiles.map(async (filename) => {
        const filePath = path.join(dir, filename);
        try {
            const [content, stat] = await Promise.all([
                fs.readFile(filePath, 'utf-8'),
                fs.stat(filePath),
            ]);
            results.push({ filename, filePath, content, mtimeMs: stat.mtimeMs });
        }
        catch {
            // Skip unreadable files
        }
    }));
    return results.sort((a, b) => b.mtimeMs - a.mtimeMs);
}
/**
 * Writes a proposal markdown file.
 */
export async function writeProposal(filename, content, projectRoot) {
    const dir = getProposalsDir(projectRoot);
    await fs.mkdir(dir, { recursive: true });
    const filePath = path.join(dir, filename);
    await fs.writeFile(filePath, content, 'utf-8');
    return filePath;
}
/**
 * Deletes (rejects) a proposal file.
 */
export async function rejectProposal(filePath) {
    try {
        await fs.unlink(filePath);
        return true;
    }
    catch {
        return false;
    }
}
//# sourceMappingURL=proposalStore.js.map