/**
 * CLI Tool Icon Resolver
 *
 * Parses bash command strings to detect known CLI tools (git, npm, docker, etc.)
 * and resolves their display name + icon for turn card rendering.
 *
 * The mapping lives in ~/.craft-agent/tool-icons/tool-icons.json alongside the
 * icon files, so users can customize tools and icons.
 *
 * Command parsing handles:
 * - Simple commands: `git status`
 * - Environment variable prefixes: `NODE_ENV=prod npm run build`
 * - Chained commands: `git add . && npm publish`
 * - Pipes: `git log | head -10`
 * - Prefix commands: `sudo docker ps`, `time npm test`
 * - Path prefixes: `/usr/local/bin/node` → `node`
 * - Relative paths: `./node_modules/.bin/jest` → `jest`
 */
export interface ToolIconEntry {
    /** Unique tool identifier, e.g. "git" */
    id: string;
    /** Human-readable name shown in UI, e.g. "Git" */
    displayName: string;
    /** Icon filename in the same directory as tool-icons.json, e.g. "git.ico" */
    icon: string;
    /** CLI command names that map to this tool, e.g. ["git"] */
    commands: string[];
}
export interface ToolIconConfig {
    /** Schema version for forward compatibility */
    version: number;
    /** Array of tool definitions */
    tools: ToolIconEntry[];
}
export interface ToolIconMatch {
    /** Tool identifier */
    id: string;
    /** Display name for the UI */
    displayName: string;
    /** Base64-encoded data URL of the icon, ready for <img src="..."> */
    iconDataUrl: string;
}
/**
 * Splits a bash command string into individual sub-commands.
 * Splits on &&, ||, ;, and | operators while respecting quoted strings.
 *
 * Returns array of trimmed sub-command strings.
 */
export declare function splitCommands(commandStr: string): string[];
/**
 * Extracts the command name from a single sub-command string.
 * Strips env var prefixes, transparent prefix commands (sudo, time, etc.),
 * and path prefixes (/usr/local/bin/node → node).
 *
 * Also handles shell wrapper patterns like `/bin/zsh -lc 'git status'` by
 * extracting and recursively parsing the inner command.
 *
 * Returns the bare command name, or undefined if none found.
 */
export declare function extractCommandName(subCommand: string): string | undefined;
/**
 * Extracts all command names from a bash command string.
 * Handles chained commands (&&, ||, ;) and pipes (|).
 *
 * @param commandStr - Full bash command string, e.g. "git add . && npm publish"
 * @returns Array of command names in order, e.g. ["git", "npm"]
 */
export declare function extractCommandNames(commandStr: string): string[];
/**
 * Loads tool icon config from a directory containing tool-icons.json.
 *
 * @param toolIconsDir - Path to the tool-icons directory (e.g. ~/.craft-agent/tool-icons/)
 * @returns Parsed config or null if missing/invalid
 */
export declare function loadToolIconConfig(toolIconsDir: string): ToolIconConfig | null;
/**
 * Resolves a bash command string to a tool icon match.
 *
 * Parses the command to extract CLI tool names, then checks each against
 * the tool-icons.json mapping. Returns the first tool that has a valid icon file.
 *
 * @param commandStr - Full bash command string, e.g. "git add . && npm publish"
 * @param toolIconsDir - Path to ~/.craft-agent/tool-icons/ containing tool-icons.json and icon files
 * @returns Match with displayName and base64 iconDataUrl, or undefined if no match
 */
export declare function resolveToolIcon(commandStr: string, toolIconsDir: string): ToolIconMatch | undefined;
