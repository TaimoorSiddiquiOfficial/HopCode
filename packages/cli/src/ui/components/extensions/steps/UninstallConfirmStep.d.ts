/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { type Extension } from '@hoptrendy/hopcode-core';
interface UninstallConfirmStepProps {
    selectedExtension: Extension | null;
    onConfirm: (extension: Extension) => Promise<void>;
    onNavigateBack: () => void;
    /** Whether this step should respond to keyboard input (default true). */
    isActive?: boolean;
}
export declare function UninstallConfirmStep({ selectedExtension, onConfirm, onNavigateBack, isActive, }: UninstallConfirmStepProps): import("react").JSX.Element;
export {};
