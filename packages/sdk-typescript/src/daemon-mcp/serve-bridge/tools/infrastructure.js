/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { tool } from '../../tool.js';
import { formatJsonResult } from '../../formatters.js';
import { handler } from '../helpers.js';
/* eslint-disable @typescript-eslint/no-explicit-any */
export function infrastructureTools(state) {
    return [
        tool('health', 'Check if the hopcode serve daemon is alive.', {}, handler(async () => formatJsonResult(await state.client.health()))),
        tool('capabilities', 'Get hopcode serve daemon capabilities including protocol versions, mode, features, model services, and workspace CWD.', {}, handler(async () => formatJsonResult(await state.client.capabilities()))),
    ];
}
//# sourceMappingURL=infrastructure.js.map