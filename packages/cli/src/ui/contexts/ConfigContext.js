/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useContext } from 'react';
import {} from '@hoptrendy/hopcode-core';
export const ConfigContext = React.createContext(undefined);
export const useConfig = () => {
    const context = useContext(ConfigContext);
    if (context === undefined) {
        throw new Error('useConfig must be used within a ConfigProvider');
    }
    return context;
};
//# sourceMappingURL=ConfigContext.js.map