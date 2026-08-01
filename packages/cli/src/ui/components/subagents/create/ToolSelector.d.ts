/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { type Config } from '@hoptrendy/hopcode-core';
interface ToolSelectorProps {
    tools?: string[];
    onSelect: (tools: string[]) => void;
    config: Config | null;
}
/**
 * Tool selection with categories.
 */
export declare function ToolSelector({ tools, onSelect, config, }: ToolSelectorProps): import("react").JSX.Element;
export {};
