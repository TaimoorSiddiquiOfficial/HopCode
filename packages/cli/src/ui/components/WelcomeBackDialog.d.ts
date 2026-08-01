/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { type ProjectSummaryInfo } from '@hoptrendy/hopcode-core';
interface WelcomeBackDialogProps {
    welcomeBackInfo: ProjectSummaryInfo;
    onSelect: (choice: 'restart' | 'continue') => void;
    onClose: () => void;
}
export declare function WelcomeBackDialog({ welcomeBackInfo, onSelect, onClose, }: WelcomeBackDialogProps): import("react").JSX.Element;
export {};
