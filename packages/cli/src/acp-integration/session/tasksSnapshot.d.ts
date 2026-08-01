/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { type Config } from '@hoptrendy/hopcode-core';
import { type ServeSessionTasksStatus } from '@hoptrendy/acp-bridge/status';
export declare function buildSessionTasksStatus(sessionId: string, config: Config, now?: number): ServeSessionTasksStatus;
