#!/usr/bin/env bun
/**
 * browser-tool (secondary path)
 *
 * CLI helper for browser automation workflows in HopCode.
 *
 * This helper is intentionally thin and deterministic:
 * - It provides command discovery via --help
 * - It emits structured browser_* tool call templates as JSON
 * - Execution still happens through native browser_* tools in sessions
 */
type Io = {
    log: (...args: unknown[]) => void;
    error: (...args: unknown[]) => void;
};
export declare function parseUrlDetails(rawUrl: string): Record<string, unknown>;
export declare function runBrowserToolCli(argv: string[], io?: Io): number;
export {};
