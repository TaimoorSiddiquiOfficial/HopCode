/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import * as vscode from 'vscode';
import type { File } from '@hoptrendy/hopcode-core';
export declare function addOrMoveToFrontNotebook(openFiles: File[], notebookEditor: vscode.NotebookEditor): void;
export declare function updateNotebookActiveContext(openFiles: File[], notebookEditor: vscode.NotebookEditor): void;
export declare function updateNotebookCellSelection(openFiles: File[], cellEditor: vscode.TextEditor, selections: readonly vscode.Selection[]): void;
