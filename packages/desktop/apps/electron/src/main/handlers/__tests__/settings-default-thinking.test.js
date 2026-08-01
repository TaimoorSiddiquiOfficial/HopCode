import { beforeEach, describe, expect, it, mock } from 'bun:test';
import { RPC_CHANNELS } from '../../../shared/types';
const requestContext = {
    clientId: 'client-1',
    workspaceId: null,
    webContentsId: null,
};
const getDefaultThinkingLevelMock = mock(() => 'think');
const setDefaultThinkingLevelMock = mock((_level) => true);
const setVoiceModelMock = mock((_model) => { });
let mockedWorkspace = null;
let mockedWorkspaceConfig = null;
const getWorkspaceByNameOrIdMock = mock((_workspaceId) => mockedWorkspace);
const loadWorkspaceConfigMock = mock((_rootPath) => mockedWorkspaceConfig);
const getHopCodeCoreSettingsViaAcpMock = mock(async () => ({
    user: {
        path: '',
        values: { 'tools.approvalMode': 'izn' },
        mcpServers: [],
        hooks: [],
    },
    workspace: { path: '', values: {}, mcpServers: [], hooks: [] },
    merged: {
        values: {},
        mcpServers: [],
        hooks: [],
        extensions: [],
    },
    workspaceTrusted: true,
}));
const setHopCodeCoreSettingViaAcpMock = mock(async () => ({
    user: { path: '', values: {}, mcpServers: [], hooks: [] },
    workspace: { path: '', values: {}, mcpServers: [], hooks: [] },
    merged: {
        values: { 'tools.approvalMode': 'izn' },
        mcpServers: [],
        hooks: [],
        extensions: [],
    },
    workspaceTrusted: true,
}));
const applyGlobalPermissionModeMock = mock(async (_mode) => { });
const getHopCodeMemoryPathsViaAcpMock = mock(async (_options) => ({
    userMemoryFile: '/tmp/HOPCODE.md',
    projectMemoryFile: '/tmp/project/AGENTS.md',
    autoMemoryDir: '/tmp/project/memory',
}));
const getHopCodeMemorySettingsViaAcpMock = mock(async (_options) => ({}));
const setHopCodeMemorySettingsViaAcpMock = mock(async (_options, _updates) => ({}));
mock.module('@craft-agent/shared/config', () => ({
    getPreferencesPath: () => '/tmp/preferences.json',
    getSessionDraft: () => null,
    setSessionDraft: () => { },
    deleteSessionDraft: () => { },
    getAllSessionDrafts: () => ({}),
    getWorkspaceByNameOrId: getWorkspaceByNameOrIdMock,
    getDefaultThinkingLevel: getDefaultThinkingLevelMock,
    setDefaultThinkingLevel: setDefaultThinkingLevelMock,
    setVoiceModel: setVoiceModelMock,
    isProtectedWorkspace: () => false,
}));
mock.module('@craft-agent/shared/config/storage', () => ({
    setVoiceModel: setVoiceModelMock,
}));
mock.module('@craft-agent/shared/workspaces', () => ({
    loadWorkspaceConfig: loadWorkspaceConfigMock,
}));
mock.module('@craft-agent/shared/agent', () => ({
    getHopCodeCoreSettingsViaAcp: getHopCodeCoreSettingsViaAcpMock,
    setHopCodeCoreSettingViaAcp: setHopCodeCoreSettingViaAcpMock,
    setHopCodeMcpServerViaAcp: mock(async () => ({})),
    removeHopCodeMcpServerViaAcp: mock(async () => ({})),
    setHopCodeHookViaAcp: mock(async () => ({})),
    removeHopCodeHookViaAcp: mock(async () => ({})),
    setHopCodeExtensionSettingViaAcp: mock(async () => ({})),
    getHopCodePermissionSettingsViaAcp: mock(async () => ({})),
    setHopCodePermissionRulesViaAcp: mock(async () => ({})),
    getHopCodeMemorySettingsViaAcp: getHopCodeMemorySettingsViaAcpMock,
    setHopCodeMemorySettingsViaAcp: setHopCodeMemorySettingsViaAcpMock,
    getHopCodeSettingsPathViaAcp: mock(async () => ''),
    getHopCodeMemoryPathsViaAcp: getHopCodeMemoryPathsViaAcpMock,
}));
describe('settings default thinking RPC handlers', () => {
    const handlers = new Map();
    beforeEach(async () => {
        handlers.clear();
        getDefaultThinkingLevelMock.mockClear();
        setDefaultThinkingLevelMock.mockClear();
        setVoiceModelMock.mockClear();
        mockedWorkspace = null;
        mockedWorkspaceConfig = null;
        getWorkspaceByNameOrIdMock.mockClear();
        loadWorkspaceConfigMock.mockClear();
        getHopCodeCoreSettingsViaAcpMock.mockClear();
        setHopCodeCoreSettingViaAcpMock.mockClear();
        applyGlobalPermissionModeMock.mockClear();
        getHopCodeMemorySettingsViaAcpMock.mockClear();
        setHopCodeMemorySettingsViaAcpMock.mockClear();
        getHopCodeMemoryPathsViaAcpMock.mockClear();
        const server = {
            handle(channel, handler) {
                handlers.set(channel, handler);
            },
            push() { },
            async invokeClient() {
                return null;
            },
        };
        const deps = {
            sessionManager: {
                applyGlobalPermissionMode: applyGlobalPermissionModeMock,
            },
            platform: {
                appRootPath: '',
                resourcesPath: '',
                isPackaged: false,
                appVersion: '0.0.0-test',
                isDebugMode: true,
                logger: {
                    info: () => { },
                    warn: () => { },
                    error: () => { },
                    debug: () => { },
                },
                imageProcessor: {
                    getMetadata: async () => null,
                    process: async () => Buffer.from(''),
                },
            },
            oauthFlowStore: {
                store: () => { },
                getByState: () => null,
                remove: () => { },
                cleanup: () => { },
                dispose: () => { },
                get size() {
                    return 0;
                },
            },
        };
        const { registerSettingsHandlers } = await import('@craft-agent/server-core/handlers/rpc/settings');
        registerSettingsHandlers(server, deps);
    });
    it('returns persisted default thinking level', async () => {
        const getHandler = handlers.get(RPC_CHANNELS.settings.GET_DEFAULT_THINKING_LEVEL);
        expect(getHandler).toBeTruthy();
        const result = await getHandler(requestContext);
        expect(result).toBe('think');
        expect(getDefaultThinkingLevelMock).toHaveBeenCalledTimes(1);
    });
    it('persists valid thinking level values', async () => {
        const setHandler = handlers.get(RPC_CHANNELS.settings.SET_DEFAULT_THINKING_LEVEL);
        expect(setHandler).toBeTruthy();
        const result = await setHandler(requestContext, 'max');
        expect(result).toEqual({ success: true });
        expect(setDefaultThinkingLevelMock).toHaveBeenCalledWith('max');
        expect(setDefaultThinkingLevelMock).toHaveBeenCalledTimes(1);
    });
    it('rejects invalid thinking level values before persistence', async () => {
        const setHandler = handlers.get(RPC_CHANNELS.settings.SET_DEFAULT_THINKING_LEVEL);
        expect(setHandler).toBeTruthy();
        await expect(setHandler(requestContext, 'ultra')).rejects.toThrow('Invalid thinking level');
        expect(setDefaultThinkingLevelMock).not.toHaveBeenCalled();
    });
    it('returns global permission mode through HopCode ACP', async () => {
        const getHandler = handlers.get(RPC_CHANNELS.settings.GET_GLOBAL_PERMISSION_MODE);
        expect(getHandler).toBeTruthy();
        const result = await getHandler(requestContext);
        expect(result).toBe('allow-all');
        expect(getHopCodeCoreSettingsViaAcpMock).toHaveBeenCalledTimes(1);
        expect(applyGlobalPermissionModeMock).toHaveBeenCalledWith('allow-all', {
            changedBy: 'restore',
        });
    });
    it('persists global permission mode through HopCode ACP', async () => {
        const setHandler = handlers.get(RPC_CHANNELS.settings.SET_GLOBAL_PERMISSION_MODE);
        expect(setHandler).toBeTruthy();
        const result = await setHandler(requestContext, 'izn');
        expect(result).toEqual({ success: true });
        const call = setHopCodeCoreSettingViaAcpMock.mock.calls[0];
        expect(call.slice(1)).toEqual(['user', 'tools.approvalMode', 'izn']);
        expect(applyGlobalPermissionModeMock).toHaveBeenCalledWith('allow-all');
    });
    it('syncs global permission mode when approval mode is saved as a HopCode core setting', async () => {
        const setHandler = handlers.get(RPC_CHANNELS.settings.SET_HOPCODE_CORE_SETTING);
        expect(setHandler).toBeTruthy();
        await setHandler(requestContext, 'user', 'tools.approvalMode', 'izn');
        expect(applyGlobalPermissionModeMock).toHaveBeenCalledWith('allow-all');
    });
    it('uses the workspace working directory as the HopCode memory project root', async () => {
        mockedWorkspace = {
            id: 'ws-1',
            name: 'hopcode',
            slug: 'hopcode',
            rootPath: '/Users/dragon/.craft-agent/workspaces/hopcode',
        };
        mockedWorkspaceConfig = {
            defaults: {
                workingDirectory: '/Users/dragon/Documents/hopcode',
            },
        };
        const getHandler = handlers.get(RPC_CHANNELS.memory.GET_PATHS);
        expect(getHandler).toBeTruthy();
        await getHandler(requestContext, 'ws-1');
        expect(getHopCodeMemoryPathsViaAcpMock).toHaveBeenCalledTimes(1);
        expect(getHopCodeMemoryPathsViaAcpMock.mock.calls[0]?.[0]).toMatchObject({
            cwd: '/Users/dragon/Documents/hopcode',
            processCwd: '/Users/dragon/.craft-agent/workspaces/hopcode',
            projectRoot: '/Users/dragon/Documents/hopcode',
        });
    });
    it('loads memory settings through the workspace HopCode ACP process', async () => {
        mockedWorkspace = {
            id: 'ws-1',
            name: 'hopcode',
            slug: 'hopcode',
            rootPath: '/Users/dragon/.craft-agent/workspaces/hopcode',
        };
        mockedWorkspaceConfig = {
            defaults: {
                workingDirectory: '/Users/dragon/Documents/hopcode',
            },
        };
        const getHandler = handlers.get(RPC_CHANNELS.memory.GET_SETTINGS);
        expect(getHandler).toBeTruthy();
        await getHandler(requestContext, 'ws-1');
        expect(getHopCodeMemorySettingsViaAcpMock).toHaveBeenCalledTimes(1);
        expect(getHopCodeMemorySettingsViaAcpMock.mock.calls[0]?.[0]).toMatchObject({
            cwd: '/Users/dragon/Documents/hopcode',
            processCwd: '/Users/dragon/.craft-agent/workspaces/hopcode',
            projectRoot: '/Users/dragon/Documents/hopcode',
        });
    });
    it('saves memory settings through the workspace HopCode ACP process', async () => {
        mockedWorkspace = {
            id: 'ws-1',
            name: 'hopcode',
            slug: 'hopcode',
            rootPath: '/Users/dragon/.craft-agent/workspaces/hopcode',
        };
        mockedWorkspaceConfig = {
            defaults: {
                workingDirectory: '/Users/dragon/Documents/hopcode',
            },
        };
        const setHandler = handlers.get(RPC_CHANNELS.memory.SET_SETTINGS);
        expect(setHandler).toBeTruthy();
        const updates = { enableManagedAutoDream: true };
        await setHandler(requestContext, updates, 'ws-1');
        expect(setHopCodeMemorySettingsViaAcpMock).toHaveBeenCalledTimes(1);
        expect(setHopCodeMemorySettingsViaAcpMock.mock.calls[0]?.[0]).toMatchObject({
            cwd: '/Users/dragon/Documents/hopcode',
            processCwd: '/Users/dragon/.craft-agent/workspaces/hopcode',
            projectRoot: '/Users/dragon/Documents/hopcode',
        });
        expect(setHopCodeMemorySettingsViaAcpMock.mock.calls[0]?.[1]).toBe(updates);
    });
});
//# sourceMappingURL=settings-default-thinking.test.js.map