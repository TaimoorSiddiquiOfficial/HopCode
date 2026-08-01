/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 *
 * Tool call component factory - routes to specialized components by kind
 * All UI components are now imported from @hoptrendy/webui
 */
import type { FC } from 'react';
import type { BaseToolCallProps } from '@hoptrendy/webui';
/**
 * Main tool call component that routes to specialized implementations
 */
export declare const ToolCallRouter: FC<BaseToolCallProps>;
export type { BaseToolCallProps, ToolCallData } from '@hoptrendy/webui';
