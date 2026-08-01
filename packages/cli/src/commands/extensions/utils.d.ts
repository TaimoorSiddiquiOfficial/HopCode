/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { ExtensionManager, type Extension } from '@hoptrendy/hopcode-core';
import { SettingScope } from '../../config/settings.js';
export declare function getExtensionManager(): Promise<ExtensionManager>;
export declare function resolveExtensionCommandScope(scope: string | undefined): SettingScope;
export declare function extensionToOutputString(extension: Extension, extensionManager: ExtensionManager, workspaceDir: string, inline?: boolean): string;
