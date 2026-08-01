/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type React from 'react';
import type { PlanResultDisplay } from '@hoptrendy/hopcode-core';
interface PlanSummaryDisplayProps {
    data: PlanResultDisplay;
    availableHeight?: number;
    childWidth: number;
}
export declare const PlanSummaryDisplay: React.FC<PlanSummaryDisplayProps>;
export {};
