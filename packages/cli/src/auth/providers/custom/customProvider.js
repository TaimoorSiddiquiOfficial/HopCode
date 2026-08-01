/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { AuthType } from '@hoptrendy/hopcode-core';
export const CUSTOM_API_KEY_ENV_PREFIX = 'HOPCODE_CUSTOM_API_KEY_';
export function generateCustomEnvKey(protocol, baseUrl) {
    const normalize = (value) => value
        .trim()
        .toUpperCase()
        .replace(/[^A-Z0-9]+/g, '_')
        .replace(/_+/g, '_')
        .replace(/^_+|_+$/g, '');
    return `${CUSTOM_API_KEY_ENV_PREFIX}${normalize(protocol)}_${normalize(baseUrl)}`;
}
export const customProvider = {
    id: 'custom-openai-compatible',
    label: 'Custom Provider',
    description: 'Manually connect a local server, proxy, or unsupported provider',
    protocol: AuthType.USE_OPENAI,
    protocolOptions: [
        AuthType.USE_OPENAI,
        AuthType.USE_ANTHROPIC,
        AuthType.USE_GEMINI,
    ],
    baseUrl: undefined,
    envKey: generateCustomEnvKey,
    authMethod: 'input',
    models: undefined,
    modelNamePrefix: '',
    showAdvancedConfig: true,
    uiGroup: 'custom',
};
//# sourceMappingURL=customProvider.js.map