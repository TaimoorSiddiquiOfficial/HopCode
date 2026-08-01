/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type { ToolCallConfirmationDetails } from '@hoptrendy/hopcode-core';
import type { PermissionOption, ToolCallContent } from '@agentclientprotocol/sdk';
/** Metadata that lets daemon session polling distinguish questions from tools. */
export declare function interactionMetaFields(confirmation: ToolCallConfirmationDetails): Record<string, unknown>;
export declare function buildPermissionRequestContent(confirmation: ToolCallConfirmationDetails): ToolCallContent[];
export declare function toPermissionOptions(confirmation: ToolCallConfirmationDetails, forceHideAlwaysAllow?: boolean): PermissionOption[];
