/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { SessionOrganizationService } from '@hoptrendy/hopcode-core';
import { writeStderrLine } from '../utils/stdioHelpers.js';
export function createSessionOrganizationService(workspaceCwd) {
    return new SessionOrganizationService(workspaceCwd, (message) => {
        writeStderrLine(`qwen serve: session-org: ${message}`);
    });
}
//# sourceMappingURL=session-organization-helpers.js.map