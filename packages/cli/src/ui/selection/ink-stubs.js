/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 *
 * Runtime stubs for ink@7 exports that were removed in v7.
 * The frame-controller API is gone from ink; these stubs let the
 * selection code compile and degrade gracefully (no frame → no
 * text-selection highlight).
 */
/**
 * Ink@7 removed {@link getFrameController}. Return undefined so selection
 * features degrade gracefully instead of crashing.
 */
export function getFrameController(_stdout) {
    return undefined;
}
//# sourceMappingURL=ink-stubs.js.map