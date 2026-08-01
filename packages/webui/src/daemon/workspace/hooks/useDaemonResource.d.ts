/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type { DaemonResourceOptions, ResourceResult } from '../types.js';
export declare function useDaemonResource<T>(load: () => Promise<T>, options: DaemonResourceOptions): ResourceResult<T>;
