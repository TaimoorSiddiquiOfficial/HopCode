// @vitest-environment jsdom
/**
 * @license
 * Copyright 2025 Qwen Team
 * SPDX-License-Identifier: Apache-2.0
 */
import * as React from 'react';
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useSessionArtifacts, } from './useSessionArtifacts';
Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
const sdkMock = vi.hoisted(() => ({
    actions: {
        loadArtifacts: vi.fn(),
    },
    connection: {
        status: 'connected',
        sessionId: 'session-a',
        capabilities: { features: ['session_artifacts'] },
    },
    promptStatus: 'idle',
    artifactsVersion: 0,
}));
vi.mock('@hoptrendy/webui/daemon-react-sdk', () => ({
    useActions: () => sdkMock.actions,
    useConnection: () => sdkMock.connection,
    usePromptStatus: () => sdkMock.promptStatus,
    useWorkspaceEventSignals: () => ({
        artifactsVersion: sdkMock.artifactsVersion,
    }),
}));
let root = null;
let container = null;
let latestState;
function deferred() {
    let resolve;
    const promise = new Promise((done) => {
        resolve = done;
    });
    if (!resolve)
        throw new Error('deferred promise did not initialize');
    return { promise, resolve };
}
function artifact(id) {
    return {
        id,
        kind: 'html',
        storage: 'workspace',
        source: 'tool',
        status: 'available',
        title: id,
        workspacePath: `${id}.html`,
        clientRetained: false,
        createdAt: '2026-07-09T00:00:00.000Z',
        updatedAt: '2026-07-09T00:00:00.000Z',
    };
}
function TestHost() {
    latestState = useSessionArtifacts();
    return null;
}
async function renderHookHost() {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
    await act(async () => {
        root?.render(React.createElement(TestHost));
    });
}
async function rerenderHookHost() {
    await act(async () => {
        root?.render(React.createElement(TestHost));
    });
}
beforeEach(() => {
    latestState = undefined;
    sdkMock.connection = {
        status: 'connected',
        sessionId: 'session-a',
        capabilities: { features: ['session_artifacts'] },
    };
    sdkMock.promptStatus = 'idle';
    sdkMock.artifactsVersion = 0;
    sdkMock.actions.loadArtifacts.mockReset();
});
afterEach(async () => {
    if (root) {
        await act(async () => {
            root?.unmount();
        });
        root = null;
    }
    container?.remove();
    container = null;
});
describe('useSessionArtifacts', () => {
    it('clears stale artifacts while loading a different session', async () => {
        const sessionA = deferred();
        const sessionB = deferred();
        sdkMock.actions.loadArtifacts
            .mockReturnValueOnce(sessionA.promise)
            .mockReturnValueOnce(sessionB.promise);
        await renderHookHost();
        await act(async () => {
            sessionA.resolve({ artifacts: [artifact('from-session-a')] });
            await sessionA.promise;
        });
        expect(latestState?.artifacts.map((item) => item.id)).toEqual([
            'from-session-a',
        ]);
        sdkMock.connection = {
            status: 'connected',
            sessionId: 'session-b',
            capabilities: { features: ['session_artifacts'] },
        };
        await rerenderHookHost();
        expect(latestState?.loading).toBe(true);
        expect(latestState?.artifacts).toEqual([]);
        await act(async () => {
            sessionB.resolve({ artifacts: [artifact('from-session-b')] });
            await sessionB.promise;
        });
        expect(latestState?.artifacts.map((item) => item.id)).toEqual([
            'from-session-b',
        ]);
    });
    it('keeps current artifacts visible while refreshing the same session', async () => {
        const initialLoad = deferred();
        const refreshLoad = deferred();
        sdkMock.actions.loadArtifacts
            .mockReturnValueOnce(initialLoad.promise)
            .mockReturnValueOnce(refreshLoad.promise);
        await renderHookHost();
        await act(async () => {
            initialLoad.resolve({ artifacts: [artifact('current-artifact')] });
            await initialLoad.promise;
        });
        sdkMock.artifactsVersion = 1;
        await rerenderHookHost();
        expect(latestState?.loading).toBe(true);
        expect(latestState?.artifacts.map((item) => item.id)).toEqual([
            'current-artifact',
        ]);
        await act(async () => {
            refreshLoad.resolve({ artifacts: [artifact('refreshed-artifact')] });
            await refreshLoad.promise;
        });
        expect(latestState?.artifacts.map((item) => item.id)).toEqual([
            'refreshed-artifact',
        ]);
    });
});
//# sourceMappingURL=useSessionArtifacts.test.js.map