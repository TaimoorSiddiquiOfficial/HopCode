/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { type UseHistoryManagerReturn } from '../hooks/useHistoryManager.js';
interface DialogManagerProps {
    addItem: UseHistoryManagerReturn['addItem'];
    terminalWidth: number;
}
export declare const DialogManager: ({ addItem, terminalWidth, }: DialogManagerProps) => import("react").JSX.Element | null;
export {};
