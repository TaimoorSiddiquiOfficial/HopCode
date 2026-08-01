/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import * as fs from 'node:fs';
import * as path from 'node:path';
import { atomicWriteFileSync, FatalConfigError, getErrorMessage, ideContextStore, Storage, } from '@hoptrendy/hopcode-core';
import { parse, stringify } from 'comment-json';
import stripJsonComments from 'strip-json-comments';
import { applyUpdates } from '../utils/commentJson.js';
import { writeStderrLine } from '../utils/stdioHelpers.js';
import { arePathsEquivalent, getPathComparisonVariants, isWithinRoot, } from './path-comparison.js';
export const TRUSTED_FOLDERS_FILENAME = 'trustedFolders.json';
export function getTrustedFoldersPath() {
    if (process.env['HOPCODE_CODE_TRUSTED_FOLDERS_PATH']) {
        return process.env['HOPCODE_CODE_TRUSTED_FOLDERS_PATH'];
    }
    if (process.env['HOPCODE_TRUSTED_FOLDERS_PATH']) {
        return process.env['HOPCODE_TRUSTED_FOLDERS_PATH'];
    }
    // Resolve lazily on every call: see settings.ts:getUserSettingsPath for why
    // a top-level const would be stale after `preResolveHomeEnvOverrides()`.
    return path.join(Storage.getGlobalHopCodeDir(), TRUSTED_FOLDERS_FILENAME);
}
export var TrustLevel;
(function (TrustLevel) {
    TrustLevel["TRUST_FOLDER"] = "TRUST_FOLDER";
    TrustLevel["TRUST_PARENT"] = "TRUST_PARENT";
    TrustLevel["DO_NOT_TRUST"] = "DO_NOT_TRUST";
})(TrustLevel || (TrustLevel = {}));
export class LoadedTrustedFolders {
    user;
    errors;
    constructor(user, errors) {
        this.user = user;
        this.errors = errors;
    }
    get rules() {
        return Object.entries(this.user.config).map(([path, trustLevel]) => ({
            path,
            trustLevel,
        }));
    }
    /**
     * Returns true or false if the path should be "trusted". This function
     * should only be invoked when the folder trust setting is active.
     *
     * @param location path
     * @returns
     */
    isPathTrusted(location) {
        const trustedPaths = [];
        const untrustedPaths = [];
        for (const rule of this.rules) {
            switch (rule.trustLevel) {
                case TrustLevel.TRUST_FOLDER:
                    trustedPaths.push(rule.path);
                    break;
                case TrustLevel.TRUST_PARENT:
                    trustedPaths.push(path.dirname(rule.path));
                    break;
                case TrustLevel.DO_NOT_TRUST:
                    untrustedPaths.push(rule.path);
                    break;
                default:
                    // Do nothing for unknown trust levels.
                    break;
            }
        }
        const locationVariants = getPathComparisonVariants(location);
        for (const trustedPath of trustedPaths) {
            for (const locationVariant of locationVariants) {
                for (const trustedVariant of getPathComparisonVariants(trustedPath)) {
                    if (isWithinRoot(locationVariant, trustedVariant)) {
                        return true;
                    }
                }
            }
        }
        for (const untrustedPath of untrustedPaths) {
            for (const locationVariant of locationVariants) {
                for (const untrustedVariant of getPathComparisonVariants(untrustedPath)) {
                    if (locationVariant === untrustedVariant) {
                        return false;
                    }
                }
            }
        }
        return undefined;
    }
    setValue(path, trustLevel) {
        this.user.config[path] = trustLevel;
        saveTrustedFolders(this.user);
    }
}
let loadedTrustedFolders;
/**
 * FOR TESTING PURPOSES ONLY.
 * Resets the in-memory cache of the trusted folders configuration.
 */
export function resetTrustedFoldersForTesting() {
    loadedTrustedFolders = undefined;
}
export function loadTrustedFolders() {
    if (loadedTrustedFolders) {
        return loadedTrustedFolders;
    }
    const errors = [];
    let userConfig = {};
    const userPath = getTrustedFoldersPath();
    // Load user trusted folders
    try {
        if (fs.existsSync(userPath)) {
            const content = fs.readFileSync(userPath, 'utf-8');
            const parsed = JSON.parse(stripJsonComments(content));
            if (typeof parsed !== 'object' ||
                parsed === null ||
                Array.isArray(parsed)) {
                errors.push({
                    message: 'Trusted folders file is not a valid JSON object.',
                    path: userPath,
                });
            }
            else {
                userConfig = parsed;
            }
        }
    }
    catch (error) {
        errors.push({
            message: getErrorMessage(error),
            path: userPath,
        });
    }
    loadedTrustedFolders = new LoadedTrustedFolders({ path: userPath, config: userConfig }, errors);
    return loadedTrustedFolders;
}
export function saveTrustedFolders(trustedFoldersFile) {
    try {
        // Ensure the directory exists
        const dirPath = path.dirname(trustedFoldersFile.path);
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }
        let content = stringify(trustedFoldersFile.config, null, 2);
        if (fs.existsSync(trustedFoldersFile.path)) {
            try {
                // Intentionally keep the comment-preserving round-trip local here
                // instead of reusing updateSettingsFilePreservingFormat(), because
                // trustedFolders.json must continue to use atomicWriteFileSync with
                // noFollow:true when it is finally written to disk.
                const originalContent = fs.readFileSync(trustedFoldersFile.path, 'utf-8');
                const parsed = parse(originalContent);
                if (typeof parsed !== 'object' ||
                    parsed === null ||
                    Array.isArray(parsed) ||
                    parsed instanceof String ||
                    parsed instanceof Number ||
                    parsed instanceof Boolean) {
                    throw new Error('trusted folders file is not a JSON object');
                }
                const updated = applyUpdates(parsed, trustedFoldersFile.config, true);
                const preservedContent = stringify(updated, null, 2);
                // Validate the serialized output before writing. If the round-trip
                // fails at any point, fall back to writing a clean normalized file so
                // a corrupted trustedFolders.json can still self-heal on save.
                parse(preservedContent);
                content = preservedContent;
            }
            catch (error) {
                // Fall back to a clean rewrite when comment-preserving round-trip fails.
                writeStderrLine(`Falling back to clean rewrite for trusted folders: ${error instanceof Error ? error.message : String(error)}`);
            }
        }
        atomicWriteFileSync(trustedFoldersFile.path, content, 
        // noFollow: refuse to follow any pre-placed symlink at the
        // config path — a redirected write could either leak the
        // trusted-folder list to an attacker target or leave the user's
        // real config silently stale. Matches the credential write
        // sites' security posture (sharedTokenManager, oauth-token-storage,
        // file-token-storage all use noFollow:true).
        { encoding: 'utf-8', mode: 0o600, forceMode: true, noFollow: true });
    }
    catch (error) {
        writeStderrLine('Error saving trusted folders file.');
        writeStderrLine(error instanceof Error ? error.message : String(error));
    }
}
/** Is folder trust feature enabled per the current applied settings */
export function isFolderTrustEnabled(settings) {
    const folderTrustSetting = settings.security?.folderTrust?.enabled ?? false;
    return folderTrustSetting;
}
function isWithinRootAcrossVariants(childPath, parentPath) {
    for (const childVariant of getPathComparisonVariants(childPath)) {
        for (const parentVariant of getPathComparisonVariants(parentPath)) {
            if (isWithinRoot(childVariant, parentVariant)) {
                return true;
            }
        }
    }
    return false;
}
function getExplicitTrustLevel(trustConfig, workspaceCwd) {
    for (const [rulePath, trustLevel] of Object.entries(trustConfig)) {
        if (trustLevel === TrustLevel.TRUST_FOLDER &&
            isWithinRootAcrossVariants(workspaceCwd, rulePath)) {
            return trustLevel;
        }
        if (trustLevel === TrustLevel.TRUST_PARENT &&
            isWithinRootAcrossVariants(workspaceCwd, path.dirname(rulePath))) {
            return trustLevel;
        }
    }
    for (const [rulePath, trustLevel] of Object.entries(trustConfig)) {
        if (trustLevel === TrustLevel.DO_NOT_TRUST &&
            arePathsEquivalent(workspaceCwd, rulePath)) {
            return trustLevel;
        }
    }
    return null;
}
function loadTrustedFoldersWithOverrides(trustConfig) {
    const folders = loadTrustedFolders();
    if (folders.errors.length > 0) {
        const errorMessages = folders.errors.map((error) => `Error in ${error.path}: ${error.message}`);
        throw new FatalConfigError(`${errorMessages.join('\n')}\nPlease fix the configuration file and try again.`);
    }
    if (trustConfig) {
        // Return a fresh instance instead of mutating the cached singleton. Callers
        // pass an override to *preview* trust status for a tentative config (e.g.
        // useTrustModify's updateTrustLevel, which builds the config "to check the
        // new trust status without writing"). Mutating the cached singleton here
        // would leak that unconfirmed config into every later loadTrustedFolders()
        // read and persist it on the next setValue().
        return new LoadedTrustedFolders({ ...folders.user, config: trustConfig }, folders.errors);
    }
    return folders;
}
function trustStatusToResult(status) {
    if (status.effective.source === 'disabled') {
        return { isTrusted: true, source: undefined };
    }
    return {
        isTrusted: status.effective.state === 'trusted'
            ? true
            : status.effective.state === 'untrusted'
                ? false
                : undefined,
        source: status.effective.source === 'file' || status.effective.source === 'ide'
            ? status.effective.source
            : undefined,
    };
}
export function getWorkspaceTrustStatus(settings, workspaceCwd, trustConfig) {
    if (!isFolderTrustEnabled(settings)) {
        return {
            v: 1,
            workspaceCwd,
            folderTrustEnabled: false,
            effective: { state: 'trusted', source: 'disabled' },
            explicitTrustLevel: null,
            requiresDaemonRestartForChanges: true,
        };
    }
    const ideTrust = ideContextStore.get()?.workspaceState?.isTrusted;
    if (ideTrust !== undefined &&
        arePathsEquivalent(workspaceCwd, process.cwd())) {
        return {
            v: 1,
            workspaceCwd,
            folderTrustEnabled: true,
            effective: {
                state: ideTrust ? 'trusted' : 'untrusted',
                source: 'ide',
            },
            explicitTrustLevel: null,
            requiresDaemonRestartForChanges: true,
        };
    }
    const folders = loadTrustedFoldersWithOverrides(trustConfig);
    const isTrusted = folders.isPathTrusted(workspaceCwd);
    const state = isTrusted === true
        ? 'trusted'
        : isTrusted === false
            ? 'untrusted'
            : 'unknown';
    return {
        v: 1,
        workspaceCwd,
        folderTrustEnabled: true,
        effective: {
            state,
            source: isTrusted === undefined ? 'none' : 'file',
        },
        explicitTrustLevel: getExplicitTrustLevel(folders.user.config, workspaceCwd),
        requiresDaemonRestartForChanges: true,
    };
}
export function isWorkspaceTrusted(settings, trustConfig, workspacePath) {
    if (!isFolderTrustEnabled(settings)) {
        return { isTrusted: true, source: undefined };
    }
    const ideTrust = ideContextStore.get()?.workspaceState?.isTrusted;
    if (ideTrust !== undefined &&
        (workspacePath === undefined ||
            arePathsEquivalent(workspacePath, process.cwd()))) {
        return { isTrusted: ideTrust, source: 'ide' };
    }
    return trustStatusToResult(getWorkspaceTrustStatus(settings, workspacePath ?? process.cwd(), trustConfig));
}
//# sourceMappingURL=trustedFolders.js.map