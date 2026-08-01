/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { Storage, SessionService } from '@hoptrendy/hopcode-core';
import { loadSettings } from '../../config/settings.js';
export function initSessionService() {
    const settings = loadSettings();
    Storage.setRuntimeBaseDir(settings.merged.advanced?.runtimeOutputDir, process.cwd());
    return new SessionService(process.cwd());
}
//# sourceMappingURL=common.js.map