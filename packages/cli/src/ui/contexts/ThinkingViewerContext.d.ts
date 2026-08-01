/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
export interface ThinkingViewerData {
    text: string;
    durationMs?: number;
}
export interface ThinkingViewerContextType {
    openThinkingViewer: (data: ThinkingViewerData) => void;
}
export declare const useThinkingViewer: () => ThinkingViewerContextType;
export declare const ThinkingViewerProvider: import("react").Provider<ThinkingViewerContextType>;
