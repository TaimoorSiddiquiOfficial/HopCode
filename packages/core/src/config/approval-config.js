/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
export var ApprovalMode;
(function (ApprovalMode) {
    ApprovalMode["PLAN"] = "plan";
    ApprovalMode["DEFAULT"] = "default";
    ApprovalMode["AUTO_EDIT"] = "auto-edit";
    ApprovalMode["AUTO"] = "auto";
    ApprovalMode["IZN"] = "izn";
    ApprovalMode["YOLO"] = "yolo";
})(ApprovalMode || (ApprovalMode = {}));
export const APPROVAL_MODES = Object.values(ApprovalMode);
/**
 * Detailed information about each approval mode.
 * Used for UI display and protocol responses.
 */
export const APPROVAL_MODE_INFO = {
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
    [ApprovalMode.AUTO]: {
        id: ApprovalMode.AUTO,
        name: 'Auto',
        description: 'LLM classifier auto-approves safe actions, blocks risky ones',
    },
    [ApprovalMode.IZN]: {
        id: ApprovalMode.IZN,
        name: 'IZN',
        description: 'Automatically approve all tools',
    },
    [ApprovalMode.YOLO]: {
        id: ApprovalMode.YOLO,
        name: 'YOLO',
        description: 'Maximum autonomy, no confirmation prompts',
    },
};
/**
 * Approval-mode state extracted from the monolithic Config class.
 * Manages approval-mode transitions including plan-mode entry/exit tracking
 * and folder-trust enforcement.
 *
 * This delegate is stateful — `approvalMode` and `prePlanMode` can mutate.
 */
export class ApprovalConfig {
    approvalMode;
    prePlanMode;
    constructor(params) {
        this.approvalMode = params.approvalMode ?? ApprovalMode.DEFAULT;
        this.prePlanMode = params.prePlanMode;
    }
    getApprovalMode() {
        return this.approvalMode;
    }
    getPrePlanMode() {
        return this.prePlanMode ?? ApprovalMode.DEFAULT;
    }
    /**
     * Sets the approval mode, enforcing folder-trust restrictions.
     *
     * @param mode The desired approval mode.
     * @param isTrustedFolder Whether the current folder is trusted.
     *   Untrusted folders cannot enable AUTO_EDIT or IZN modes.
     */
    setApprovalMode(mode, isTrustedFolder) {
        if (!isTrustedFolder &&
            mode !== ApprovalMode.DEFAULT &&
            mode !== ApprovalMode.PLAN) {
            throw new Error('Cannot enable privileged approval modes in an untrusted folder.');
        }
        // Track the mode before entering plan mode so it can be restored later
        if (mode === ApprovalMode.PLAN && this.approvalMode !== ApprovalMode.PLAN) {
            this.prePlanMode = this.approvalMode;
        }
        else if (mode !== ApprovalMode.PLAN &&
            this.approvalMode === ApprovalMode.PLAN) {
            this.prePlanMode = undefined;
        }
        this.approvalMode = mode;
    }
}
//# sourceMappingURL=approval-config.js.map