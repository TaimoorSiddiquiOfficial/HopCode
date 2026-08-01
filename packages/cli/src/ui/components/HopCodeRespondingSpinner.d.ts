/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type React from 'react';
import type { SpinnerName } from 'cli-spinners';
interface HopCodeRespondingSpinnerProps {
    /**
     * Optional string to display when not in Responding state.
     * If not provided and not Responding, renders null.
     */
    nonRespondingDisplay?: string;
    spinnerType?: SpinnerName;
}
export declare const HopCodeRespondingSpinner: React.FC<HopCodeRespondingSpinnerProps>;
interface HopCodeSpinnerProps {
    spinnerType?: SpinnerName;
    altText?: string;
}
export declare const HopCodeSpinner: React.FC<HopCodeSpinnerProps>;
export {};
