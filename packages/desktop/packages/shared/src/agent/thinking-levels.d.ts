/**
 * Thinking Level Configuration
 *
 * Six-tier thinking system for extended reasoning:
 * - OFF: No extended thinking (disabled)
 * - Low: Light reasoning, faster responses
 * - Medium: Balanced speed and reasoning (default)
 * - High: Deep reasoning for complex tasks
 * - XHigh: Extra-high reasoning for agentic/coding work
 * - Max: Maximum effort reasoning
 *
 * Session-level setting with workspace defaults.
 *
 * Qwen receives these values as provider reasoning effort where supported.
 */
/**
 * Ordered list of valid thinking level IDs. Single source of truth — the
 * `ThinkingLevel` type, `THINKING_LEVELS` metadata, the Zod schema in
 * `validators.ts`, and runtime validation/error messages all derive from this.
 *
 * Order is significant: it determines UI ordering (low → max).
 */
export declare const THINKING_LEVEL_IDS: readonly ["off", "low", "medium", "high", "xhigh", "max"];
export type ThinkingLevel = (typeof THINKING_LEVEL_IDS)[number];
export interface ThinkingLevelDefinition {
    id: ThinkingLevel;
    /** Translation key for the display name (resolve with t() at render site) */
    nameKey: string;
    /** Translation key for the description (resolve with t() at render site) */
    descriptionKey: string;
}
/**
 * Available thinking levels with display metadata.
 * Used in UI dropdowns and for validation.
 *
 * Labels use translation keys — resolve with t(level.nameKey) in components.
 */
export declare const THINKING_LEVELS: readonly ThinkingLevelDefinition[];
/** Default thinking level for new sessions when workspace has no default */
export declare const DEFAULT_THINKING_LEVEL: ThinkingLevel;
/**
 * Map ThinkingLevel to backend effort parameter.
 * Returns null for 'off' (thinking should be disabled entirely).
 */
export declare const THINKING_TO_EFFORT: Record<ThinkingLevel, 'low' | 'medium' | 'high' | 'xhigh' | 'max' | null>;
/**
 * Get the thinking token budget for a given level and model.
 * Used as fallback for models that don't support adaptive thinking.
 *
 * @param level - The thinking level
 * @param modelId - The model ID (e.g., 'qwen3-coder-flash')
 * @returns Number of thinking tokens to allocate
 */
export declare function getThinkingTokens(level: ThinkingLevel, modelId: string): number;
/**
 * Get the translation key for a thinking level's display name.
 * Resolve with t() or i18n.t() at the call site.
 */
export declare function getThinkingLevelNameKey(level: ThinkingLevel): string;
/**
 * Validate that a value is a valid ThinkingLevel.
 */
export declare function isValidThinkingLevel(value: unknown): value is ThinkingLevel;
/**
 * Normalize a persisted thinking level value, handling legacy values.
 * Maps the old 'think' value to 'medium' for backward compatibility.
 *
 * TODO: Remove the legacy 'think' compatibility path after old persisted session
 * and workspace data has realistically aged out across upgrades.
 *
 * @returns The normalized ThinkingLevel, or undefined if the value is invalid
 */
export declare function normalizeThinkingLevel(value: unknown): ThinkingLevel | undefined;
