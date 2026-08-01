/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Utility functions for writing to stdout/stderr in CLI commands.
 *
 * These helpers are used instead of console.log/console.error in standalone
 * CLI commands (like `hopcode extensions list`) where the output IS the user-facing
 * result, not debug logging.
 *
 * For debug/diagnostic logging, use `createDebugLogger()` from @hoptrendy/hopcode-core.
 */
/**
 * Writes a message to stdout with a trailing newline.
 * Use for normal command output that the user expects to see.
 * Avoids double newlines if the message already ends with one.
 */
export declare const writeStdoutLine: (message: string) => void;
/**
 * Writes a message to stderr with a trailing newline.
 * Use for error messages in CLI commands.
 * Avoids double newlines if the message already ends with one.
 */
export declare const writeStderrLine: (message: string) => void;
/**
 * `writeStderrLine` that cannot throw.
 *
 * `process.stderr.write` throws on EPIPE or a closed fd — reachable whenever
 * the reader goes away (`hopcode … | head`) or a daemon redirects its stderr. Most
 * of the CLI *wants* that to be loud, so this is not the default.
 *
 * Use it only where the write is incidental to the work in hand and failing it
 * would destroy something real: a diagnostic emitted mid-way through replaying
 * a transcript, say, where a throw would abandon the remaining records.
 */
export declare const writeStderrLineSafe: (message: string) => void;
/**
 * Clears the terminal screen.
 * Use instead of console.clear() to satisfy no-console lint rules.
 */
export declare const clearScreen: () => void;
