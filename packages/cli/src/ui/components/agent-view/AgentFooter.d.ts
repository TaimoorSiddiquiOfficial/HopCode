/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * @fileoverview Lightweight footer for agent tabs showing approval mode
 * and context usage. Mirrors the main Footer layout but without
 * main-agent-specific concerns (vim mode, shell mode, exit prompts, etc.).
 */
import type React from 'react';
import type { ApprovalMode } from '@hoptrendy/hopcode-core';
interface AgentFooterProps {
    approvalMode: ApprovalMode | undefined;
    promptTokenCount: number;
    contextWindowSize: number | undefined;
    terminalWidth: number;
}
export declare const AgentFooter: React.FC<AgentFooterProps>;
export {};
