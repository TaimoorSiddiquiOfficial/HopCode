/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { AuthType } from '@hoptrendy/hopcode-core';
import type { ProviderConfig } from '../../providerConfig.js';
export declare const CUSTOM_API_KEY_ENV_PREFIX = "HOPCODE_CUSTOM_API_KEY_";
export declare function generateCustomEnvKey(protocol: AuthType, baseUrl: string): string;
export declare const customProvider: ProviderConfig;
