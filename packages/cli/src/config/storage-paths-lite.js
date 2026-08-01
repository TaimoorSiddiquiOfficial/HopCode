/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import * as os from 'node:os';
import * as path from 'node:path';
// Keep this literal in sync with core's HOPCODE_DIR. This lite module must not
// import @hoptrendy/hopcode-core because it runs before serve listener ready.
export const SETTINGS_DIRECTORY_NAME = '.hopcode';
export function resolveConfigPathLite(dir, cwd) {
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
        resolved = path.resolve(cwd || process.cwd(), resolved);
    }
    return resolved;
}
export function getGlobalhopcodeDirLite() {
    const envDir = process.env['HOPCODE_HOME'];
    if (envDir) {
        return resolveConfigPathLite(envDir);
    }
    const homeDir = os.homedir();
    if (!homeDir) {
        return path.join(os.tmpdir(), SETTINGS_DIRECTORY_NAME);
    }
    return path.join(homeDir, SETTINGS_DIRECTORY_NAME);
}
export function getSystemSettingsPath() {
    if (process.env['HOPCODE_CODE_SYSTEM_SETTINGS_PATH']) {
        return process.env['HOPCODE_CODE_SYSTEM_SETTINGS_PATH'];
    }
    if (os.platform() === 'darwin') {
        return '/Library/Application Support/HopCode/settings.json';
    }
    if (os.platform() === 'win32') {
        return 'C:\\ProgramData\\hopcode\\settings.json';
    }
    return '/etc/hopcode/settings.json';
}
export function getSystemDefaultsPath() {
    if (process.env['HOPCODE_CODE_SYSTEM_DEFAULTS_PATH']) {
        return process.env['HOPCODE_CODE_SYSTEM_DEFAULTS_PATH'];
    }
    return path.join(path.dirname(getSystemSettingsPath()), 'system-defaults.json');
}
//# sourceMappingURL=storage-paths-lite.js.map