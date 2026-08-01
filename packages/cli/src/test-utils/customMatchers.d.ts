/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
declare module 'vitest' {
    interface Assertion<T> {
        toHaveOnlyValidCharacters(): T;
    }
    interface AsymmetricMatchersContaining {
        toHaveOnlyValidCharacters(): void;
    }
}
export {};
