/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
declare const resetConstructorCallCount: () => void;
declare const getConstructorCallCount: () => number;
declare const createDefaultAsyncFzfMock: () => (items: readonly string[], _options: unknown) => any;
export { resetConstructorCallCount, getConstructorCallCount, createDefaultAsyncFzfMock, };
