/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { ApprovalMode } from '@hoptrendy/hopcode-core';
export declare function getApprovalModeIndicatorColor(approvalMode: ApprovalMode): string | undefined;
export declare function getApprovalModePromptStyle(approvalMode: ApprovalMode): {
    color?: string;
    prefix: '>' | '*';
};
