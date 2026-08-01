/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type { FC, ReactNode } from 'react';
interface AlternateScreenProps {
    children: ReactNode;
    /** Skip escape writes when the root Ink renderer already owns the alt screen (VP mode). */
    disabled?: boolean;
}
export declare const AlternateScreen: FC<AlternateScreenProps>;
export {};
