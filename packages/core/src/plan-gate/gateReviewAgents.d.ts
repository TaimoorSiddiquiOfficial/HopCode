/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type { Config } from '../config/config.js';
import type { GateAgentResult, EvidenceBundle } from './types.js';
export declare function formatEvidence(bundle: EvidenceBundle): string;
/**
 * Runs the gate review agent via `createAgentHeadless`. The agent operates
 * under a forced-PLAN config override and cannot spawn nested agents.
 *
 * Signal isolation: The gate agent creates its own independent AbortController
 * with a timeout, rather than directly inheriting the parent's signal. This
 * prevents transient parent-side issues (stream errors, round cleanup) from
 * cascading into the gate agent. The parent signal is intentionally not
 * checked or monitored — the gate agent's own 5-minute timeout (matching
 * runConfig.max_time_minutes) is the sole cancellation mechanism.
 *
 * Returns the parsed `GateAgentResult`, or throws on unrecoverable failure.
 */
export declare function runGateAgent(config: Config, bundle: EvidenceBundle, _parentSignal: AbortSignal): Promise<GateAgentResult>;
export declare function parseGateAgentResult(raw: string): GateAgentResult;
