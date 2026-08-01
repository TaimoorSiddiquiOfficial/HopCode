/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
type ModelDialogPersistScope = 'workspace' | 'user';
interface UseModelCommandReturn {
    isModelDialogOpen: boolean;
    isFastModelMode: boolean;
    isVoiceModelMode: boolean;
    isVisionModelMode: boolean;
    modelDialogPersistScope: ModelDialogPersistScope | undefined;
    openModelDialog: (options?: {
        fastModelMode?: boolean;
        voiceModelMode?: boolean;
        visionModelMode?: boolean;
        persistScope?: ModelDialogPersistScope;
    }) => void;
    closeModelDialog: () => void;
}
export declare const useModelCommand: () => UseModelCommandReturn;
export {};
