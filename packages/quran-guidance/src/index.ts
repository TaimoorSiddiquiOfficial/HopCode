import { classifySituation } from './engine/classify-situation.js';
import { resolveGuidance } from './engine/resolve-guidance.js';
import { composeAgentBehavior } from './engine/compose-agent-behavior.js';

export { classifySituation } from './engine/classify-situation.js';
export { resolveGuidance } from './engine/resolve-guidance.js';
export { composeAgentBehavior } from './engine/compose-agent-behavior.js';
export { buildQuranGuidedAgentPrompt } from './engine/build-agent-prompt.js';
export { checkIznGate } from './engine/izn-gate.js';

export type {
  QuranicAngle,
  AgentSituation,
  AyahGuidance,
  SituationAnalysis,
  GuidanceDecision,
} from './types/quran-guidance.js';

export type {
  DestructiveActionCategory,
  IznGateResult,
  IznBehaviorRule,
} from './types/izn-types.js';

export {
  IZN_MODE_ANGLES,
  IZN_MODE_DO,
  IZN_MODE_AVOID,
  IZN_MODE_TONE,
} from './types/izn-types.js';

export { ayahGuidance } from './data/ayah-guidance.js';
export { situationAngleMap } from './data/situation-angle-map.js';
export { responsePatterns } from './data/response-patterns.js';
export { iznBehaviorRules } from './data/izn-behavior-rules.js';

/**
 * Main entry point: classifies the situation, resolves guidance,
 * and composes the agent behavior in one call.
 */
export function getQuranGuidedBehavior(input: {
  userMessage: string;
  agentContext?: string;
  taskType?: string;
  iznModeActive?: boolean;
}) {
  const analysis = classifySituation({
    userMessage: input.userMessage,
    agentContext: input.agentContext,
    taskType: input.taskType,
  });

  const decision = resolveGuidance(analysis, input.iznModeActive ?? false);
  const behaviorPrompt = composeAgentBehavior(decision);

  return {
    analysis,
    decision,
    behaviorPrompt,
  };
}
