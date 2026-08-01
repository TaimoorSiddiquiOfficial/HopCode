/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Minimal stub for interactive model selection.
 * This was lost during the upstream merge; restore from upstream when available.
 */
export declare class InteractiveSelector<T> {
    private readonly options;
    constructor(options: Array<{
        value: T;
        label: string;
        description: string;
    }>, _prompt?: string);
    select(): Promise<T | undefined>;
}
