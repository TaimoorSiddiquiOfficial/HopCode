/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type { Config } from '@hoptrendy/hopcode-core';
import type { LoadedSettings } from '../config/settings.js';
export declare function runNonInteractiveStreamJson(config: Config, input: string, settings?: LoadedSettings): Promise<void>;
