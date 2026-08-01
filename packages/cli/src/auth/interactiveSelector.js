/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Minimal stub for interactive model selection.
 * This was lost during the upstream merge; restore from upstream when available.
 */
export class InteractiveSelector {
    options;
    constructor(options, _prompt) {
        this.options = options;
    }
    async select() {
        // Fallback: return the first option (non-interactive stub)
        return this.options[0]?.value;
    }
}
//# sourceMappingURL=interactiveSelector.js.map