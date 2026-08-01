/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type { ApplyProviderInstallPlanOptions, ApplyProviderInstallPlanResult, ProviderInstallPlan } from '../types.js';
export declare function applyProviderInstallPlan(plan: ProviderInstallPlan, { settings, config, scope, refreshAuth, }: ApplyProviderInstallPlanOptions): Promise<ApplyProviderInstallPlanResult>;
