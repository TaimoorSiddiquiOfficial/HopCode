/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type { FC } from 'react';
import type { ThinkingViewerData } from '../contexts/ThinkingViewerContext.js';
interface ThinkingViewerProps {
    data: ThinkingViewerData;
    onClose: () => void;
    /** When true, Ink already owns the alternate screen (VP mode) — skip escape writes. */
    useAlternateScreen?: boolean;
}
export declare const ThinkingViewer: FC<ThinkingViewerProps>;
export {};
