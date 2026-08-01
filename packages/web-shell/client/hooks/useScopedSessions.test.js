import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// @vitest-environment jsdom
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
const primarySessions = [
    { sessionId: 'primary', workspaceCwd: '/primary' },
];
const primaryDeleteSessions = vi.fn();
const primaryReload = vi.fn();
const primaryDeleteSession = vi.fn();
const primaryReleaseSession = vi.fn();
const listWorkspaceSessions = vi.fn();
const deleteSessionsData = vi.fn();
const workspaceByCwd = vi.fn(() => ({
    listWorkspaceSessions,
    deleteSessionsData,
}));
const workspaceClient = { workspaceByCwd };
vi.mock('@hoptrendy/webui/daemon-react-sdk', () => ({
    useSessions: () => ({
        sessions: primarySessions,
        loading: false,
        error: undefined,
        reload: primaryReload,
        deleteSession: primaryDeleteSession,
        deleteSessions: primaryDeleteSessions,
        releaseSession: primaryReleaseSession,
    }),
    useWorkspace: () => ({ client: workspaceClient }),
}));
const { useScopedSessions } = await import('./useScopedSessions');
let root = null;
let container = null;
function Probe({ cwd }) {
    const { sessions, deleteSessions } = useScopedSessions(cwd, {
        autoLoad: true,
    });
    return (_jsxs("div", { children: [_jsx("span", { "data-testid": "sessions", children: sessions.map((session) => session.sessionId).join(',') }), _jsx("button", { onClick: () => void deleteSessions(['secondary']), children: "delete" })] }));
}
function render(cwd) {
    act(() => root.render(_jsx(Probe, { cwd: cwd })));
}
beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
    listWorkspaceSessions.mockReset();
    deleteSessionsData.mockReset();
    workspaceByCwd.mockClear();
    primaryDeleteSessions.mockReset();
});
afterEach(() => {
    act(() => root?.unmount());
    container?.remove();
    root = null;
    container = null;
});
describe('useScopedSessions', () => {
    it('loads and mutates sessions through the requested workspace', async () => {
        listWorkspaceSessions.mockResolvedValue([
            { sessionId: 'secondary', workspaceCwd: '/wrong' },
        ]);
        deleteSessionsData.mockResolvedValue({
            removed: ['secondary'],
            notFound: [],
            errors: [],
        });
        render('/secondary');
        await act(async () => {
            await listWorkspaceSessions.mock.results[0]?.value;
        });
        expect(container.querySelector('[data-testid="sessions"]')?.textContent).toBe('secondary');
        expect(workspaceByCwd).toHaveBeenCalledWith('/secondary');
        expect(listWorkspaceSessions).toHaveBeenCalledWith({
            pageSize: undefined,
            archiveState: undefined,
            view: undefined,
            group: undefined,
            sourceType: 'default',
        });
        await act(async () => {
            container.querySelector('button').click();
            await Promise.resolve();
            await Promise.resolve();
        });
        expect(deleteSessionsData).toHaveBeenCalledWith(['secondary']);
        expect(primaryDeleteSessions).not.toHaveBeenCalled();
    });
    it('ignores an older workspace response after the cwd changes', async () => {
        let resolveA;
        let resolveB;
        listWorkspaceSessions
            .mockImplementationOnce(() => new Promise((resolve) => {
            resolveA = resolve;
        }))
            .mockImplementationOnce(() => new Promise((resolve) => {
            resolveB = resolve;
        }));
        render('/a');
        render('/b');
        await act(async () => {
            resolveA([{ sessionId: 'a', workspaceCwd: '/a' }]);
            await Promise.resolve();
        });
        expect(container.querySelector('[data-testid="sessions"]')?.textContent).toBe('');
        await act(async () => {
            resolveB([{ sessionId: 'b', workspaceCwd: '/b' }]);
            await Promise.resolve();
        });
        expect(container.querySelector('[data-testid="sessions"]')?.textContent).toBe('b');
    });
});
//# sourceMappingURL=useScopedSessions.test.js.map