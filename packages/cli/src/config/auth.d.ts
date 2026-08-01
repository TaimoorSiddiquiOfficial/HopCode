/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { type Config } from '@hoptrendy/hopcode-core';
/**
 * Validate that the required credentials and configuration exist for the given auth method.
 */
export declare function validateAuthMethod(authMethod: string, config?: Config): string | null;
