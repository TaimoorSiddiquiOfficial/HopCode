/**
 * @license
 * Copyright 2026 Qwen Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type { CommandModule } from 'yargs';
export type ReviewEffort = 'low' | 'medium' | 'high';
export type ReviewTarget = {
    type: 'pr-number';
    number: number;
} | {
    type: 'pr-url';
    /** Canonicalized: lowercased scheme and host, query/fragment dropped. */
    url: string;
    host: string;
    owner: string;
    repo: string;
    number: number;
} | {
    type: 'file';
    path: string;
} | {
    type: 'local';
};
export interface ParsedReviewArgs {
    target: ReviewTarget;
    /** Resolved effort after defaults and the `--comment` override. */
    effort: ReviewEffort;
    effortSource: 'explicit' | 'default' | 'forced-by-comment';
    comment: {
        /** `--comment` appeared in the arguments. */
        requested: boolean;
        /** `--comment` applies (the target is a PR). */
        effective: boolean;
    };
    /** Non-flag tokens beyond the first target token, reported not guessed. */
    extraTokens: string[];
    /** Unrecognized `--flags`, reported not guessed. */
    unknownFlags: string[];
    warnings: string[];
}
/**
 * Split a raw argument string on whitespace, honouring double- and
 * single-quoted segments so file paths with spaces survive.
 */
export declare function tokenizeArgs(raw: string): string[];
export declare function parseReviewArgs(raw: string): ParsedReviewArgs;
export declare const parseArgsCommand: CommandModule;
