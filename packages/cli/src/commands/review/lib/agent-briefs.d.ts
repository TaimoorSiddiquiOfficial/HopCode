/**
 * @license
 * Copyright 2026 Qwen Team
 * SPDX-License-Identifier: Apache-2.0
 */
/** Every role this review can launch. Chunk agents are `chunk-<id>`. */
export type RoleId = '0' | '1a' | '1b' | '1c' | '2' | '3' | '4' | '5' | '6a' | '6b' | '6c' | '7' | 'test-matrix' | 'invariant-a' | 'invariant-b' | 'invariant-c' | 'verify' | 'reverse-audit';
export interface Brief {
    /** How the role is named to a human reading a coverage failure. */
    label: string;
    /**
     * Does a path rule belong in this agent's brief?
     *
     * The path-scoped checklists (see `path-rules.ts`) name defects in the *code*.
     * The agents that do not review code do not get them: Build & Test runs commands,
     * Issue Fidelity reads an issue, and the test matrix maps behaviours to tests.
     * Giving them a workflow-security checklist would be handing a syllabus to
     * somebody sitting a different exam.
     */
    reviewsCode?: boolean;
    /**
     * Does this agent read the diff?
     *
     * One does not, and it is not a defect: Build & Test runs commands, and its
     * evidence is their output. Everyone else who does not read the diff is a bug.
     */
    readsDiff: boolean;
    /**
     * What the agent returns, which decides the shared tail of its prompt.
     *
     * `'findings'` (the default) gets the finding format, the severity definitions
     * and the Exclusion Criteria. `'verdicts'` is the Step 4 verifier: it does not
     * file findings, it rules on the ones it was handed, so it gets the Exclusion
     * Criteria (a finding that matches one is rejected) but not the finding format —
     * its output shape is the verdict, and its brief defines that.
     */
    output?: 'findings' | 'verdicts';
    /**
     * May this role be launched `--role <r> --chunk <id>` to own one chunk's
     * territory, the way a Step 3B reverse auditor does?
     *
     * It is declarative for two readers. The command guard rejects `--chunk` on any
     * role that does not set it, so a new per-chunk role is a data change here, not a
     * name hardcoded in the guard. And the brief builder scopes such a role's diff
     * reads to its one chunk — a per-chunk agent whose brief still said "walk it
     * chunk by chunk" over all twenty chunks would read the whole diff the `--chunk`
     * design exists to spare it, because the brief is what the agent is told to obey.
     */
    acceptsChunk?: boolean;
    /**
     * May this role be launched `--role <r> --findings <file>`, folding a findings
     * list into the prompt the command prints?
     *
     * The verifier rules on findings; the reverse auditor avoids re-reporting them.
     * Both used to get their findings the same way: the command printed a launch
     * block and the orchestrator hand-prepended the list above it. Dogfooded, that
     * hand-assembly is where the prompt got paraphrased — the model added a round
     * number, inserted its own summary, and truncated the line telling it the brief
     * is authoritative — so the delivery check failed even though the agent opened
     * its brief. With this flag the command folds the findings in and prints one
     * block to paste, and there is no assembly step left to drift. The findings are
     * part of the recorded prompt (see runAgentPrompt), keyed per findings digest,
     * so a launch that drops or rewrites them matches no record.
     */
    acceptsFindings?: boolean;
    /** The agent-facing text. */
    brief: string;
}
export declare const BRIEFS: Record<RoleId, Brief>;
/** Roles that read the diff and therefore need the diff-reading block. */
export declare function readsDiff(role: RoleId): boolean;
