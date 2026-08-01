/**
 * @license
 * Copyright 2025-2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { AuthType } from '@hoptrendy/hopcode-core';
import type { AuthMethod } from '@agentclientprotocol/sdk';
export declare function buildAuthMethods(): AuthMethod[];
export declare function pickAuthMethodsForAuthRequired(selectedType?: AuthType | string): AuthMethod[];
