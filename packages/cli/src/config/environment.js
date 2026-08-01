/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';
import * as dotenv from 'dotenv';
import { getErrorMessage, HOPCODE_DIR, Storage } from '@hoptrendy/hopcode-core';
import { isWorkspaceTrusted } from './trustedFolders.js';
import { DEFAULT_EXCLUDED_ENV_VARS, HOME_ENV_BOOTSTRAP_KEYS, PROJECT_ENV_HARDCODED_EXCLUSIONS, } from './shared-env-keys.js';
export { DEFAULT_EXCLUDED_ENV_VARS, ENV_CORRUPTED_PATH, ENV_WAS_RECOVERED, } from './shared-env-keys.js';
export const SETTINGS_DIRECTORY_NAME = HOPCODE_DIR;
const RELOAD_EXCLUDED_KEYS = new Set([
    ...PROJECT_ENV_HARDCODED_EXCLUSIONS,
    'HOPCODE_SERVER_TOKEN',
    'HOPCODE_CLI_ENTRY',
    'NODE_OPTIONS',
    'NODE_PATH',
    'NODE_TLS_REJECT_UNAUTHORIZED',
    'LD_PRELOAD',
    'LD_AUDIT',
    'LD_LIBRARY_PATH',
    'DYLD_INSERT_LIBRARIES',
    'DYLD_LIBRARY_PATH',
    'BASH_ENV',
    'ENV',
    'PATH',
    'HOME',
    'TMPDIR',
    'TMP',
    'TEMP',
]);
const dotEnvSourcedKeys = new Set();
const settingsEnvSourcedKeys = new Set();
const lastReloadSnapshot = new Map();
let lastReloadSnapshotSeeded = false;
/**
 * Returns the set of normalized .env file paths that count as user-level.
 *
 * User-level paths cover the home `.env` and the global hopcode config dir
 * `.env` (which respects `HOPCODE_HOME`). When `HOPCODE_HOME` redirects elsewhere,
 * the legacy `<homedir>/.hopcode/.env` is also included so credentials users
 * left there continue to load (and the trust check in untrusted workspaces
 * still allows reading it).
 */
function getUserLevelEnvPaths() {
    const homeDir = os.homedir();
    const globalhopcodeDir = Storage.getGlobalHopCodeDir();
    const paths = new Set([
        path.normalize(path.join(homeDir, '.env')),
        path.normalize(path.join(globalhopcodeDir, '.env')),
    ]);
    const legacyQwenEnv = path.normalize(path.join(homeDir, HOPCODE_DIR, '.env'));
    paths.add(legacyQwenEnv);
    return paths;
}
/**
 * Pre-resolves HOPCODE_HOME and HOPCODE_RUNTIME_DIR from user-level `.env` files
 * before any settings or storage paths are read. Required because
 * module-load `Storage.getGlobalhopcodeDir()` would otherwise snapshot legacy
 * paths for settings.json, OAuth tokens, installation_id, etc., while the
 * regular `.env` load only runs later — splitting global state between
 * `~/.hopcode/...` and `<HOPCODE_HOME>/...`.
 */
let homeEnvBootstrapped = false;
export function preResolveHomeEnvOverrides() {
    if (homeEnvBootstrapped) {
        return;
    }
    homeEnvBootstrapped = true;
    if (HOME_ENV_BOOTSTRAP_KEYS.every((key) => process.env[key])) {
        return;
    }
    // Storage.getGlobalhopcodeDir() shares the same homedir resolution as the
    // rest of the storage layer; when HOPCODE_HOME is unset it equals
    // `<homedir>/.hopcode`, so path.dirname() recovers `<homedir>`.
    const initialhopcodeHome = process.env['HOPCODE_HOME'];
    const initialhopcodeDir = Storage.getGlobalHopCodeDir();
    const candidates = [path.join(initialhopcodeDir, '.env')];
    if (!initialhopcodeHome) {
        candidates.push(path.join(path.dirname(initialhopcodeDir), '.env'));
    }
    for (const candidate of candidates) {
        readHomeEnvInto(candidate);
    }
    // If HOPCODE_HOME was just discovered, also read <new HOPCODE_HOME>/.env so
    // HOPCODE_RUNTIME_DIR can be sourced from there.
    const discoveredhopcodeHome = process.env['HOPCODE_HOME'];
    if (discoveredhopcodeHome && discoveredhopcodeHome !== initialhopcodeHome) {
        const discoveredDir = Storage.getGlobalHopCodeDir();
        if (discoveredDir !== initialhopcodeDir) {
            readHomeEnvInto(path.join(discoveredDir, '.env'));
        }
    }
}
function readHomeEnvInto(file) {
    if (!fs.existsSync(file)) {
        return;
    }
    try {
        const parsed = dotenv.parse(fs.readFileSync(file, 'utf-8'));
        for (const key of PROJECT_ENV_HARDCODED_EXCLUSIONS) {
            if (parsed[key] && !Object.hasOwn(process.env, key)) {
                process.env[key] = parsed[key];
            }
        }
    }
    catch (_e) {
        // Match the dotenv quiet-mode behavior used by loadEnvironment below.
    }
}
/** Test-only: reset the home-env bootstrap latch. */
export function resetHomeEnvBootstrapForTesting() {
    homeEnvBootstrapped = false;
}
/** Test-only: reset environment reload provenance between tests. */
export function resetEnvironmentTrackingForTesting() {
    dotEnvSourcedKeys.clear();
    settingsEnvSourcedKeys.clear();
    lastReloadSnapshot.clear();
    lastReloadSnapshotSeeded = false;
}
/**
 * Collects environment variables from user-level `.env` files and returns
 * them as a plain dictionary **without** mutating `process.env`.
 *
 * Candidates are iterated most-specific-first (`~/.hopcode/.env` before
 * `~/.env`). `??=` ensures the first file to define a key wins, matching
 * dotenv's first-occurrence-wins semantics used elsewhere.
 */
export function getHomeEnvFallbackVars(onReadError) {
    const globalhopcodeDir = Storage.getGlobalHopCodeDir();
    const candidates = [path.join(globalhopcodeDir, '.env')];
    // When HOPCODE_HOME is set, skip ~/.env to avoid surprise cross-contamination
    // from a shared home .env. getUserLevelEnvPaths() always includes ~/.env
    // because loadEnvironment() populates process.env independently — the two
    // scopes are intentionally different.
    if (!process.env['HOPCODE_HOME']) {
        candidates.push(path.join(path.dirname(globalhopcodeDir), '.env'));
    }
    const result = {};
    for (const candidate of candidates) {
        if (!fs.existsSync(candidate)) {
            continue;
        }
        try {
            const parsed = dotenv.parse(fs.readFileSync(candidate, 'utf-8'));
            for (const key in parsed) {
                if (Object.hasOwn(parsed, key) && !Object.hasOwn(process.env, key)) {
                    result[key] ??= parsed[key];
                }
            }
        }
        catch (e) {
            onReadError?.(`Failed to read home .env candidate ${candidate}: ${getErrorMessage(e)}`);
        }
    }
    return result;
}
/**
 * Finds the .env files to load, respecting workspace trust settings.
 *
 * When workspace is untrusted, only allow user-level .env files at:
 * - ~/.hopcode/.env
 * - ~/.env
 * - <HOPCODE_HOME>/.env (when set)
 */
export function findEnvFiles(settings, startDir, userLevelPaths = getUserLevelEnvPaths()) {
    const homeDir = os.homedir();
    let realStartDir = path.resolve(startDir);
    try {
        realStartDir = fs.realpathSync(realStartDir);
    }
    catch {
        // Match loadSettings(): use the resolved path when realpath is unavailable.
    }
    const isTrusted = isWorkspaceTrusted(settings, undefined, realStartDir).isTrusted;
    const globalhopcodeDir = Storage.getGlobalHopCodeDir();
    const legacyhopcodeDir = path.normalize(path.join(homeDir, HOPCODE_DIR));
    const hasCustomConfigDir = path.normalize(globalhopcodeDir) !== legacyhopcodeDir;
    const found = [];
    const seen = new Set();
    const canUseEnvFile = (filePath) => isTrusted !== false || userLevelPaths.has(path.normalize(filePath));
    // Home-dir candidates in priority order: globalhopcodeDir/.env, then legacy
    // ~/.hopcode/.env (only when HOPCODE_HOME redirects), then ~/.env.
    const pushCandidate = (filePath) => {
        const normalized = path.normalize(filePath);
        if (!seen.has(normalized) &&
            fs.existsSync(filePath) &&
            canUseEnvFile(filePath)) {
            seen.add(normalized);
            found.push(filePath);
            return true;
        }
        return false;
    };
    const pushHomeCandidates = () => {
        const candidates = [path.join(globalhopcodeDir, '.env')];
        if (hasCustomConfigDir) {
            candidates.push(path.join(legacyhopcodeDir, '.env'));
        }
        candidates.push(path.join(homeDir, '.env'));
        for (const candidate of candidates) {
            pushCandidate(candidate);
        }
    };
    let currentDir = realStartDir;
    let visitedHomeDir = false;
    while (true) {
        if (currentDir === homeDir) {
            visitedHomeDir = true;
            pushHomeCandidates();
            return found;
        }
        else {
            // Workspace step: prefer .hopcode/.env, then plain .env.
            const geminiEnvPath = path.join(currentDir, HOPCODE_DIR, '.env');
            if (pushCandidate(geminiEnvPath)) {
                pushHomeCandidates();
                return found;
            }
            const envPath = path.join(currentDir, '.env');
            if (pushCandidate(envPath)) {
                pushHomeCandidates();
                return found;
            }
        }
        const parentDir = path.dirname(currentDir);
        if (parentDir === currentDir || !parentDir) {
            if (!visitedHomeDir) {
                pushHomeCandidates();
            }
            return found;
        }
        currentDir = parentDir;
    }
}
export function setUpCloudShellEnvironment(envFilePath) {
    // Special handling for GOOGLE_CLOUD_PROJECT in Cloud Shell:
    // Because GOOGLE_CLOUD_PROJECT in Cloud Shell tracks the project
    // set by the user using "gcloud config set project" we do not want to
    // use its value. So, unless the user overrides GOOGLE_CLOUD_PROJECT in
    // one of the .env files, we set the Cloud Shell-specific default here.
    if (envFilePath && fs.existsSync(envFilePath)) {
        const envFileContent = fs.readFileSync(envFilePath);
        const parsedEnv = dotenv.parse(envFileContent);
        if (parsedEnv['GOOGLE_CLOUD_PROJECT']) {
            // .env file takes precedence in Cloud Shell
            process.env['GOOGLE_CLOUD_PROJECT'] = parsedEnv['GOOGLE_CLOUD_PROJECT'];
        }
        else {
            // If not in .env, set to default and override global
            process.env['GOOGLE_CLOUD_PROJECT'] = 'cloudshell-gca';
        }
    }
    else {
        // If no .env file, set to default and override global
        process.env['GOOGLE_CLOUD_PROJECT'] = 'cloudshell-gca';
    }
}
function setUpCloudShellEnvironmentInEnv(env, envFiles) {
    for (const envFile of envFiles) {
        if (envFile.parsedEnv['GOOGLE_CLOUD_PROJECT']) {
            env['GOOGLE_CLOUD_PROJECT'] = envFile.parsedEnv['GOOGLE_CLOUD_PROJECT'];
            return;
        }
    }
    env['GOOGLE_CLOUD_PROJECT'] = 'cloudshell-gca';
}
function parseEnvFiles(envFilePaths, userLevelPaths) {
    const files = [];
    const readFailures = [];
    for (const envFilePath of envFilePaths) {
        try {
            const envFileContent = fs.readFileSync(envFilePath, 'utf-8');
            const parsedEnv = dotenv.parse(envFileContent);
            const normalizedEnvFilePath = path.normalize(envFilePath);
            const isHomeScopedEnvFile = userLevelPaths.has(normalizedEnvFilePath);
            const isHopCodeScopedEnvFile = isHomeScopedEnvFile ||
                path.basename(path.dirname(normalizedEnvFilePath)) === HOPCODE_DIR;
            files.push({
                parsedEnv,
                isHomeScopedEnvFile,
                isHopCodeScopedEnvFile,
            });
        }
        catch (err) {
            readFailures.push({
                path: envFilePath,
                error: getErrorMessage(err),
            });
        }
    }
    return { files, readFailed: readFailures.length > 0, readFailures };
}
function canApplyParsedEnvKey(envFile, key, excludedVars, options = {}) {
    if (!Object.hasOwn(envFile.parsedEnv, key))
        return false;
    if (options.reload && RELOAD_EXCLUDED_KEYS.has(key))
        return false;
    if (!envFile.isHomeScopedEnvFile &&
        PROJECT_ENV_HARDCODED_EXCLUSIONS.includes(key)) {
        return false;
    }
    return envFile.isHopCodeScopedEnvFile || !excludedVars.includes(key);
}
function isEffectivelyUnset(env, key) {
    const existingValue = env[key];
    return !Object.hasOwn(env, key) || existingValue === '';
}
function setRuntimeEnvIfUnset(env, key, value) {
    if (isEffectivelyUnset(env, key)) {
        env[key] = value;
    }
}
export function buildRuntimeEnvironment(settings, startDir = process.cwd(), baseEnv = process.env) {
    const userLevelPaths = getUserLevelEnvPaths();
    const envFilePaths = findEnvFiles(settings, startDir, userLevelPaths);
    const parsedEnvFiles = parseEnvFiles(envFilePaths, userLevelPaths);
    const effectiveEnv = { ...baseEnv };
    if (baseEnv['CLOUD_SHELL'] === 'true') {
        setUpCloudShellEnvironmentInEnv(effectiveEnv, parsedEnvFiles.files);
    }
    for (const envFile of parsedEnvFiles.files) {
        const excludedVars = settings?.advanced?.excludedEnvVars || DEFAULT_EXCLUDED_ENV_VARS;
        for (const key in envFile.parsedEnv) {
            if (!canApplyParsedEnvKey(envFile, key, excludedVars, { reload: true })) {
                continue;
            }
            setRuntimeEnvIfUnset(effectiveEnv, key, envFile.parsedEnv[key]);
        }
    }
    if (settings.env) {
        const excludedVars = settings?.advanced?.excludedEnvVars || DEFAULT_EXCLUDED_ENV_VARS;
        for (const [key, value] of Object.entries(settings.env)) {
            if (RELOAD_EXCLUDED_KEYS.has(key))
                continue;
            if (PROJECT_ENV_HARDCODED_EXCLUSIONS.includes(key))
                continue;
            if (excludedVars.includes(key))
                continue;
            if (typeof value !== 'string')
                continue;
            setRuntimeEnvIfUnset(effectiveEnv, key, value);
        }
    }
    const overlayKeys = Object.keys(effectiveEnv)
        .filter((key) => effectiveEnv[key] !== baseEnv[key])
        .sort();
    return {
        effectiveEnv: Object.freeze({ ...effectiveEnv }),
        overlayKeys: Object.freeze(overlayKeys),
        envFilePaths: Object.freeze([...envFilePaths]),
        envFileReadFailed: parsedEnvFiles.readFailed,
        envFileReadFailures: Object.freeze([...parsedEnvFiles.readFailures]),
    };
}
/**
 * Loads environment variables from .env files and settings.env.
 *
 * Priority order (highest to lowest):
 * 1. CLI flags
 * 2. process.env (system/export/inline environment variables)
 * 3. .env files (no-override mode)
 * 4. settings.env (no-override mode)
 * 5. defaults
 */
export function loadEnvironment(settings, startDir = process.cwd()) {
    const userLevelPaths = getUserLevelEnvPaths();
    const envFilePaths = findEnvFiles(settings, startDir, userLevelPaths);
    const parsedEnvFiles = parseEnvFiles(envFilePaths, userLevelPaths);
    // Cloud Shell environment variable handling
    if (process.env['CLOUD_SHELL'] === 'true') {
        setUpCloudShellEnvironmentInEnv(process.env, parsedEnvFiles.files);
    }
    // Step 1: Load from .env files (higher priority than settings.env)
    // Only set if not already present in process.env (no-override mode)
    for (const envFile of parsedEnvFiles.files) {
        const excludedVars = settings?.advanced?.excludedEnvVars || DEFAULT_EXCLUDED_ENV_VARS;
        // homeScoped: `.env` lives under the user's home Qwen dir or `~/.env` —
        //   only these may set HOPCODE_HOME / HOPCODE_RUNTIME_DIR.
        // qwenScoped: any `.env` whose immediate parent is `.hopcode` (including
        //   `<repo>/.hopcode/.env`) — exempt from the user `excludedEnvVars` list.
        for (const key in envFile.parsedEnv) {
            if (!canApplyParsedEnvKey(envFile, key, excludedVars))
                continue;
            const existingValue = process.env[key];
            const isEffectivelyUnset = !Object.hasOwn(process.env, key) || existingValue === '';
            if (isEffectivelyUnset) {
                process.env[key] = envFile.parsedEnv[key];
                dotEnvSourcedKeys.add(key);
            }
            // Seed snapshot with ALL parsed keys (not just written ones)
            // so child processes can detect deletions on first reload.
            if (!lastReloadSnapshotSeeded && !lastReloadSnapshot.has(key)) {
                lastReloadSnapshot.set(key, envFile.parsedEnv[key]);
            }
        }
    }
    // Step 2: settings.env fallback (lowest priority, no-override).
    // Storage-routing vars must never come from settings.json — a workspace
    // settings.json could otherwise redirect global state after path bootstrap.
    if (settings.env) {
        for (const [key, value] of Object.entries(settings.env)) {
            if (RELOAD_EXCLUDED_KEYS.has(key)) {
                continue;
            }
            if (PROJECT_ENV_HARDCODED_EXCLUSIONS.includes(key)) {
                continue;
            }
            // Allow settings.env to fill in when process.env has the key but its
            // value is empty string — an empty export (e.g. `DASHSCOPE_API_KEY=`
            // in a Docker env file) is functionally missing yet blocks the normal
            // no-override check because Object.hasOwn returns true.
            const existingValue = process.env[key];
            const isEffectivelyUnset = !Object.hasOwn(process.env, key) || existingValue === '';
            if (isEffectivelyUnset && typeof value === 'string') {
                process.env[key] = value;
                settingsEnvSourcedKeys.add(key);
            }
            if (!lastReloadSnapshotSeeded &&
                typeof value === 'string' &&
                !lastReloadSnapshot.has(key)) {
                lastReloadSnapshot.set(key, value);
            }
        }
    }
    lastReloadSnapshotSeeded = true;
}
/**
 * Only keys previously set by loadEnvironment() are overwritten;
 * shell-exported variables are never touched.
 * Fully synchronous — no TOCTOU window between delete and re-add.
 */
export function reloadEnvironment(settings, workspaceCwd) {
    const userLevelPaths = getUserLevelEnvPaths();
    const envFilePaths = findEnvFiles(settings, workspaceCwd, userLevelPaths);
    const parsedEnvFiles = parseEnvFiles(envFilePaths, userLevelPaths);
    if (process.env['CLOUD_SHELL'] === 'true') {
        setUpCloudShellEnvironmentInEnv(process.env, parsedEnvFiles.files);
    }
    // Build the set of new keys from .env (higher priority) + settings.env
    const dotEnvReadFailed = parsedEnvFiles.readFailed;
    const newDotEnvKeys = new Map();
    const newSettingsEnvKeys = new Map();
    for (const envFile of parsedEnvFiles.files) {
        const excludedVars = settings?.advanced?.excludedEnvVars || DEFAULT_EXCLUDED_ENV_VARS;
        for (const key in envFile.parsedEnv) {
            if (!canApplyParsedEnvKey(envFile, key, excludedVars, { reload: true })) {
                continue;
            }
            if (!newDotEnvKeys.has(key)) {
                newDotEnvKeys.set(key, envFile.parsedEnv[key]);
            }
        }
    }
    if (settings.env) {
        for (const [key, value] of Object.entries(settings.env)) {
            if (RELOAD_EXCLUDED_KEYS.has(key))
                continue;
            if (PROJECT_ENV_HARDCODED_EXCLUSIONS.includes(key))
                continue;
            if (typeof value !== 'string')
                continue;
            const dotEnvValue = newDotEnvKeys.get(key);
            if (dotEnvValue !== undefined && dotEnvValue !== '')
                continue;
            // When .env read failed, use the snapshot as the shadow set so
            // settings.env keys that were previously shadowed by .env don't
            // accidentally overwrite the still-live .env values in process.env.
            if (dotEnvReadFailed && lastReloadSnapshot.has(key))
                continue;
            newSettingsEnvKeys.set(key, value);
        }
    }
    // Union of all new keys
    const allNewKeys = new Set([
        ...newDotEnvKeys.keys(),
        ...newSettingsEnvKeys.keys(),
    ]);
    const updatedKeys = [];
    const removedKeys = [];
    // Delete keys previously known (from tracking Sets OR the boot snapshot)
    // that are no longer in any source file. The snapshot covers keys that
    // ACP children inherited from the daemon without tracking.
    // Skip deletion entirely if the .env file became unreadable — treat as
    // transient I/O failure rather than intentional key removal.
    if (!dotEnvReadFailed) {
        const previouslyKnown = new Set([
            ...lastReloadSnapshot.keys(),
            ...dotEnvSourcedKeys,
            ...settingsEnvSourcedKeys,
        ]);
        for (const key of previouslyKnown) {
            if (!allNewKeys.has(key) && !RELOAD_EXCLUDED_KEYS.has(key)) {
                delete process.env[key];
                removedKeys.push(key);
            }
        }
    }
    // Force-write all source keys. RELOAD_EXCLUDED_KEYS are already filtered
    // at parse time so dangerous keys (PATH, HOME, etc.) never reach here.
    // This unconditional write is necessary because ACP children inherit
    // daemon env without tracking, so the tracking-based guard would miss them.
    for (const [key, value] of newDotEnvKeys) {
        if (value === '' && newSettingsEnvKeys.has(key))
            continue;
        if (process.env[key] !== value) {
            updatedKeys.push(key);
        }
        process.env[key] = value;
    }
    for (const [key, value] of newSettingsEnvKeys) {
        if (process.env[key] !== value) {
            updatedKeys.push(key);
        }
        process.env[key] = value;
    }
    // Update tracking sets and snapshot only when the .env file was readable.
    // A transient read failure must not wipe provenance — the stale tracking
    // state is needed so the next successful reload can still detect deletions.
    if (!dotEnvReadFailed) {
        dotEnvSourcedKeys.clear();
        for (const key of newDotEnvKeys.keys()) {
            dotEnvSourcedKeys.add(key);
        }
        lastReloadSnapshot.clear();
        for (const [key, value] of newDotEnvKeys) {
            lastReloadSnapshot.set(key, value);
        }
        for (const [key, value] of newSettingsEnvKeys) {
            lastReloadSnapshot.set(key, value);
        }
    }
    // settings.env is always readable (from settings.json, not a file),
    // so its tracking set is always updated.
    settingsEnvSourcedKeys.clear();
    for (const key of newSettingsEnvKeys.keys()) {
        settingsEnvSourcedKeys.add(key);
    }
    return { updatedKeys, removedKeys };
}
//# sourceMappingURL=environment.js.map