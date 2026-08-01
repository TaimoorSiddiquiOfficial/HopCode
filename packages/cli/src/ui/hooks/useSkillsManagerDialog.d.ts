/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
export interface UseSkillsManagerDialogReturn {
    isSkillsManagerDialogOpen: boolean;
    openSkillsManagerDialog: () => void;
    closeSkillsManagerDialog: () => void;
}
export declare const useSkillsManagerDialog: () => UseSkillsManagerDialogReturn;
