/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { registerChatViewProviders } from './chatViewRegistration.js';
const { registerWebviewViewProvider, executeCommand } = vi.hoisted(() => ({
    registerWebviewViewProvider: vi.fn(() => ({ dispose: vi.fn() })),
    executeCommand: vi.fn(),
}));
vi.mock('vscode', () => ({
    window: {
        registerWebviewViewProvider,
    },
    commands: {
        executeCommand,
    },
    version: '1.106.0',
}));
describe('registerChatViewProviders', () => {
    const context = { subscriptions: [] };
    beforeEach(() => {
        context.subscriptions = [];
        registerWebviewViewProvider.mockClear();
        executeCommand.mockClear();
    });
    it('registers the sidebar host with retained webview context', () => {
        const createProvider = vi.fn();
        registerChatViewProviders({
            context: context,
            createViewProvider: createProvider,
        });
        expect(registerWebviewViewProvider).toHaveBeenCalledTimes(1);
        const calls = registerWebviewViewProvider.mock.calls;
        expect(calls.map((call) => call[0])).toEqual([
            'hopcode.chatView.sidebar',
            'hopcode.chatView.secondary',
        ]);
        expect(calls[0]?.[1]).not.toBe(calls[1]?.[1]);
        expect(calls[0]?.[2]).toEqual({
            webviewOptions: { retainContextWhenHidden: true },
        });
        expect(executeCommand).toHaveBeenCalledWith('setContext', 'hopcode:supportsSecondarySidebar', true);
        expect(context.subscriptions).toHaveLength(2);
    });
    it('sets context key to false when secondary sidebar is unavailable', () => {
        registerChatViewProviders({
            context: context,
            createViewProvider: vi.fn(),
            vscodeVersion: '1.94.0',
        });
        expect(executeCommand).toHaveBeenCalledWith('setContext', 'hopcode:supportsSecondarySidebar', false);
    });
});
//# sourceMappingURL=chatViewRegistration.test.js.map