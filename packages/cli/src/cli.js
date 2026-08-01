/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { pathToFileURL } from 'node:url';
import { normalizeServeFastPathArgv } from './serve/fast-path-argv.js';
import { initStartupProfiler } from './utils/startupProfiler.js';
import { initCpuProfiler } from './utils/cpuProfiler.js';
// Preserve the old entrypoint's profiling baseline before route-specific
// dynamic imports or command handling shift startup measurements.
initStartupProfiler();
initCpuProfiler();
export const TOP_LEVEL_COMMANDS = [
    ['auth', 'Configure authentication (removed)'],
    ['channel <command>', 'Manage messaging channels (Telegram, Discord, etc.)'],
    ['extensions <command>', 'Manage HopCode extensions.'],
    ['hooks', 'Manage HopCode hooks (use /hooks in interactive mode).'],
    ['mcp', 'Manage MCP servers'],
    [
        'review <command>',
        'Internal helpers used by the /review skill (PR worktree setup, context fetch, rules loading, presubmit checks, cleanup)',
    ],
    [
        'serve',
        'Run HopCode as a local HTTP daemon (Stage 1 experimental: --http-bridge)',
    ],
    ['sessions <command>', 'Manage HopCode sessions'],
    ['update', 'Check for HopCode updates and install if available'],
];
export const MCP_COMMANDS = [
    ['add <name> <commandOrUrl> [args...]', 'Add a server'],
    ['remove <name>', 'Remove a server'],
    ['list', 'List all configured MCP servers'],
    ['reconnect [server-name]', 'Reconnect to MCP servers'],
    ['approve [name]', 'Approve a pending MCP server'],
    ['reject [name]', 'Reject a pending MCP server'],
];
const TOP_LEVEL_HELP_OPTIONS = [
    ['model', { alias: 'm', type: 'string', description: 'Model' }],
    [
        'fallback-model',
        {
            type: 'array',
            description: 'Fallback model(s) for capacity errors, repeatable or comma-separated (max 3)',
        },
    ],
    [
        'prompt',
        {
            alias: 'p',
            type: 'string',
            description: 'Prompt. Appended to input on stdin (if any).',
        },
    ],
    [
        'prompt-interactive',
        {
            alias: 'i',
            type: 'string',
            description: 'Execute the provided prompt and continue in interactive mode',
        },
    ],
    [
        'safe-mode',
        {
            type: 'boolean',
            description: 'Disable all customizations (context files, hooks, extensions, skills, MCP servers) for troubleshooting.',
        },
    ],
    [
        'sandbox',
        {
            alias: 's',
            type: 'boolean',
            description: 'Run in sandbox?',
        },
    ],
    [
        'output-format',
        {
            alias: 'o',
            type: 'string',
            choices: ['text', 'json', 'stream-json'],
            description: 'The format of the CLI output.',
        },
    ],
    [
        'continue',
        {
            alias: 'c',
            type: 'boolean',
            description: 'Resume the most recent session for the current project.',
        },
    ],
    [
        'resume',
        {
            alias: 'r',
            type: 'string',
            description: 'Resume a specific session by its ID. Use without an ID to show session picker.',
        },
    ],
];
const VALUE_FLAGS = new Set([
    '--model',
    '-m',
    '--fallback-model',
    '--prompt',
    '-p',
    '--prompt-interactive',
    '-i',
    '--output-format',
    '-o',
    '--resume',
    '-r',
]);
function writeStdoutLine(line) {
    process.stdout.write(line.endsWith('\n') ? line : `${line}\n`);
}
function hasFlag(argv, long, short) {
    for (let i = 0; i < argv.length; i++) {
        const arg = argv[i];
        if (arg === '--') {
            return false;
        }
        if (VALUE_FLAGS.has(arg)) {
            i++;
            continue;
        }
        if (arg === long || arg === short) {
            return true;
        }
    }
    return false;
}
async function buildTopLevelHelpParser() {
    const { default: yargs } = await import('yargs');
    const parser = yargs([])
        .scriptName('hopcode')
        .usage('Usage: hopcode [options] [command]\n\nHopCode - Launch an interactive CLI, use -p/--prompt for non-interactive mode')
        .version(process.env['CLI_VERSION'] || 'unknown')
        .alias('v', 'version')
        .help()
        .alias('h', 'help')
        .strict()
        .demandCommand(0, 0);
    for (const [option, config] of TOP_LEVEL_HELP_OPTIONS) {
        parser.option(option, config);
    }
    for (const [command, description] of TOP_LEVEL_COMMANDS) {
        parser.command(command, description);
    }
    return parser;
}
function firstPositionalArg(argv) {
    for (let i = 0; i < argv.length; i++) {
        const arg = argv[i];
        if (arg === '--') {
            return undefined;
        }
        if (VALUE_FLAGS.has(arg)) {
            i++;
            continue;
        }
        if (!arg.startsWith('-')) {
            return arg;
        }
    }
    return undefined;
}
function normalizeMcpFastPathArgv(argv) {
    if (argv[0] === 'mcp' && argv[1] === '--') {
        return [argv[0], ...argv.slice(2)];
    }
    return argv;
}
export function resolveBootstrapRoute(rawArgv) {
    const argv = normalizeServeFastPathArgv(rawArgv);
    if (hasFlag(argv, '--version', '-v')) {
        return 'version';
    }
    const firstArg = argv[0];
    if (firstArg === 'serve') {
        return 'serve';
    }
    if (firstArg === 'mcp') {
        return 'mcp';
    }
    const firstPositional = firstPositionalArg(argv);
    if (hasFlag(argv, '--help', '-h') && firstPositional === undefined) {
        return 'help';
    }
    return 'default';
}
async function printTopLevelHelp() {
    const help = await (await buildTopLevelHelpParser()).getHelp();
    writeStdoutLine(help);
}
function printMcpHelp() {
    const lines = [
        'Usage: hopcode mcp <command>',
        '',
        'Manage MCP servers',
        '',
        'Commands:',
        ...MCP_COMMANDS.map(([command, description]) => `  hopcode mcp ${command}  ${description}`),
    ];
    writeStdoutLine(lines.join('\n'));
}
async function printBootstrapVersion() {
    if (process.env['CLI_VERSION']) {
        writeStdoutLine(process.env['CLI_VERSION']);
        return;
    }
    const { getCliVersion } = await import('./utils/version.js');
    writeStdoutLine(await getCliVersion());
}
async function runMcpFastPath(rawArgv) {
    const argv = normalizeMcpFastPathArgv(normalizeServeFastPathArgv(rawArgv));
    const hasSubcommand = argv.length > 1 && !argv[1].startsWith('-');
    if (!hasSubcommand) {
        printMcpHelp();
        return;
    }
    const [{ default: yargsInstance }, { mcpCommand }] = await Promise.all([
        import('yargs'),
        import('./commands/mcp.js'),
    ]);
    const parser = yargsInstance([])
        .scriptName('hopcode')
        .command(mcpCommand)
        .version(false)
        .help()
        .alias('h', 'help')
        .strict()
        .strictCommands()
        .demandCommand(1, 'You need at least one command before continuing.')
        .fail((message, error, yargs) => {
        writeStderrLine(message || error?.message || 'Unknown argument error');
        yargs.showHelp();
        process.exitCode = 1;
    })
        .exitProcess(false);
    if (hasFlag(argv.slice(2), '--help', '-h')) {
        await parseYargsHelp(parser, argv);
        return;
    }
    await parseYargsCommand(parser, argv);
}
async function parseYargsHelp(parser, argv) {
    await new Promise((resolve, reject) => {
        parser.parse(argv, (error, _argv, output) => {
            if (output) {
                writeStdoutLine(output);
            }
            if (error) {
                reject(error);
                return;
            }
            resolve();
        });
    });
}
async function parseYargsCommand(parser, argv) {
    await new Promise((resolve) => {
        parser.parse(argv, (error, _argv, output) => {
            if (output) {
                writeStdoutLine(output);
            }
            if (error) {
                writeStderrLine(error.message);
                process.exitCode = 1;
            }
            resolve();
        });
    });
}
export async function runCliEntry(rawArgv = process.argv.slice(2)) {
    const argv = normalizeServeFastPathArgv(rawArgv);
    const route = resolveBootstrapRoute(argv);
    if (route === 'version') {
        await printBootstrapVersion();
        return;
    }
    if (route === 'serve') {
        const { tryRunServeFastPath } = await import('./serve/fast-path.js');
        if (await tryRunServeFastPath(argv)) {
            return;
        }
    }
    else if (route === 'mcp') {
        await runMcpFastPath(argv);
        return;
    }
    else if (route === 'help') {
        await printTopLevelHelp();
        return;
    }
    const acpStartupProfiler = rawArgv.some((arg) => arg === '--acp' || arg === '--experimental-acp')
        ? await import('./utils/acp-startup-profiler.js')
        : undefined;
    acpStartupProfiler?.initializeAcpStartupProfiler();
    acpStartupProfiler?.markAcpStartup('geminiImportStart');
    const { main } = await import('./gemini.js');
    acpStartupProfiler?.markAcpStartup('geminiImportEnd');
    await main();
}
function getErrnoCode(error) {
    if (!error || typeof error !== 'object') {
        return undefined;
    }
    const code = error.code;
    return typeof code === 'string' ? code : undefined;
}
export function isExpectedPtyRaceError(error) {
    if (!(error instanceof Error)) {
        return false;
    }
    const message = error.message;
    const code = getErrnoCode(error);
    if ((code === 'EIO' && message.includes('read')) ||
        message.includes('read EIO')) {
        return true;
    }
    if ((code === 'EAGAIN' && message.includes('read')) ||
        message.includes('read EAGAIN')) {
        return true;
    }
    return (message.includes('ioctl(2) failed, EBADF') ||
        message.includes('Cannot resize a pty that has already exited'));
}
export async function handleCriticalError(error) {
    const [{ FatalError }, { AlreadyReportedError }] = await Promise.all([
        import('@hoptrendy/hopcode-core'),
        import('./utils/errors.js'),
    ]);
    if (error instanceof FatalError) {
        let errorMessage = error.message;
        if (!process.env['NO_COLOR']) {
            errorMessage = `\x1b[31m${errorMessage}\x1b[0m`;
        }
        writeStderrLine(errorMessage);
        process.exit(error.exitCode);
    }
    if (error instanceof AlreadyReportedError) {
        process.exit(error.exitCode);
    }
    writeStderrLine('An unexpected critical error occurred:');
    if (error instanceof Error) {
        writeStderrLine(error.stack ?? error.message);
    }
    else {
        writeStderrLine(String(error));
    }
    process.exit(1);
}
function writeStderrLine(line) {
    process.stderr.write(line.endsWith('\n') ? line : `${line}\n`);
}
export async function runCliEntryPoint(run = runCliEntry, handleError = handleCriticalError) {
    process.on('uncaughtException', (error) => {
        if (isExpectedPtyRaceError(error)) {
            return;
        }
        if (error instanceof Error) {
            writeStderrLine(error.stack ?? error.message);
        }
        else {
            writeStderrLine(String(error));
        }
        process.exit(1);
    });
    try {
        await run();
    }
    catch (error) {
        try {
            await handleError(error);
        }
        catch (handlerError) {
            writeStderrLine('An unexpected critical error occurred:');
            writeStderrLine('Original error:');
            if (error instanceof Error) {
                writeStderrLine(error.stack ?? error.message);
            }
            else {
                writeStderrLine(String(error));
            }
            writeStderrLine('Error handler failed:');
            if (handlerError instanceof Error) {
                writeStderrLine(handlerError.stack ?? handlerError.message);
            }
            else {
                writeStderrLine(String(handlerError));
            }
            process.exit(1);
        }
    }
}
if (process.argv[1] !== undefined &&
    import.meta.url === pathToFileURL(process.argv[1]).href) {
    void runCliEntryPoint();
}
//# sourceMappingURL=cli.js.map