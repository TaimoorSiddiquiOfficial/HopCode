/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type { GenerateContentConfig } from '@google/genai';
export type SystemPromptInteractionMode = 'interactive' | 'headless' | 'acp';
/**
 * Resolve the system-prompt interaction mode from a config. Single source of
 * truth for the ACP > interactive > headless precedence so callers that build
 * the core system prompt (generation and `/context` token estimation) cannot
 * drift apart. Uses a structural type to avoid a hard dependency on the full
 * Config class.
 */
export declare function resolveInteractionMode(config: {
    getExperimentalZedIntegration(): boolean;
    getInputFormat?(): string;
    isInteractive(): boolean;
}): SystemPromptInteractionMode;
export declare function resolvePathFromEnv(envVar?: string): {
    isSwitch: boolean;
    value: string | null;
    isDisabled: boolean;
};
/**
 * Processes a custom system instruction by appending user memory if available.
 * This function should only be used when there is actually a custom instruction.
 *
 * @param customInstruction - Custom system instruction (ContentUnion from @google/genai)
 * @param userMemory - User memory to append
 * @param appendInstruction - Extra instructions to append after user memory
 * @returns Processed custom system instruction with user memory and extra append instructions applied
 */
export declare function getCustomSystemPrompt(customInstruction: GenerateContentConfig['systemInstruction'], userMemory?: string, appendInstruction?: string): string;
export declare function getCoreSystemPrompt(userMemory?: string, model?: string, appendInstruction?: string, interactionMode?: SystemPromptInteractionMode): string;
/**
 * Provides the system prompt for the history compression process.
 *
 * Asks the summary model to wrap its chain-of-thought in an `<analysis>`
 * block (stripped before the result enters history) and then emit a
 * `<state_snapshot>` XML envelope with 9 sub-sections aligned to
 * claude-code's compaction format: primary_request_and_intent,
 * key_technical_concepts, files_and_code_sections, errors_and_fixes,
 * problem_solving, all_user_messages, pending_tasks, current_work,
 * next_step.
 *
 * The resume trailer ("do not acknowledge the summary, ..." etc.) is
 * NOT in this prompt — it is appended once by `postProcessSummary` in
 * `postCompactAttachments.ts` so the summary model does not re-generate
 * it every compaction.
 */
export declare function getCompressionPrompt(): string;
/**
 * Provides the system prompt for generating project summaries in markdown format.
 * This prompt instructs the model to create a structured markdown summary
 * that can be saved to a file for future reference.
 */
export declare function getProjectSummaryPrompt(): string;
/**
 * Generates a system reminder message for plan mode operation.
 *
 * This function creates an internal system message that enforces plan mode constraints,
 * preventing the AI from making any modifications to the system until the user confirms
 * the proposed plan. It overrides other instructions to ensure read-only behavior.
 *
 * @returns A formatted system reminder string that enforces plan mode restrictions
 *
 * @example
 * ```typescript
 * const reminder = getPlanModeSystemReminder();
 * // Returns: "<system-reminder>Plan mode is active..."
 * ```
 *
 * @remarks
 * Plan mode ensures the AI will:
 * - Only perform read-only operations (research, analysis)
 * - Present a comprehensive plan via ExitPlanMode tool
 * - Wait for user confirmation before making any changes
 * - Override any other instructions that would modify system state
 */
export declare function getPlanModeSystemReminder(planOnly?: boolean): string;
/**
 * Generates a system reminder about an active Arena session.
 *
 * @param configFilePath - Absolute path to the arena session's `config.json`
 * @returns A formatted system reminder string wrapped in XML tags
 */
export declare function getArenaSystemReminder(configFilePath: string): string;
type InsightPromptType = 'analysis' | 'impressive_workflows' | 'project_areas' | 'future_opportunities' | 'friction_points' | 'memorable_moment' | 'improvements' | 'interaction_style' | 'at_a_glance';
/**
 * Get an insight analysis prompt by type.
 * @param type - The type of insight prompt to retrieve
 * @returns The prompt string for the specified type
 */
export declare function getInsightPrompt(type: InsightPromptType): string;
/**
 * Returns the Quran-guided coding behavior section for the system prompt.
 * Sources from the @hoptrendy/quran-guidance package's curated
 * agent prompt, which encodes behavioral guidance
 * based on Quranic principles of verification, fairness, good speech,
 * patience, and constructive work.
 */
export declare function getQuranGuidanceSection(): string;
/**
 * Generates a per-turn Quran-guided behavioral reminder based on the
 * current situation (e.g., debugging, code review, planning).
 */
export declare function getQuranGuidancePerTurnReminder(userMessage: string, agentContext?: string, taskType?: string): string;
export {};
