/**
 * @license
 * Copyright 2026 HopCode Team Team
 * SPDX-License-Identifier: Apache-2.0
 */

/** @vitest-environment jsdom */

import React from 'react';
import { act } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createRoot, type Root } from 'react-dom/client';

const mocks = vi.hoisted(() => {
  const postMessage = vi.fn();
  const sessionManagement = {
    isSwitchingSession: false,
    showSessionSelector: false,
    filteredSessions: [],
    currentSessionId: null,
    sessionSearchQuery: '',
    setSessionSearchQuery: vi.fn(),
    handleSwitchSession: vi.fn(),
    handleRenameSession: vi.fn(),
    handleDeleteSession: vi.fn(),
    setShowSessionSelector: vi.fn(),
    hasMore: false,
    isLoading: false,
    handleLoadMoreSessions: vi.fn(),
    currentSessionTitle: 'Session',
    handleLoadQwenSessions: vi.fn(),
    handleNewQwenSession: vi.fn(),
  };
  const fileContext = {
    hasRequestedFiles: false,
    workspaceFiles: [],
    requestWorkspaceFiles: vi.fn(),
    activeFileName: null,
    activeSelection: null,
    focusActiveEditor: vi.fn(),
    addFileReference: vi.fn(),
  };
  const messageHandling = {
    messages: [
      {
        role: 'user',
        content: 'Hello',
        timestamp: 1,
      },
      {
        role: 'assistant',
        content: 'Latest answer',
        timestamp: 2,
      },
    ],
    isStreaming: false,
    isWaitingForResponse: false,
    loadingMessage: '',
    endStreaming: vi.fn(),
    addMessage: vi.fn(),
  };
  const toolCalls = {
    inProgressToolCalls: [],
    completedToolCalls: [],
    handleToolCallUpdate: vi.fn(),
    clearToolCalls: vi.fn(),
  };
  const completion = {
    isOpen: false,
    triggerChar: null,
    query: '',
    items: [],
    refreshCompletion: vi.fn(),
    closeCompletion: vi.fn(),
    openCompletion: vi.fn(),
  };
  const imagePaste = {
    attachedImages: [],
    handleRemoveImage: vi.fn(),
    clearImages: vi.fn(),
    handlePaste: vi.fn(),
  };

  return {
    completion,
    fileContext,
    imagePaste,
    messageHandling,
    postMessage,
    sessionManagement,
    toolCalls,
  };
});

vi.mock('./hooks/useVSCode.js', () => ({
  useVSCode: () => ({
    postMessage: mocks.postMessage,
    getState: vi.fn(),
    setState: vi.fn(),
  }),
}));

vi.mock('./hooks/session/useSessionManagement.js', () => ({
  useSessionManagement: () => mocks.sessionManagement,
}));

vi.mock('./hooks/file/useFileContext.js', () => ({
  useFileContext: () => mocks.fileContext,
}));

vi.mock('./hooks/message/useMessageHandling.js', () => ({
  useMessageHandling: () => mocks.messageHandling,
}));

vi.mock('./hooks/useToolCalls.js', () => ({
  useToolCalls: () => mocks.toolCalls,
}));

vi.mock('./hooks/useWebViewMessages.js', () => ({
  useWebViewMessages: vi.fn(),
}));

vi.mock('./hooks/useMessageSubmit.js', () => ({
  shouldSendMessage: vi.fn(() => true),
  useMessageSubmit: () => ({
    handleSubmit: vi.fn(),
  }),
}));

vi.mock('./hooks/useCompletionTrigger.js', () => ({
  useCompletionTrigger: () => mocks.completion,
}));

vi.mock('./hooks/useImage.js', () => ({
  useImagePaste: () => mocks.imagePaste,
}));

vi.mock('./utils/contextUsage.js', () => ({
  computeContextUsage: vi.fn(() => null),
}));

vi.mock('./components/layout/Onboarding.js', () => ({
  Onboarding: () => React.createElement('div', null, 'Onboarding'),
}));

vi.mock('./components/layout/InputForm.js', () => ({
  InputForm: () => null,
}));

vi.mock('./components/AccountInfoDialog.js', () => ({
  AccountInfoDialog: () => null,
}));

vi.mock('./components/messages/toolcalls/ToolCall.js', () => ({
  ToolCall: () => React.createElement('div', null, 'ToolCall'),
}));

vi.mock('@hoptrendy/webui', () => ({
  AskUserQuestionDialog: () => null,
  AssistantMessage: (props: { content?: string }) =>
    React.createElement('div', null, props.content),
  ChatHeader: () => null,
  EmptyState: () => null,
  FileIcon: () => React.createElement('span', null, '@'),
  hasToolCallOutput: vi.fn(() => true),
  ImageMessageRenderer: () => null,
  ImagePreview: () => null,
  InsightProgressCard: () => null,
  InterruptedMessage: () => React.createElement('div', null, 'Interrupted'),
  PermissionDrawer: () => null,
  SessionSelector: () => null,
  ThinkingMessage: (props: { content?: string }) =>
    React.createElement('div', null, props.content),
  UserMessage: (props: { content?: string }) =>
    React.createElement('div', null, props.content),
  WaitingMessage: (props: { loadingMessage?: string }) =>
    React.createElement('div', null, props.loadingMessage),
}));

import { App } from './App.js';

function renderApp(): {
  container: HTMLDivElement;
  root: Root;
} {
  const container = document.createElement('div');
  document.body.appendChild(container);

  const root = createRoot(container);
  act(() => {
    root.render(React.createElement(App));
  });

  return { container, root };
}

describe('App', () => {
  let container: HTMLDivElement | null = null;
  let root: Root | null = null;

  beforeEach(() => {
    vi.clearAllMocks();
    (
      globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
    ).IS_REACT_ACT_ENVIRONMENT = true;

    Object.defineProperty(HTMLElement.prototype, 'scrollTo', {
      configurable: true,
      value: vi.fn(),
    });

    globalThis.requestAnimationFrame = vi.fn(
      (callback: FrameRequestCallback) => {
        callback(0);
        return 0;
      },
    );
    globalThis.cancelAnimationFrame = vi.fn();

    class MockResizeObserver {
      observe = vi.fn();
      disconnect = vi.fn();
      unobserve = vi.fn();
    }

    (
      globalThis as typeof globalThis & {
        ResizeObserver: typeof MockResizeObserver;
      }
    ).ResizeObserver = MockResizeObserver;
  });

  afterEach(() => {
    if (root) {
      act(() => {
        root?.unmount();
      });
      root = null;
    }

    container?.remove();
    container = null;
  });

  it('mounts without throwing on initial render', () => {
    expect(() => {
      const rendered = renderApp();
      container = rendered.container;
      root = rendered.root;
    }).not.toThrow();
  });

  it('copies the last assistant reply through the VS Code bridge', () => {
    const rendered = renderApp();
    container = rendered.container;
    root = rendered.root;

    act(() => {
      window.dispatchEvent(
        new MessageEvent('message', {
          data: {
            type: 'copyCommand',
            data: { action: 'copyLastReply' },
          },
        }),
      );
    });

    expect(mocks.postMessage).toHaveBeenCalledWith({
      type: 'copyToClipboard',
      data: { text: 'Latest answer' },
    });
  });
});
