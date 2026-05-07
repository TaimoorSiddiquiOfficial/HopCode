/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

export enum ApprovalMode {
  PLAN = 'plan',
  DEFAULT = 'default',
  AUTO_EDIT = 'auto-edit',
  IZN = 'izn',
}

export const APPROVAL_MODES = Object.values(ApprovalMode);

/**
 * Information about an approval mode including display name and description.
 */
export interface ApprovalModeInfo {
  id: ApprovalMode;
  name: string;
  description: string;
}

/**
 * Detailed information about each approval mode.
 * Used for UI display and protocol responses.
 */
export const APPROVAL_MODE_INFO: Record<ApprovalMode, ApprovalModeInfo> = {
  [ApprovalMode.PLAN]: {
    id: ApprovalMode.PLAN,
    name: 'Plan',
    description: 'Analyze only, do not modify files or execute commands',
  },
  [ApprovalMode.DEFAULT]: {
    id: ApprovalMode.DEFAULT,
    name: 'Default',
    description: 'Require approval for file edits or shell commands',
  },
  [ApprovalMode.AUTO_EDIT]: {
    id: ApprovalMode.AUTO_EDIT,
    name: 'Auto Edit',
    description: 'Automatically approve file edits',
  },
  [ApprovalMode.IZN]: {
    id: ApprovalMode.IZN,
    name: 'Izn',
    description: 'Automatically approve all tools',
  },
};

export interface ApprovalConfigParams {
  approvalMode?: ApprovalMode;
  prePlanMode?: ApprovalMode;
}

/**
 * Approval-mode state extracted from the monolithic Config class.
 * Manages approval-mode transitions including plan-mode entry/exit tracking
 * and folder-trust enforcement.
 *
 * This delegate is stateful — `approvalMode` and `prePlanMode` can mutate.
 */
export class ApprovalConfig {
  private approvalMode: ApprovalMode;
  private prePlanMode?: ApprovalMode;

  constructor(params: ApprovalConfigParams) {
    this.approvalMode = params.approvalMode ?? ApprovalMode.DEFAULT;
    this.prePlanMode = params.prePlanMode;
  }

  getApprovalMode(): ApprovalMode {
    return this.approvalMode;
  }

  getPrePlanMode(): ApprovalMode {
    return this.prePlanMode ?? ApprovalMode.DEFAULT;
  }

  /**
   * Sets the approval mode, enforcing folder-trust restrictions.
   *
   * @param mode The desired approval mode.
   * @param isTrustedFolder Whether the current folder is trusted.
   *   Untrusted folders cannot enable AUTO_EDIT or IZN modes.
   */
  setApprovalMode(mode: ApprovalMode, isTrustedFolder: boolean): void {
    if (
      !isTrustedFolder &&
      mode !== ApprovalMode.DEFAULT &&
      mode !== ApprovalMode.PLAN
    ) {
      throw new Error(
        'Cannot enable privileged approval modes in an untrusted folder.',
      );
    }
    // Track the mode before entering plan mode so it can be restored later
    if (mode === ApprovalMode.PLAN && this.approvalMode !== ApprovalMode.PLAN) {
      this.prePlanMode = this.approvalMode;
    } else if (
      mode !== ApprovalMode.PLAN &&
      this.approvalMode === ApprovalMode.PLAN
    ) {
      this.prePlanMode = undefined;
    }
    this.approvalMode = mode;
  }
}
