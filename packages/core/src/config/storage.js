/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import * as path from 'node:path';
import * as os from 'node:os';
import * as fs from 'node:fs';
import { AsyncLocalStorage } from 'node:async_hooks';
import { getProjectHash, HOPCODE_DIR, sanitizeCwd } from '../utils/paths.js';
import { FatalConfigError } from '../utils/errors.js';
export { HOPCODE_DIR, HOPCODE_DIR_ALIAS } from '../utils/paths.js';
export const GOOGLE_ACCOUNTS_FILENAME = 'google_accounts.json';
export const OAUTH_FILE = 'oauth_creds.json';
export const SKILL_PROVIDER_CONFIG_DIRS = ['.hopcode', '.agents'];
const TMP_DIR_NAME = 'tmp';
const BIN_DIR_NAME = 'bin';
const PROJECT_DIR_NAME = 'projects';
const IDE_DIR_NAME = 'ide';
const PLANS_DIR_NAME = 'plans';
const DEBUG_DIR_NAME = 'debug';
const ARENA_DIR_NAME = 'arena';
function isResolvedPathWithinDirectory(childPath, parentPath) {
    const relativePath = path.relative(parentPath, childPath);
    return (relativePath === '' ||
        (!relativePath.startsWith(`..${path.sep}`) &&
            relativePath !== '..' &&
            !path.isAbsolute(relativePath)));
}
export class Storage {
    targetDir;
    /**
     * Custom runtime output base directory set via settings.
     * When null, falls back to getGlobalHopCodeDir().
     */
    static runtimeBaseDir = null;
    static runtimeBaseDirContext = new AsyncLocalStorage();
    constructor(targetDir) {
        this.targetDir = targetDir;
    }
    /**
     * Expands tilde and resolves relative paths to absolute.
     */
    static resolvePath(dir, cwd) {
        let resolved = dir;
        if (resolved === '~' ||
            resolved.startsWith('~/') ||
            resolved.startsWith('~\\')) {
            const relativeSegments = resolved === '~'
                ? []
                : resolved
                    .slice(2)
                    .split(/[/\\]+/)
                    .filter(Boolean);
            resolved = path.join(os.homedir(), ...relativeSegments);
        }
        if (!path.isAbsolute(resolved)) {
            resolved = cwd ? path.resolve(cwd, resolved) : path.resolve(resolved);
        }
        return resolved;
    }
    static resolveRuntimeBaseDir(dir, cwd) {
        if (!dir) {
            return null;
        }
        return Storage.resolvePath(dir, cwd);
    }
    /**
     * Sanitizes a session id for use as a plan filename.
     *
     * Plan files are keyed by session id, but the raw id is public SDK input.
     * Strip directory separators and Windows-invalid filename characters so a
     * hostile value cannot escape the plans directory.
     */
    static sanitizePlanSessionId(sessionId) {
        const safeName = path
            .basename(sessionId.replace(/\\/g, '/'))
            .replace(/^\.+/g, '_')
            // eslint-disable-next-line no-control-regex
            .replace(/[<>:"|?*\x00-\x1F]/g, '_');
        return safeName || '_';
    }
    /**
     * Sets the custom runtime output base directory.
     * Handles tilde (~) expansion and resolves relative paths to absolute.
     * Pass null/undefined/empty string to reset to default (getGlobalHopCodeDir()).
     * @param dir - The directory path, or null/undefined to reset
     * @param cwd - Base directory for resolving relative paths (defaults to process.cwd()).
     *              Pass the project root so that relative values like ".hopcode" resolve
     *              per-project, enabling a single global config to work across all projects.
     */
    static setRuntimeBaseDir(dir, cwd) {
        Storage.runtimeBaseDir = Storage.resolveRuntimeBaseDir(dir, cwd);
    }
    /**
     * Runs function execution in an async context with a specific runtime output dir.
     * This is used to isolate runtime output paths between concurrent sessions.
     */
    static runWithRuntimeBaseDir(dir, cwd, fn) {
        const resolved = Storage.resolveRuntimeBaseDir(dir, cwd);
        return Storage.runtimeBaseDirContext.run(resolved, fn);
    }
    /**
     * Returns the base directory for all runtime output (temp files, debug logs,
     * session data, todos, insights, etc.).
     *
     * Priority: HOPCODE_RUNTIME_DIR env var > setRuntimeBaseDir() value > getGlobalHopCodeDir()
     * @returns Absolute path to the runtime output base directory
     */
    static getRuntimeBaseDir() {
        const envDir = process.env['HOPCODE_RUNTIME_DIR'];
        if (envDir) {
            return (Storage.resolveRuntimeBaseDir(envDir) ?? Storage.getGlobalHopCodeDir());
        }
        const contextualDir = Storage.runtimeBaseDirContext.getStore();
        if (contextualDir !== undefined) {
            return contextualDir ?? Storage.getGlobalHopCodeDir();
        }
        if (Storage.runtimeBaseDir) {
            return Storage.runtimeBaseDir;
        }
        return Storage.getGlobalHopCodeDir();
    }
    static getGlobalHopCodeDir() {
        const envDir = process.env['HOPCODE_HOME'];
        if (envDir) {
            return Storage.resolvePath(envDir);
        }
        const homeDir = os.homedir();
        if (!homeDir) {
            return path.join(os.tmpdir(), '.hopcode');
        }
        return path.join(homeDir, HOPCODE_DIR);
    }
    static getMcpOAuthTokensPath() {
        return path.join(Storage.getGlobalHopCodeDir(), 'mcp-oauth-tokens.json');
    }
    static getGlobalSettingsPath() {
        return path.join(Storage.getGlobalHopCodeDir(), 'settings.json');
    }
    static getInstallationIdPath() {
        return path.join(Storage.getGlobalHopCodeDir(), 'installation_id');
    }
    static getGoogleAccountsPath() {
        return path.join(Storage.getGlobalHopCodeDir(), GOOGLE_ACCOUNTS_FILENAME);
    }
    static getUserCommandsDir() {
        return path.join(Storage.getGlobalHopCodeDir(), 'commands');
    }
    static getGlobalMemoryFilePath() {
        return path.join(Storage.getGlobalHopCodeDir(), 'memory.md');
    }
    static getGlobalTempDir() {
        return path.join(Storage.getRuntimeBaseDir(), TMP_DIR_NAME);
    }
    static getGlobalDebugDir() {
        return path.join(Storage.getRuntimeBaseDir(), DEBUG_DIR_NAME);
    }
    static getDebugLogPath(sessionId) {
        return path.join(Storage.getGlobalDebugDir(), `${sessionId}.txt`);
    }
    static getGlobalQwenDir() {
        // Pinned to the global HopCode dir so the VS Code companion (which only
        // sees env vars, not settings-based runtimeOutputDir) finds the same
        // lock-file location as the CLI.
        return path.join(Storage.getGlobalHopCodeDir(), IDE_DIR_NAME);
    }
    /**
     * Resolves pathToResolve by realpathing its deepest existing ancestor and
     * appending the not-yet-created remainder.
     */
    static resolvePathThroughExistingAncestor(pathToResolve) {
        let candidate = pathToResolve;
        while (true) {
            try {
                const realCandidate = fs.realpathSync(candidate);
                const remainder = path.relative(candidate, pathToResolve);
                return path.join(realCandidate, remainder);
            }
            catch (err) {
                if (err.code !== 'ENOENT') {
                    throw err;
                }
                const parent = path.dirname(candidate);
                if (parent === candidate) {
                    return pathToResolve;
                }
                candidate = parent;
            }
        }
    }
    /**
     * Checks whether {@link childPath} resides within {@link parentPath},
     * resolving symbolic links to prevent traversal bypass attacks.
     */
    static isPathWithinDirectory(childPath, parentPath) {
        const realParent = Storage.resolvePathThroughExistingAncestor(parentPath);
        const realChild = Storage.resolvePathThroughExistingAncestor(childPath);
        return isResolvedPathWithinDirectory(realChild, realParent);
    }
    static assertPathWithinDirectory(childPath, parentPath, errorMessage) {
        if (!Storage.isPathWithinDirectory(childPath, parentPath)) {
            throw new FatalConfigError(errorMessage);
        }
    }
    static getPlansDir(projectRoot, plansDirectory) {
        const configuredPlansDirectory = plansDirectory?.trim();
        if (configuredPlansDirectory) {
            if (!projectRoot) {
                throw new FatalConfigError('projectRoot is required when plansDirectory is configured.');
            }
            const resolvedProjectRoot = path.resolve(projectRoot);
            const resolvedPlansDirectory = Storage.resolvePath(configuredPlansDirectory, resolvedProjectRoot);
            Storage.assertPathWithinDirectory(resolvedPlansDirectory, resolvedProjectRoot, `plansDirectory must resolve within the project root.`);
            return resolvedPlansDirectory;
        }
        return path.join(Storage.getGlobalHopCodeDir(), PLANS_DIR_NAME);
    }
    static getPlanFilePath(sessionId, projectRoot, plansDirectory) {
        // Kept for tests and SDK callers that still use Storage helpers directly.
        return path.join(Storage.getPlansDir(projectRoot, plansDirectory), `${Storage.sanitizePlanSessionId(sessionId)}.md`);
    }
    static getGlobalBinDir() {
        return path.join(Storage.getGlobalHopCodeDir(), BIN_DIR_NAME);
    }
    static getGlobalArenaDir() {
        return path.join(Storage.getGlobalHopCodeDir(), ARENA_DIR_NAME);
    }
    getHopCodeDir() {
        return path.join(this.targetDir, HOPCODE_DIR);
    }
    getProjectDir() {
        const projectId = sanitizeCwd(this.getProjectRoot());
        const projectsDir = path.join(Storage.getRuntimeBaseDir(), PROJECT_DIR_NAME);
        return path.join(projectsDir, projectId);
    }
    getProjectTempDir() {
        const hash = getProjectHash(this.getProjectRoot());
        const tempDir = Storage.getGlobalTempDir();
        const targetDir = path.join(tempDir, hash);
        return targetDir;
    }
    getToolResultsDir() {
        return path.join(this.getProjectTempDir(), 'tool-results');
    }
    ensureProjectTempDirExists() {
        fs.mkdirSync(this.getProjectTempDir(), { recursive: true });
    }
    static getOAuthCredsPath() {
        return path.join(Storage.getGlobalHopCodeDir(), OAUTH_FILE);
    }
    getProjectRoot() {
        return this.targetDir;
    }
    getWorkspaceSettingsPath() {
        return path.join(this.getHopCodeDir(), 'settings.json');
    }
    getProjectCommandsDir() {
        return path.join(this.getHopCodeDir(), 'commands');
    }
    /**
     * Project-level saved-workflow scripts directory: `<targetDir>/.hopcode/workflows`.
     * Saved workflow scripts (`<name>.js`) here are surfaced as slash commands
     * and resolvable by `workflow('<name>')` from inside a running workflow.
     */
    getProjectWorkflowsDir() {
        return path.join(this.getHopCodeDir(), 'workflows');
    }
    /**
     * User-level saved-workflow scripts directory: `~/.hopcode/workflows`. User
     * scope is lower-precedence than project scope when the same `<name>.js`
     * exists in both.
     */
    static getUserWorkflowsDir() {
        return path.join(Storage.getGlobalHopCodeDir(), 'workflows');
    }
    /**
     * Per-run workflow artifact directory: `<projectDir>/workflows`. Holds
     * completed-run snapshot JSON files (`<runId>.json`) for the `/workflows`
     * recent list, and per-run resume journals (`<runId>/journal.jsonl`).
     */
    getWorkflowRunsDir() {
        return path.join(this.getProjectDir(), 'workflows');
    }
    /**
     * Path to the persisted snapshot of a completed workflow run.
     */
    getWorkflowRunSnapshotPath(runId) {
        return path.join(this.getWorkflowRunsDir(), `${runId}.json`);
    }
    /**
     * Path to the resume journal for an in-progress / resumable workflow run.
     */
    getWorkflowRunJournalPath(runId) {
        return path.join(this.getWorkflowRunsDir(), runId, 'journal.jsonl');
    }
    /**
     * Path to the runtime-status sidecar JSON for this session.
     *
     * Co-located with the per-session chat log under
     * `<projectDir>/chats/<sessionId>.runtime.json` so external observers
     * (terminal multiplexers, IDE integrations, status daemons) can scan
     * the same directory used for chat history to find live sessions.
     */
    getRuntimeStatusPath(sessionId) {
        return path.join(this.getProjectDir(), 'chats', `${sessionId}.runtime.json`);
    }
    getProjectTempCheckpointsDir() {
        return path.join(this.getProjectTempDir(), 'checkpoints');
    }
    getExtensionsDir() {
        return path.join(this.getHopCodeDir(), 'extensions');
    }
    getExtensionsConfigPath() {
        return path.join(this.getExtensionsDir(), 'hopcode-extension.json');
    }
    getUserSkillsDirs() {
        const homeDir = os.homedir() || os.tmpdir();
        return SKILL_PROVIDER_CONFIG_DIRS.map((dir) => dir === HOPCODE_DIR
            ? path.join(Storage.getGlobalHopCodeDir(), 'skills')
            : path.join(homeDir, dir, 'skills'));
    }
    /**
     * Returns the user-level extensions directory (~/.hopcode/extensions/).
     * Extensions installed at user scope are stored here, as opposed to
     * project-level extensions which live in <project>/.hopcode/extensions/.
     */
    static getUserExtensionsDir() {
        return path.join(Storage.getGlobalHopCodeDir(), 'extensions');
    }
    getHistoryFilePath() {
        return path.join(this.getProjectTempDir(), 'shell_history');
    }
    getHistoryDir() {
        const hash = getProjectHash(this.getProjectRoot());
        const historyDir = path.join(Storage.getRuntimeBaseDir(), 'history');
        const targetDir = path.join(historyDir, hash);
        return targetDir;
    }
}
//# sourceMappingURL=storage.js.map