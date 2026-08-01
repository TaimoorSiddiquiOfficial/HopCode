/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { useState, useCallback } from 'react';
export const useAgentsManagerDialog = () => {
    const [isAgentsManagerDialogOpen, setIsAgentsManagerDialogOpen] = useState(false);
    const openAgentsManagerDialog = useCallback(() => {
        setIsAgentsManagerDialogOpen(true);
    }, []);
    const closeAgentsManagerDialog = useCallback(() => {
        setIsAgentsManagerDialogOpen(false);
    }, []);
    return {
        isAgentsManagerDialogOpen,
        openAgentsManagerDialog,
        closeAgentsManagerDialog,
    };
};
//# sourceMappingURL=useAgentsManagerDialog.js.map