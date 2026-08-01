/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
export declare const useLocalStorage: <T>(key: string, initialValue: T) => readonly [T, (value: T | ((val: T) => T)) => void];
