/**
 * @license
 * Copyright 2026 Qwen Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type { CommandModule } from 'yargs';
export type ReviewEvent = 'APPROVE' | 'REQUEST_CHANGES' | 'COMMENT';
export interface ComposeReviewInput {
    /**
     * Critical findings anchored as inline `comments` entries.
     *
     * A seam for the two CLI boundaries and the tests — NEVER a field of the
     * model-written state JSON. Both boundaries derive it from the drafted
     * comments (`compose-review --comments`, `submit`'s payload) and refuse it
     * when the JSON carries it: a count handed over beside the thing it counts
     * is a count that can disagree with it, and a dogfooded report-only run —
     * where nothing downstream recounts — moved its one Critical from
     * `bodyCriticals` to an inline comment, lost the count on the way, and this
     * function printed `Verdict: Approve` over a Critical the report listed.
     */
    criticalsInline?: number;
    /** Suggestion findings anchored inline. Same seam, same refusal. */
    suggestionsInline?: number;
    /**
     * Critical descriptions whose only copy lives in the review body — the
     * last-resort unmappable findings and 422-relocated ones. They count
     * toward `C` exactly like anchored Criticals.
     */
    bodyCriticals?: string[];
    /** Suggestions discarded as unanchorable (offline validation or 422). */
    suggestionsDiscarded?: number;
    /**
     * Existing Criticals already on the PR whose Step 6 re-check landed on
     * `cannot tell` — one line each (location + what could not be decided).
     * Not counted in `C` (the review did not confirm them), but their
     * presence forbids an approval.
     */
    cannotTellCriticals?: string[];
    /** Uncoverable chunks, e.g. `"chunk 5 (src/big.min.js)"`. */
    uncoverableChunks?: string[];
    /**
     * Dimensions nobody reviewed. A bare name (`"security"`) means its agent
     * whiffed twice and gets the standard explanation; an entry carrying its
     * own reason after an em-dash (`"issue-fidelity — linked issue #123 could
     * not be fetched"`) is rendered verbatim.
     */
    unreviewedDimensions?: string[];
    /**
     * The plan report from Step 1.
     *
     * Coverage is derived from it plus the harness's transcripts — it is not an
     * input. See the recomputation below for why a caller does not get to say
     * whether the diff was read.
     */
    planPath?: string;
    /**
     * Where to look for the harness's records. Defaults to the environment the CLI
     * exported. A test seam only — production never passes it, and a model cannot:
     * `compose-review` reads its input as JSON, and this is not serialisable into
     * anything that would change where the transcripts are found on a real run.
     */
    env?: NodeJS.ProcessEnv;
    /** Step 1's lightweight `pr-context` fetch failed. */
    contextUnavailable?: boolean;
    presubmit?: {
        downgradeApprove?: boolean;
        downgradeRequestChanges?: boolean;
        downgradeReasons?: string[];
    };
    /** Model id for the footer, e.g. `qwen3.7-max`. */
    modelId: string;
}
export interface ComposeReviewResult {
    event: ReviewEvent;
    body: string;
    /** The table row before caps and downgrades — for the terminal report. */
    baseEvent: ReviewEvent;
    /** Which cap states applied (empty when none). */
    cappedBy: string[];
    /** True when a presubmit flag actually changed the event. */
    downgraded: boolean;
    /**
     * What the presubmit downgrade moved the event *from*, when it moved one.
     *
     * `baseEvent` cannot answer this: it is the row before caps AND downgrades, so a
     * `REQUEST_CHANGES` that a cap already softened to `COMMENT` before the downgrade
     * ran would look the same as one the downgrade itself moved. This names the
     * transition the downgrade made, so the terminal verdict can say a Request
     * changes — a review with confirmed Criticals — was downgraded, and not let it
     * read as "Comment, nothing blocking".
     */
    downgradedFrom: 'Approve' | 'Request changes' | null;
    /**
     * The orchestrator-facing fix for each coverage/verification gap the body
     * discloses — printed to stderr by the command, never rendered into the body.
     * The body tells the PR author what the review cannot certify; this tells the
     * operator which command repairs it. Two registers, two channels.
     */
    remediation: string[];
}
export declare function composeReview(input: ComposeReviewInput): ComposeReviewResult;
export declare const composeReviewCommand: CommandModule;
/** The terminal verdict, in the words Step 6 is told to print. */
export declare function verdictLine(r: ComposeReviewResult): string;
