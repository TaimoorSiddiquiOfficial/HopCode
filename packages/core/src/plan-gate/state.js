/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { ApprovalMode } from '../config/config.js';
export function createPlanGateState(entryId, enteredByModel = false) {
    return {
        entryId,
        reviewCount: 0,
        gateMode: 'capped',
        enteredByModel,
        lastFindings: [],
        capEscalationPending: false,
        needsUserPending: false,
    };
}
/** AUTO and IZN are the autonomous modes that route exit through the gate. */
export function isAutonomousPrePlanMode(mode) {
    return mode === ApprovalMode.AUTO || mode === ApprovalMode.IZN;
}
//# sourceMappingURL=state.js.map