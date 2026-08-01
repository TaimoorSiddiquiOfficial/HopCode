/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
export interface UseHooksDialogReturn {
    isHooksDialogOpen: boolean;
    openHooksDialog: () => void;
    closeHooksDialog: () => void;
}
export declare const useHooksDialog: () => UseHooksDialogReturn;
