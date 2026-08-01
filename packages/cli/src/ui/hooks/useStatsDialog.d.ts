/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
export interface UseStatsDialogReturn {
    isStatsDialogOpen: boolean;
    openStatsDialog: () => void;
    closeStatsDialog: () => void;
}
export declare const useStatsDialog: () => UseStatsDialogReturn;
