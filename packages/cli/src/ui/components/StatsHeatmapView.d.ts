/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type React from 'react';
import type { StatsData } from '../utils/statsDataService.js';
export declare const HeatmapView: React.FC<{
    data: StatsData;
    weeks: number;
    monthOffset: number;
}>;
