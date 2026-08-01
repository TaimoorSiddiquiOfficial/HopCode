/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { createContext, useContext } from 'react';
const ThinkingViewerContext = createContext({
    openThinkingViewer: () => { },
});
export const useThinkingViewer = () => useContext(ThinkingViewerContext);
export const ThinkingViewerProvider = ThinkingViewerContext.Provider;
//# sourceMappingURL=ThinkingViewerContext.js.map