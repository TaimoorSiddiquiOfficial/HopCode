import { jsx as _jsx } from "react/jsx-runtime";
// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { I18nProvider } from '../../i18n';
import { SettingsMessage, } from './SettingsMessage';
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const mounted = [];
afterEach(() => {
    for (const { root, container } of mounted.splice(0)) {
        act(() => root.unmount());
        container.remove();
    }
});
function render(node) {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);
    act(() => root.render(node));
    mounted.push({ root, container });
    return container;
}
function boolSetting() {
    return {
        key: 'general.testFlag',
        type: 'boolean',
        label: 'Test Flag',
        category: 'General',
        requiresRestart: false,
        default: false,
        values: { effective: false },
    };
}
function subDialogSetting() {
    return {
        key: 'fastModel',
        type: 'string',
        label: 'Fast Model',
        category: 'Model',
        requiresRestart: false,
        default: '',
        values: { effective: '' },
    };
}
function makeState(settings, setValue) {
    const status = { v: 1, settings };
    return {
        status,
        settings,
        loading: false,
        error: undefined,
        reload: vi.fn(async () => status),
        setValue,
    };
}
function makeModelManagement() {
    const providers = [
        {
            kind: 'model_provider',
            status: 'ok',
            authType: 'openai',
            current: true,
            models: [
                {
                    modelId: 'gpt-4o(openai)',
                    baseModelId: 'gpt-4o',
                    name: 'GPT-4o',
                    isCurrent: true,
                    isRuntime: false,
                },
            ],
        },
    ];
    return {
        providers,
        currentModelId: 'gpt-4o(openai)',
        loading: false,
        error: undefined,
        busy: false,
        onSelectModel: vi.fn(),
        onDeleteModel: vi.fn(),
        onAddModel: vi.fn(),
    };
}
const noop = () => { };
function renderPanel(state, overrides = {}) {
    return render(_jsx(I18nProvider, { language: "en", children: _jsx(SettingsMessage, { settingsState: state, embedded: true, onLanguageChange: noop, onThemeChange: noop, onSubDialog: overrides.onSubDialog ?? noop, chatWidthMode: "1000", onChatWidthModeChange: noop, modelManagement: overrides.modelManagement }) }));
}
/**
 * The second scope tab (radix TabsTrigger) is "User". Radix Tabs default to
 * automatic activation (on focus), so focus it then click to flip to user.
 */
function clickUserTab(container) {
    const tabs = container.querySelectorAll('[role="tab"]');
    const userTab = tabs[1];
    if (!userTab)
        throw new Error('User scope tab not found');
    act(() => {
        userTab.focus();
        userTab.click();
    });
    expect(userTab.getAttribute('aria-selected')).toBe('true');
}
/** The boolean control is a radix Switch (button[role="switch"]). */
function switchButton(container) {
    const el = container.querySelector('button[role="switch"]');
    if (!el)
        throw new Error('boolean switch not found');
    return el;
}
describe('SettingsMessage user-scope editing', () => {
    it('persists a boolean toggle to the user scope from the User tab', async () => {
        const setValue = vi.fn((scope, key, value) => Promise.resolve({
            key,
            scope,
            value,
            requiresRestart: false,
        }));
        const container = renderPanel(makeState([boolSetting()], setValue));
        clickUserTab(container);
        await act(async () => {
            switchButton(container).click();
        });
        expect(setValue).toHaveBeenCalledWith('user', 'general.testFlag', true);
    });
    it('still persists to workspace scope on the default (Workspace) tab', async () => {
        const setValue = vi.fn((scope, key, value) => Promise.resolve({
            key,
            scope,
            value,
            requiresRestart: false,
        }));
        const container = renderPanel(makeState([boolSetting()], setValue));
        await act(async () => {
            switchButton(container).click();
        });
        expect(setValue).toHaveBeenCalledWith('workspace', 'general.testFlag', true);
    });
    it('forwards the active scope to onSubDialog for model sub-dialog keys', () => {
        const setValue = vi.fn(() => Promise.resolve({}));
        const onSubDialog = vi.fn();
        const container = renderPanel(makeState([subDialogSetting()], setValue), {
            onSubDialog,
        });
        clickUserTab(container);
        // The fastModel sub-dialog Button is the only control button outside the
        // scope tabs and the category nav.
        const nav = container.querySelector('nav');
        const modelButton = Array.from(container.querySelectorAll('button')).find((b) => b.getAttribute('role') !== 'tab' && !nav?.contains(b));
        if (!modelButton)
            throw new Error('sub-dialog button not found');
        act(() => modelButton.click());
        expect(onSubDialog).toHaveBeenCalledWith('fastModel', 'user');
    });
    it('shows a fallback UI category with a readable label when no theme setting exists', () => {
        const setValue = vi.fn(() => Promise.resolve({}));
        // boolSetting has key 'general.testFlag' — no 'ui.theme', so the
        // fallback UI category branch is exercised.
        const container = renderPanel(makeState([boolSetting()], setValue));
        const nav = container.querySelector('nav');
        const labels = Array.from(nav?.querySelectorAll('span') ?? []).map((s) => s.textContent);
        expect(labels).toContain('UI');
        expect(labels).not.toContain('settings.category.UI');
    });
    it('renders the model-management block inside the Model category', () => {
        const setValue = vi.fn(() => Promise.resolve({}));
        const container = renderPanel(makeState([subDialogSetting()], setValue), {
            modelManagement: makeModelManagement(),
        });
        // Model is the only category, so it's active — the management block shows.
        const block = container.querySelector('[data-testid="model-management"]');
        expect(block).toBeTruthy();
        expect(block?.textContent).toContain('GPT-4o');
    });
});
//# sourceMappingURL=SettingsMessage.dom.test.js.map