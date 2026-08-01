/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type { Storage } from '@hoptrendy/hopcode-core';
import { Logger } from '@hoptrendy/hopcode-core';
/**
 * Hook to manage the logger instance.
 */
export declare const useLogger: (storage: Storage, sessionId: string) => Logger | null;
