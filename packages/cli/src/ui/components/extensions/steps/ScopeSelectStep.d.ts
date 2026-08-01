/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { type Extension } from '@hoptrendy/hopcode-core';
interface ScopeSelectStepProps {
    selectedExtension: Extension | null;
    mode: 'disable' | 'enable';
    onScopeSelect: (scope: 'user' | 'workspace') => void;
}
export declare function ScopeSelectStep({ selectedExtension, mode, onScopeSelect, }: ScopeSelectStepProps): import("react").JSX.Element;
export {};
