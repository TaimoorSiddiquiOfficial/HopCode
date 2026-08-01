/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type { Application } from 'express';
import type { RateLimiterInstance } from '../rate-limit.js';
import type { ServeOptions } from '../types.js';
import type { WorkspaceRegistry } from '../workspace-registry.js';
interface CreateHealthDemoRoutesDeps {
    opts: Pick<ServeOptions, 'hostname' | 'requireAuth'>;
    getPort: () => number;
    workspaceRegistry: WorkspaceRegistry;
    getActiveSseCount: () => number;
    getRateLimiter: () => RateLimiterInstance | undefined;
}
interface HealthDemoRoutes {
    exposeHealthPreAuth: boolean;
    register(app: Application): void;
}
export declare function createHealthDemoRoutes(deps: CreateHealthDemoRoutesDeps): HealthDemoRoutes;
export {};
