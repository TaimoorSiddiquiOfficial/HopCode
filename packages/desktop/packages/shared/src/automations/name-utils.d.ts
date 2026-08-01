/**
 * Automation Naming Utilities (browser-safe)
 *
 * Shared helpers for deriving human-readable names from automation matchers.
 * This file is intentionally free of Node.js APIs (process, fs, crypto, shell)
 * so it can be used by both server-side and renderer code.
 */
import type { AutomationMatcher } from './types.ts';
/**
 * Derive a human-readable name from an automation matcher.
 *
 * Priority:
 * 1. Explicit `matcher.name`
 * 2. First prompt action's `@mention` → "<mention> prompt"
 * 3. First prompt action's prompt text (truncated to 40 chars)
 * 4. First webhook action's URL (truncated to 40 chars)
 * 5. Event name fallback (raw event string)
 */
export declare function deriveAutomationName(event: string, matcher: AutomationMatcher): string;
