/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import * as vscode from 'vscode';
import type { DiffManager } from '../diff-manager.js';
import type { WebViewProvider } from '../webview/providers/WebViewProvider.js';
type Logger = (message: string) => void;
export declare const runHopCodeCommand = "hopcode.runHopCode";
export declare const showDiffCommand = "HopCode.showDiff";
export declare const openChatCommand = "hopcode.openChat";
export declare const openNewChatTabCommand = "HopCode.openNewChatTab";
export declare const authCommand = "hopcode.auth";
export declare const focusChatCommand = "hopcode.focusChat";
export declare const newConversationCommand = "hopcode.newConversation";
export declare const showLogsCommand = "hopcode.showLogs";
/**
 * Register all HopCode chat-related commands.
 *
 * `openChat` and `newConversation` always open an editor tab, while
 * `focusChat` focuses the secondary sidebar (preferred) or primary sidebar.
 *
 * @param context - VS Code extension context for subscription management
 * @param log - Logger function for debug output
 * @param diffManager - Diff manager for showing file diffs
 * @param getWebViewProviders - Returns all active editor-tab WebView providers
 * @param createWebViewProvider - Factory to create a new editor-tab WebView provider
 * @param outputChannel - Optional output channel for the showLogs command
 * @param supportsSecondarySidebar - Whether the running VS Code supports secondary sidebar
 */
export declare function registerNewCommands(context: vscode.ExtensionContext, log: Logger, diffManager: DiffManager, getWebViewProviders: () => WebViewProvider[], createWebViewProvider: () => WebViewProvider, outputChannel?: vscode.OutputChannel, supportsSecondarySidebar?: boolean): void;
export {};
