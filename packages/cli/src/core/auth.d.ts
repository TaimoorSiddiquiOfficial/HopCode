/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { type AuthType, type Config } from '@hoptrendy/hopcode-core';
/**
 * Handles the initial authentication flow.
 * @param config The application config.
 * @param authType The selected auth type.
 * @returns An error message if authentication fails, otherwise null.
 */
export declare function performInitialAuth(config: Config, authType: AuthType | undefined): Promise<string | null>;
