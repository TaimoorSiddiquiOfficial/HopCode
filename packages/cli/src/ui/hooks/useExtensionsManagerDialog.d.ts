/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
interface UseExtensionsManagerDialogReturn {
    isExtensionsManagerDialogOpen: boolean;
    openExtensionsManagerDialog: () => void;
    closeExtensionsManagerDialog: () => void;
}
export declare const useExtensionsManagerDialog: () => UseExtensionsManagerDialogReturn;
export {};
