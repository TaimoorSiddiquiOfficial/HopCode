/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type { SandboxConfig } from '@hoptrendy/hopcode-core';
import type { Settings } from './settings.js';
interface SandboxCliArgs {
    sandbox?: boolean | string;
    sandboxImage?: string;
}
export declare function loadSandboxConfig(settings: Settings, argv: SandboxCliArgs): Promise<SandboxConfig | undefined>;
export {};
