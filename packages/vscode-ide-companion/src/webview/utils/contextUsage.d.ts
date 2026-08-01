/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type { ModelInfo } from '@agentclientprotocol/sdk';
import type { ContextUsage } from '@hoptrendy/webui';
import type { UsageStatsPayload } from '../../types/chatTypes.js';
export declare function computeContextUsage(usageStats: UsageStatsPayload | null, modelInfo: ModelInfo | null): ContextUsage | null;
