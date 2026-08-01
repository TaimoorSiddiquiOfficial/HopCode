export interface BuildPlanApprovalMessageOptions {
    /** Optional accepted plan path (kept for call-site compatibility; message remains path-agnostic). */
    planPath?: string;
    draftInput?: string;
}
export declare function buildPlanApprovalMessage(options?: BuildPlanApprovalMessageOptions): string;
