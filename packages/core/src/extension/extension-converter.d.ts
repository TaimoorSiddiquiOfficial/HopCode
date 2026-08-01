/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import type { ExtensionNetworkPolicy, ExtensionOriginSource } from '../config/config.js';
export declare const SUPPORTED_EXTENSION_MANIFESTS: readonly ["hopcode-extension.json", "gemini-extension.json", ".claude-plugin/marketplace.json", ".claude-plugin/plugin.json"];
export declare function convertGeminiOrClaudeExtension(extensionDir: string, pluginName?: string, networkPolicy?: ExtensionNetworkPolicy, signal?: AbortSignal): Promise<{
    extensionDir: string;
    originSource: ExtensionOriginSource;
}>;
