import { classifySituation } from './engine/classify-situation.js';
import { resolveGuidance } from './engine/resolve-guidance.js';
import { composeAgentBehavior } from './engine/compose-agent-behavior.js';

export { classifySituation } from './engine/classify-situation.js';
export { resolveGuidance } from './engine/resolve-guidance.js';
export { composeAgentBehavior } from './engine/compose-agent-behavior.js';
export { buildQuranGuidedAgentPrompt } from './engine/build-agent-prompt.js';
export { checkIznGate, reportIznScope } from './engine/izn-gate.js';

// MCP integration (optional enrichment)
export { createQuranMcpClient, resetSession } from './mcp/quran-mcp-client.js';
export type { AyahResult, QuranMcpClient } from './mcp/quran-mcp-client.js';
export {
  fetchVerifiedAyah,
  fetchAyahText,
  searchVerifiedQuranReferences,
} from './mcp/quran-mcp-tools.js';
export { enrichGuidanceWithMCP } from './mcp/enrich-guidance.js';
export type { EnrichedGuidance } from './mcp/enrich-guidance.js';

export type {
  ClassifierTelemetry,
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

export type { IznBlockHistoryEntry } from './engine/izn-gate.js';

export {
  IZN_MODE_ANGLES,
  IZN_MODE_DO,
  IZN_MODE_AVOID,
  IZN_MODE_TONE,
} from './types/izn-types.js';

export {
  QURAN_GUIDED_AGENT_PROMPT,
  IZN_MODE_GUIDE_PROMPT,
} from './prompts/index.js';

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
  telemetry?: import('./types/quran-guidance.js').ClassifierTelemetry;
}) {
  const analysis = classifySituation({
    userMessage: input.userMessage,
    agentContext: input.agentContext,
    taskType: input.taskType,
    telemetry: input.telemetry,
  });

  const decision = resolveGuidance(analysis, input.iznModeActive ?? false);
  const behaviorPrompt = composeAgentBehavior(decision);

  return {
    analysis,
    decision,
    behaviorPrompt,
  };
}

/**
 * Async entry point: classifies, resolves guidance, and optionally
 * enriches with verified ayah text from the Quran MCP server.
 *
 * Graceful degradation: if the MCP client is null or the server is
 * unreachable, the behavior prompt is composed without enrichment.
 */
export async function getQuranGuidedBehaviorWithMCP(input: {
  userMessage: string;
  agentContext?: string;
  taskType?: string;
  iznModeActive?: boolean;
  mcpClient?: import('./mcp/quran-mcp-client.js').QuranMcpClient | null;
  translation?: string;
  telemetry?: import('./types/quran-guidance.js').ClassifierTelemetry;
}) {
  const analysis = classifySituation({
    userMessage: input.userMessage,
    agentContext: input.agentContext,
    taskType: input.taskType,
    telemetry: input.telemetry,
  });

  const decision = resolveGuidance(analysis, input.iznModeActive ?? false);

  const enriched = input.mcpClient
    ? await (
        await import('./mcp/enrich-guidance.js')
      ).enrichGuidanceWithMCP(decision, input.mcpClient, input.translation)
    : { decision, ayahTexts: new Map<string, string>() };

  const behaviorPrompt = composeAgentBehavior(
    enriched.decision,
    enriched.ayahTexts,
  );

  return {
    analysis,
    decision: enriched.decision,
    ayahTexts: enriched.ayahTexts,
    behaviorPrompt,
  };
}
