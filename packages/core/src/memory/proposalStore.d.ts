/**
 * @license
 * Copyright 2026 HopCode Team (adapted from protoCLI)
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Returns the proposals directory for the given project root.
 * If no projectRoot is provided, falls back to global `~/.hopcode/evolve/proposals`.
 */
export declare function getProposalsDir(projectRoot?: string): string;
export interface Proposal {
    filename: string;
    filePath: string;
    content: string;
    mtimeMs: number;
}
/**
 * Lists all pending proposals in the proposals directory.
 */
export declare function listProposals(projectRoot?: string): Promise<Proposal[]>;
/**
 * Writes a proposal markdown file.
 */
export declare function writeProposal(filename: string, content: string, projectRoot?: string): Promise<string>;
/**
 * Deletes (rejects) a proposal file.
 */
export declare function rejectProposal(filePath: string): Promise<boolean>;
