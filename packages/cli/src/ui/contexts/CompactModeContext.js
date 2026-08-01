/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { createContext, useContext } from 'react';
const CompactModeContext = createContext({
    compactMode: false,
    compactInline: false,
});
export const useCompactMode = () => useContext(CompactModeContext);
export const CompactModeProvider = CompactModeContext.Provider;
//# sourceMappingURL=CompactModeContext.js.map