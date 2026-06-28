/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */

import * as vscode from 'vscode';
import { CHAT_VIEW_ID_SIDEBAR } from '../../constants/viewIds.js';
import {
  ChatWebviewViewProvider,
  type WebViewProviderFactory,
} from './ChatWebviewViewProvider.js';

const SECONDARY_SIDEBAR_CONTEXT_KEY = 'hopcode:supportsSecondarySidebar';

export function detectSecondarySidebarSupport(vscodeVersion: string): boolean {
  const [major, minor] = vscodeVersion.split('.').map(Number);
  return (major ?? 0) > 1 || ((major ?? 0) === 1 && (minor ?? 0) >= 106);
}

export function registerChatViewProviders(params: {
  context: vscode.ExtensionContext;
  createViewProvider: WebViewProviderFactory;
}): void {
  const { context, createViewProvider } = params;

  const sidebarViewProvider = new ChatWebviewViewProvider(createViewProvider);

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      CHAT_VIEW_ID_SIDEBAR,
      sidebarViewProvider,
      { webviewOptions: { retainContextWhenHidden: true } },
    ),
  );
}
