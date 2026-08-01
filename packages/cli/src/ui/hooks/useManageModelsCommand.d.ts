/**
 * @license
 * Copyright 2025 HopCode
 * SPDX-License-Identifier: Apache-2.0
 */
interface UseManageModelsCommandReturn {
    isManageModelsDialogOpen: boolean;
    openManageModelsDialog: () => void;
    closeManageModelsDialog: () => void;
}
export declare function useManageModelsCommand(): UseManageModelsCommandReturn;
export {};
