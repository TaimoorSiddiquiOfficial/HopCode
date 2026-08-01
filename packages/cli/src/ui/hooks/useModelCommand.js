/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { useState, useCallback } from 'react';
export const useModelCommand = () => {
    const [isModelDialogOpen, setIsModelDialogOpen] = useState(false);
    const [isFastModelMode, setIsFastModelMode] = useState(false);
    const [isVoiceModelMode, setIsVoiceModelMode] = useState(false);
    const [isVisionModelMode, setIsVisionModelMode] = useState(false);
    const [modelDialogPersistScope, setModelDialogPersistScope] = useState(undefined);
    const openModelDialog = useCallback((options) => {
        const voiceModelMode = options?.voiceModelMode ?? false;
        const visionModelMode = options?.visionModelMode ?? false;
        // Modes are mutually exclusive; a specialized mode suppresses fast mode.
        setIsFastModelMode(voiceModelMode || visionModelMode
            ? false
            : (options?.fastModelMode ?? false));
        // Vision wins over voice when both are passed, so the dialog can't end up
        // in two specialized modes at once (mismatched title vs. highlighted row).
        setIsVoiceModelMode(visionModelMode ? false : voiceModelMode);
        setIsVisionModelMode(visionModelMode);
        setModelDialogPersistScope(options?.persistScope);
        setIsModelDialogOpen(true);
    }, []);
    const closeModelDialog = useCallback(() => {
        setIsModelDialogOpen(false);
        setIsFastModelMode(false);
        setIsVoiceModelMode(false);
        setIsVisionModelMode(false);
        setModelDialogPersistScope(undefined);
    }, []);
    return {
        isModelDialogOpen,
        isFastModelMode,
        isVoiceModelMode,
        isVisionModelMode,
        modelDialogPersistScope,
        openModelDialog,
        closeModelDialog,
    };
};
//# sourceMappingURL=useModelCommand.js.map