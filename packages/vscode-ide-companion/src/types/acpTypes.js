/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
// ---------------------------------------------------------------------------
// Private / HopCode-specific types (not part of ACP spec)
// ---------------------------------------------------------------------------
// Default auth method for ACP authenticate requests.
// Value matches AuthType.USE_OPENAI from @hoptrendy/hopcode-core.
// Cannot import directly because this file is used in the webview bundle
// where core (Node.js-only) is excluded as external.
export const authMethod = 'openai';
export { ApprovalMode, APPROVAL_MODE_MAP, APPROVAL_MODE_INFO, getApprovalModeInfoFromString, } from './approvalModeTypes.js';
export const NEXT_APPROVAL_MODE = {
    plan: 'default',
    default: 'auto-edit',
    'auto-edit': 'auto',
    auto: 'izn',
    izn: 'plan',
};
//# sourceMappingURL=acpTypes.js.map