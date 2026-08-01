/**
 * @license
 * Copyright 2026 Qwen Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { createHash } from 'node:crypto';
import { constants } from 'node:fs';
import * as fs from 'node:fs/promises';
import * as os from 'node:os';
import * as path from 'node:path';
import lockfile from 'proper-lockfile';
import { MAX_WORKSPACE_PATH_LENGTH } from '@hoptrendy/acp-bridge/workspacePaths';
import { getGlobalhopcodeDirLite } from '../config/storage-paths-lite.js';
import { MAX_REGISTERED_WORKSPACES } from './workspace-inputs.js';
const SCHEMA_VERSION = 1;
const MAX_SECONDARY_WORKSPACES = MAX_REGISTERED_WORKSPACES - 1;
const MAX_STORE_BYTES = 256 * 1024;
const LOCK_OPTIONS = {
    realpath: false,
    stale: 10_000,
    update: 2_000,
    retries: {
        retries: 120,
        minTimeout: 10,
        maxTimeout: 100,
        factor: 1.2,
        randomize: true,
    },
};
export class WorkspaceRegistrationStoreError extends Error {
    constructor(message) {
        super(message);
        this.name = 'WorkspaceRegistrationStoreError';
    }
}
export class WorkspaceRegistrationStoreLimitError extends WorkspaceRegistrationStoreError {
}
export class WorkspaceRegistrationStoreCommittedError extends WorkspaceRegistrationStoreError {
}
function normalizedScopePath(primaryWorkspace) {
    return os.platform() === 'win32'
        ? primaryWorkspace.toLowerCase()
        : primaryWorkspace;
}
export function workspaceRegistrationScopeHash(primaryWorkspace) {
    return createHash('sha256')
        .update(normalizedScopePath(primaryWorkspace))
        .digest('hex');
}
export function workspaceRegistrationId(workspace) {
    return createHash('sha256').update(workspace).digest('hex').slice(0, 16);
}
export function getWorkspaceRegistrationStorePath(primaryWorkspace, qwenHome = getGlobalhopcodeDirLite()) {
    return path.join(qwenHome, 'daemon', 'workspaces', `${workspaceRegistrationScopeHash(primaryWorkspace)}.json`);
}
function emptySnapshot(primaryWorkspace) {
    return {
        schemaVersion: SCHEMA_VERSION,
        primaryWorkspace,
        workspaces: [],
    };
}
function validateWorkspacePath(value, label) {
    if (typeof value !== 'string' || !path.isAbsolute(value)) {
        throw new WorkspaceRegistrationStoreError(`${label} must be an absolute path`);
    }
    if (value.includes('\0') || value.length > MAX_WORKSPACE_PATH_LENGTH) {
        throw new WorkspaceRegistrationStoreError(`${label} is invalid`);
    }
    return value;
}
function parseSnapshot(raw, primaryWorkspace) {
    let value;
    try {
        value = JSON.parse(raw);
    }
    catch {
        throw new WorkspaceRegistrationStoreError('Workspace registration store contains malformed JSON');
    }
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
        throw new WorkspaceRegistrationStoreError('Workspace registration store root must be an object');
    }
    const record = value;
    if (record['schemaVersion'] !== SCHEMA_VERSION) {
        throw new WorkspaceRegistrationStoreError(`Unsupported workspace registration schema ${String(record['schemaVersion'])}`);
    }
    const storedPrimary = validateWorkspacePath(record['primaryWorkspace'], 'primaryWorkspace');
    if (normalizedScopePath(storedPrimary) !== normalizedScopePath(primaryWorkspace)) {
        throw new WorkspaceRegistrationStoreError('Workspace registration store primary does not match this daemon');
    }
    if (!Array.isArray(record['workspaces'])) {
        throw new WorkspaceRegistrationStoreError('Workspace registration store workspaces must be an array');
    }
    if (record['workspaces'].length > MAX_SECONDARY_WORKSPACES) {
        throw new WorkspaceRegistrationStoreError(`Workspace registration store exceeds ${MAX_SECONDARY_WORKSPACES} entries`);
    }
    const seen = new Set();
    const workspaces = record['workspaces'].map((entry, index) => {
        const workspace = validateWorkspacePath(entry, `workspaces[${index}]`);
        const normalizedWorkspace = normalizedScopePath(workspace);
        if (normalizedWorkspace === normalizedScopePath(primaryWorkspace)) {
            throw new WorkspaceRegistrationStoreError('Primary workspace cannot be stored as a secondary registration');
        }
        if (seen.has(normalizedWorkspace)) {
            throw new WorkspaceRegistrationStoreError('Workspace registration store contains duplicate paths');
        }
        seen.add(normalizedWorkspace);
        return workspace;
    });
    return { schemaVersion: SCHEMA_VERSION, primaryWorkspace, workspaces };
}
const updateChains = new Map();
async function withInProcessLock(filePath, work) {
    const previous = updateChains.get(filePath) ?? Promise.resolve();
    const next = previous.then(work, work);
    const settled = next
        .catch(() => undefined)
        .finally(() => {
        if (updateChains.get(filePath) === settled)
            updateChains.delete(filePath);
    });
    updateChains.set(filePath, settled);
    return next;
}
function compromisedLockError() {
    return new WorkspaceRegistrationStoreError('Workspace registration store lock was compromised');
}
async function acquireFileLock(filePath) {
    await fs.mkdir(path.dirname(filePath), { recursive: true, mode: 0o700 });
    let compromised = false;
    const release = await lockfile.lock(filePath, {
        ...LOCK_OPTIONS,
        onCompromised: () => {
            compromised = true;
        },
    });
    return {
        assertOwned: () => {
            if (compromised)
                throw compromisedLockError();
        },
        release: async () => {
            try {
                await release();
            }
            catch (err) {
                if (!compromised)
                    throw err;
            }
            if (compromised)
                throw compromisedLockError();
        },
    };
}
export class WorkspaceRegistrationStore {
    primaryWorkspace;
    filePath;
    constructor(primaryWorkspace, qwenHome) {
        this.primaryWorkspace = primaryWorkspace;
        validateWorkspacePath(primaryWorkspace, 'primaryWorkspace');
        this.filePath = getWorkspaceRegistrationStorePath(primaryWorkspace, qwenHome);
    }
    /** Returns an unlocked point-in-time snapshot; mutations re-read under lock. */
    async read() {
        try {
            const entry = await fs.lstat(this.filePath);
            if (entry.isSymbolicLink() || !entry.isFile()) {
                throw new WorkspaceRegistrationStoreError('Workspace registration store must be a regular file');
            }
        }
        catch (err) {
            if (err.code === 'ENOENT') {
                return emptySnapshot(this.primaryWorkspace);
            }
            throw err;
        }
        let file;
        try {
            file = await fs.open(this.filePath, (constants.O_RDONLY ?? 0) | (constants.O_NOFOLLOW ?? 0));
        }
        catch (err) {
            if (err.code === 'ENOENT') {
                return emptySnapshot(this.primaryWorkspace);
            }
            if (err.code === 'ELOOP') {
                throw new WorkspaceRegistrationStoreError('Workspace registration store must be a regular file');
            }
            throw err;
        }
        try {
            const stat = await file.stat();
            if (!stat.isFile()) {
                throw new WorkspaceRegistrationStoreError('Workspace registration store must be a regular file');
            }
            if (stat.size > MAX_STORE_BYTES) {
                throw new WorkspaceRegistrationStoreError(`Workspace registration store exceeds ${MAX_STORE_BYTES} bytes`);
            }
            let buffer = Buffer.alloc(Math.max(1, Math.min(stat.size + 1, MAX_STORE_BYTES + 1)));
            let totalBytesRead = 0;
            for (;;) {
                if (totalBytesRead === buffer.length) {
                    if (totalBytesRead > MAX_STORE_BYTES)
                        break;
                    const grown = Buffer.alloc(Math.min(MAX_STORE_BYTES + 1, Math.max(buffer.length * 2, totalBytesRead + 1)));
                    buffer.copy(grown, 0, 0, totalBytesRead);
                    buffer = grown;
                }
                const { bytesRead } = await file.read(buffer, totalBytesRead, buffer.length - totalBytesRead, totalBytesRead);
                if (bytesRead === 0)
                    break;
                totalBytesRead += bytesRead;
            }
            if (totalBytesRead > MAX_STORE_BYTES) {
                throw new WorkspaceRegistrationStoreError(`Workspace registration store exceeds ${MAX_STORE_BYTES} bytes`);
            }
            return parseSnapshot(buffer.toString('utf8', 0, totalBytesRead), this.primaryWorkspace);
        }
        finally {
            await file.close();
        }
    }
    async add(workspace) {
        validateWorkspacePath(workspace, 'workspace');
        if (normalizedScopePath(workspace) ===
            normalizedScopePath(this.primaryWorkspace)) {
            throw new WorkspaceRegistrationStoreError('Primary workspace cannot be stored as a secondary registration');
        }
        return this.update((snapshot) => {
            const normalizedWorkspace = normalizedScopePath(workspace);
            if (snapshot.workspaces.some((stored) => normalizedScopePath(stored) === normalizedWorkspace)) {
                return false;
            }
            if (snapshot.workspaces.length >= MAX_SECONDARY_WORKSPACES) {
                throw new WorkspaceRegistrationStoreLimitError(`Workspace registration store limit of ${MAX_SECONDARY_WORKSPACES} reached`);
            }
            snapshot.workspaces.push(workspace);
            return true;
        });
    }
    async removeById(id) {
        return (await this.removeByIds([id])) > 0;
    }
    async removeByIds(ids) {
        const requested = new Set(ids);
        if (requested.size === 0)
            return 0;
        let removed = 0;
        await this.update((snapshot) => {
            const retained = snapshot.workspaces.filter((workspace) => {
                if (!requested.has(workspaceRegistrationId(workspace)))
                    return true;
                removed++;
                return false;
            });
            if (removed === 0)
                return false;
            snapshot.workspaces.splice(0, snapshot.workspaces.length, ...retained);
            return true;
        });
        return removed;
    }
    async update(mutate) {
        const { atomicWriteFile } = await import('@hoptrendy/hopcode-core');
        return withInProcessLock(this.filePath, async () => {
            const lock = await acquireFileLock(this.filePath);
            let committed = false;
            let changed = false;
            let workError;
            try {
                const snapshot = await this.read();
                lock.assertOwned();
                changed = mutate(snapshot);
                if (changed) {
                    lock.assertOwned();
                    await atomicWriteFile(this.filePath, `${JSON.stringify(snapshot, null, 2)}\n`, { mode: 0o600, forceMode: true, noFollow: true });
                    committed = true;
                }
            }
            catch (err) {
                workError = err;
            }
            let releaseError;
            try {
                await lock.release();
            }
            catch (err) {
                releaseError = committed
                    ? new WorkspaceRegistrationStoreCommittedError(`Workspace registration update committed but lock release failed: ${err instanceof Error ? err.message : String(err)}`)
                    : err;
            }
            if (workError instanceof Error &&
                releaseError !== undefined &&
                workError.cause === undefined) {
                workError.cause = releaseError;
            }
            if (workError !== undefined)
                throw workError;
            if (releaseError !== undefined)
                throw releaseError;
            return changed;
        });
    }
}
//# sourceMappingURL=workspace-registration-store.js.map