/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { registerChatViewProviders } from './chatViewRegistration.js';

const { registerWebviewViewProvider } = vi.hoisted(() => ({
  registerWebviewViewProvider: vi.fn(() => ({ dispose: vi.fn() })),
}));

vi.mock('vscode', () => ({
  window: {
    registerWebviewViewProvider,
  },
}));

describe('registerChatViewProviders', () => {
  const context = { subscriptions: [] as Array<{ dispose: () => void }> };

  beforeEach(() => {
    context.subscriptions = [];
    registerWebviewViewProvider.mockClear();
  });

  it('registers the sidebar host with retained webview context', () => {
    const createProvider = vi.fn();

    registerChatViewProviders({
      context: context as never,
      createViewProvider: createProvider,
    });

    expect(registerWebviewViewProvider).toHaveBeenCalledTimes(1);
    const calls = registerWebviewViewProvider.mock.calls as unknown as Array<
      [
        string,
        unknown,
        { webviewOptions: { retainContextWhenHidden: boolean } },
      ]
    >;

    expect(calls.map((call) => call[0])).toEqual([
      'hopcode.chatView.sidebar',
      'hopcode.chatView.secondary',
    ]);
    expect(calls[0]?.[1]).not.toBe(calls[1]?.[1]);
    expect(calls[0]?.[2]).toEqual({
      webviewOptions: { retainContextWhenHidden: true },
    });
    expect(executeCommand).toHaveBeenCalledWith(
      'setContext',
      'hopcode:supportsSecondarySidebar',
      true,
    );
    expect(context.subscriptions).toHaveLength(2);
  });

  it('sets context key to false when secondary sidebar is unavailable', () => {
    registerChatViewProviders({
      context: context as never,
      createViewProvider: vi.fn(),
      vscodeVersion: '1.94.0',
    });

    expect(executeCommand).toHaveBeenCalledWith(
      'setContext',
      'hopcode:supportsSecondarySidebar',
      false,
    );
  });
});
