import type { GuidanceDecision } from '../types/quran-guidance.js';
/**
 * Composes the final agent behavior prompt from a guidance decision.
 *
 * Produces a structured behavior instruction string that can be
 * injected into the agent's system prompt or context.
 *
 * @param decision    The resolved guidance decision
 * @param ayahTexts   Optional verified ayah texts keyed by ref (e.g. "49:6").
 *                    When provided, the prompt includes the verified text
 *                    alongside each ayah reference.
 */
export declare function composeAgentBehavior(decision: GuidanceDecision, ayahTexts?: Map<string, string> | Record<string, string>): string;
