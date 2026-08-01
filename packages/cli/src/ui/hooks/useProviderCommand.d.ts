/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
interface UseProviderCommandReturn {
    isProviderDialogOpen: boolean;
    openProviderDialog: () => void;
    closeProviderDialog: () => void;
}
export declare const useProviderCommand: () => UseProviderCommandReturn;
export {};
