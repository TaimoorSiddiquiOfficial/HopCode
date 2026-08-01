/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
interface CompactModeContextType {
    compactMode: boolean;
    compactInline: boolean;
    setCompactMode?: (value: boolean) => void;
}
export declare const useCompactMode: () => CompactModeContextType;
export declare const CompactModeProvider: import("react").Provider<CompactModeContextType>;
export {};
