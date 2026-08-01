/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
export interface AppState {
    version: string;
    startupWarnings: string[];
}
export declare const AppContext: import("react").Context<AppState | null>;
export declare const useAppContext: () => AppState;
