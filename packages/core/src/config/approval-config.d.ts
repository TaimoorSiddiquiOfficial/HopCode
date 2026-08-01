/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
export declare enum ApprovalMode {
    PLAN = "plan",
    DEFAULT = "default",
    AUTO_EDIT = "auto-edit",
    AUTO = "auto",
    IZN = "izn",
    YOLO = "yolo"
}
export declare const APPROVAL_MODES: ApprovalMode[];
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
export declare const APPROVAL_MODE_INFO: Record<ApprovalMode, ApprovalModeInfo>;
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
export declare class ApprovalConfig {
    private approvalMode;
    private prePlanMode?;
    constructor(params: ApprovalConfigParams);
    getApprovalMode(): ApprovalMode;
    getPrePlanMode(): ApprovalMode;
    /**
     * Sets the approval mode, enforcing folder-trust restrictions.
     *
     * @param mode The desired approval mode.
     * @param isTrustedFolder Whether the current folder is trusted.
     *   Untrusted folders cannot enable AUTO_EDIT or IZN modes.
     */
    setApprovalMode(mode: ApprovalMode, isTrustedFolder: boolean): void;
}
