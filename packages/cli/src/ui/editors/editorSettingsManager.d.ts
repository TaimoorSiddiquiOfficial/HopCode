/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { type EditorType } from '@hoptrendy/hopcode-core';
export interface EditorDisplay {
    name: string;
    type: EditorType | 'not_set';
    disabled: boolean;
}
export declare const EDITOR_DISPLAY_NAMES: Record<EditorType, string>;
declare class EditorSettingsManager {
    private readonly availableEditors;
    constructor();
    getAvailableEditorDisplays(): EditorDisplay[];
}
export declare const editorSettingsManager: EditorSettingsManager;
export {};
