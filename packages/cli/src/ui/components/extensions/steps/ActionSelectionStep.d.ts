/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { type Extension } from '@hoptrendy/hopcode-core';
import { type ExtensionAction } from '../types.js';
interface ActionSelectionStepProps {
    selectedExtension: Extension | null;
    hasUpdateAvailable: boolean;
    onNavigateToStep: (step: string) => void;
    onActionSelect: (action: ExtensionAction) => void;
}
export declare const ActionSelectionStep: ({ selectedExtension, hasUpdateAvailable, onActionSelect, }: ActionSelectionStepProps) => import("react").JSX.Element;
export {};
