/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type { CommandModule } from 'yargs';
interface CheckRun {
    name: string;
    status: string;
    conclusion: string | null;
    /** ISO timestamps from the API — how re-runs of one name are ordered. */
    started_at?: string | null;
    completed_at?: string | null;
    details_url?: string;
    html_url?: string;
}
interface CommitStatus {
    context: string;
    state: string;
}
export declare function classifyCi(checkRuns: CheckRun[], statuses: CommitStatus[]): {
    class: "all_pass" | "any_failure" | "all_pending" | "no_checks";
    failedCheckNames: string[];
    /**
     * Checks that never executed at this commit. NOT a downgrade on its own —
     * most are routing jobs, and a docs-only PR legitimately skips the test
     * matrix. It is a disclosure: Step 7 rules on whether a skipped check is
     * one that would have exercised THIS diff, which presubmit cannot know.
     */
    skippedCheckNames: string[];
    totalChecks: number;
};
export declare const presubmitCommand: CommandModule;
export {};
