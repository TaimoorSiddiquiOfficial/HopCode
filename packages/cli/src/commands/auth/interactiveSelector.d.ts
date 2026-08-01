/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Minimal interactive terminal selector for choosing from a list of options.
 * Displays numbered items and prompts the user to select one by number.
 */
export declare class InteractiveSelector {
    private options;
    private prompt;
    constructor(options: Array<{
        value: string;
        label: string;
        description: string;
    }>, prompt: string);
    select(): Promise<string | undefined>;
}
