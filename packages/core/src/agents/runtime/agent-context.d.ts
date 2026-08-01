/**
 * @license
 * Copyright 2025 HopCode
 * SPDX-License-Identifier: Apache-2.0
 */
import type { ContentGenerator, ContentGeneratorConfig } from '../../core/contentGenerator.js';
export interface RuntimeContentGeneratorView {
    readonly contentGenerator: ContentGenerator;
    readonly contentGeneratorConfig: ContentGeneratorConfig;
}
export declare function runWithAgentContext<T>(agentId: string, fn: () => Promise<T>, depthOverride?: number): Promise<T>;
export declare function runWithRuntimeContentGenerator<T>(view: RuntimeContentGeneratorView, fn: () => Promise<T>): Promise<T>;
export declare function getCurrentAgentId(): string | null;
/**
 * Returns the depth of the current agent context frame. 0 means we're
 * inside a top-level subagent (or no subagent at all — but in that case
 * the caller won't typically need this). Used by telemetry to populate
 * `hopcode.subagent.depth` on subagent spans.
 *
 * @remarks Returns 0 for two semantically distinct states: (a) no agent
 * frame exists, and (b) a top-level frame exists with `depth=0`. Callers
 * that need to discriminate MUST first check {@link getCurrentAgentId} —
 * it returns `null` only in state (a). See `runWithSubagentSpan` in
 * `tools/agent/agent.ts` for the canonical disambiguation pattern.
 * Review wenshao @ #4410 (DeepSeek bot 3290820381).
 */
export declare function getCurrentAgentDepth(): number;
export declare function getRuntimeContentGenerator(): RuntimeContentGeneratorView | undefined;
/**
 * True when there is no active agent frame — i.e. we are in the top-level
 * user session, not inside a sub-agent. The canonical "top-level only"
 * predicate for gating capabilities (teammate spawning, forking) that must
 * not be reachable from a nested sub-agent.
 */
export declare function isTopLevelSession(): boolean;
/**
 * The 0-based depth a child spawned by the current invoker would have:
 * 0 when spawning from the top-level session (no agent frame), parent
 * depth + 1 inside a sub-agent frame. Single source of the launch-depth
 * formula — used for subagent telemetry spans, persisted in AgentMeta so
 * background/foreground resume can restore the original nesting level (via
 * the runWithAgentContext depthOverride), and underlying
 * {@link canSpawnNestedAgent}.
 */
export declare function childLaunchDepth(): number;
/**
 * Whether the current invoker may spawn a nested sub-agent given the
 * configured maximum nesting depth (1-based levels; a top-level sub-agent is
 * level 1). Single source of truth for the depth relationship, shared by
 * AgentCore.prepareTools() (schema gating) and AgentTool.execute() (runtime
 * guard) so the two cannot drift apart.
 *
 * The would-be child sits at level `childLaunchDepth() + 1` (levels are
 * 1-based, depths 0-based), which must not exceed `maxDepth`.
 */
export declare function canSpawnNestedAgent(maxDepth: number): boolean;
/**
 * Single source of the sub-agent spawn exclusion policy, shared by
 * `AgentCore.prepareTools()` (schema gating) and `AgentTool.execute()`
 * (runtime guards) so the two layers cannot drift: a rule missed on the
 * runtime side is a silent spawn bypass, missed on the schema side it burns
 * model turns on guaranteed-rejected calls.
 *
 * Returns the first blocking reason — evaluated in `execute()`'s guard
 * order, so the winning reason (and its user-facing message) is stable for
 * contexts that trip several rules (e.g. a teammate at leaf depth) — or
 * null when a spawn is permitted. All four inputs are pure
 * AsyncLocalStorage reads, so the composition is order-insensitive for the
 * schema side's boolean use.
 *
 * Callers gate on different frame requirements on top of this:
 * `prepareTools()` adds `!isTopLevelSession()` to fail closed on a missing
 * agent frame (it only ever serves agents), while `execute()` must allow
 * the top-level session — that is the normal spawn path.
 */
export declare function spawnBlockReason(maxDepth: number): 'depth' | 'teammate' | 'fork' | null;
