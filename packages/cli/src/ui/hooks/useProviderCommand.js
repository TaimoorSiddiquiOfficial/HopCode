/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { useState, useCallback } from 'react';
export const useProviderCommand = () => {
    const [isProviderDialogOpen, setIsProviderDialogOpen] = useState(false);
    const openProviderDialog = useCallback(() => {
        setIsProviderDialogOpen(true);
    }, []);
    const closeProviderDialog = useCallback(() => {
        setIsProviderDialogOpen(false);
    }, []);
    return { isProviderDialogOpen, openProviderDialog, closeProviderDialog };
};
//# sourceMappingURL=useProviderCommand.js.map