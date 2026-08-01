/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
/** Default number of capped review rounds per Plan Mode Entry. */
export const CAPPED_REVIEW_LIMIT = 5;
/** Max retries for the gate agent before declaring it unavailable. */
export const MAX_AGENT_RETRIES = 3;
/**
 * Cap-escalation option labels. Shared between the gate orchestrator
 * (which emits them) and AskUserQuestion (which matches on them).
 */
export const CAP_ESCALATION_LABELS = {
    CONTINUE: 'Continue editing plan',
    APPROVE: 'Approve execution',
};
//# sourceMappingURL=types.js.map