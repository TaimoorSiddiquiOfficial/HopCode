import type { AgentSituation, QuranicAngle } from '../types/quran-guidance.js';
/**
 * Maps each agent situation to its relevant Quranic angles.
 *
 * Each situation triggers a set of angles that guide the agent's
 * behavior, tone, and decision-making for that context.
 */
export declare const situationAngleMap: Record<AgentSituation, QuranicAngle[]>;
