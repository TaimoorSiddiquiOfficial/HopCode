/**
 * @license
 * Copyright 2025 Qwen Team
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApprovalMode } from '@hoptrendy/hopcode-core';
import { theme } from '../semantic-colors.js';

export function getApprovalModeIndicatorColor(
  approvalMode: ApprovalMode,
): string | undefined {
  switch (approvalMode) {
    case ApprovalMode.PLAN:
      return theme.status.success;
    case ApprovalMode.AUTO_EDIT:
      return theme.status.warning;
    case ApprovalMode.AUTO:
      return theme.text.link;
    case ApprovalMode.IZN:
      return theme.status.error;
    case ApprovalMode.DEFAULT:
    default:
      return undefined;
  }
}

export function getApprovalModePromptStyle(approvalMode: ApprovalMode): {
  color?: string;
  prefix: '>' | '*';
} {
  switch (approvalMode) {
    case ApprovalMode.AUTO_EDIT:
      return { color: theme.status.warningDim, prefix: '>' };
    case ApprovalMode.AUTO:
      return { color: theme.text.link, prefix: '>' };
    case ApprovalMode.IZN:
      return { color: theme.status.errorDim, prefix: '*' };
    case ApprovalMode.PLAN:
    case ApprovalMode.DEFAULT:
    default:
      return { prefix: '>' };
  }
}
