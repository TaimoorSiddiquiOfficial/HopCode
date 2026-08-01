/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
export function isFunctionResponse(content) {
    return (content.role === 'user' &&
        !!content.parts &&
        content.parts.length > 0 &&
        content.parts.every((part) => !!part.functionResponse));
}
export function isFunctionCall(content) {
    return (content.role === 'model' &&
        !!content.parts &&
        content.parts.length > 0 &&
        content.parts.every((part) => !!part.functionCall));
}
//# sourceMappingURL=messageInspectors.js.map