/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type * as vscode from 'vscode';
import type { WebViewProvider } from './WebViewProvider.js';
/**
 * Factory function type that lazily creates a WebViewProvider instance.
 * The provider is only instantiated when VS Code actually opens the view.
 */
export type WebViewProviderFactory = () => WebViewProvider;
/**
 * WebviewView host for placing the chat UI in the Activity Bar sidebar.
 *
 * Accepts a factory function instead of a pre-built WebViewProvider so the
 * heavyweight provider (HopCodeAgentManager, ConversationStore, etc.) is only
 * created when VS Code actually opens the view, not at extension startup.
 */
export declare class ChatWebviewViewProvider implements vscode.WebviewViewProvider {
    private readonly createWebViewProvider;
    private webViewProvider;
    /**
     * @param createWebViewProvider - Factory that creates a WebViewProvider on demand
     */
    constructor(createWebViewProvider: WebViewProviderFactory);
    /**
     * Called by VS Code when the webview view becomes visible for the first time.
     * Creates the WebViewProvider lazily and attaches the webview.
     *
     * @param webviewView - The webview view created by VS Code
     */
    resolveWebviewView(webviewView: vscode.WebviewView): Promise<void>;
}
