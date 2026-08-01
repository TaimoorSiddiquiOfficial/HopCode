export { classifySituation } from './engine/classify-situation.js';
export { resolveGuidance } from './engine/resolve-guidance.js';
export { composeAgentBehavior } from './engine/compose-agent-behavior.js';
export { buildQuranGuidedAgentPrompt } from './engine/build-agent-prompt.js';
export { checkIznGate, reportIznScope } from './engine/izn-gate.js';
export { createQuranMcpClient, resetSession } from './mcp/quran-mcp-client.js';
export type { AyahResult, QuranMcpClient } from './mcp/quran-mcp-client.js';
export { fetchVerifiedAyah, fetchAyahText, searchVerifiedQuranReferences, } from './mcp/quran-mcp-tools.js';
export { enrichGuidanceWithMCP } from './mcp/enrich-guidance.js';
export type { EnrichedGuidance } from './mcp/enrich-guidance.js';
export type { ClassifierTelemetry, QuranicAngle, AgentSituation, AyahGuidance, SituationAnalysis, GuidanceDecision, } from './types/quran-guidance.js';
export type { DestructiveActionCategory, IznGateResult, IznBehaviorRule, } from './types/izn-types.js';
export type { IznBlockHistoryEntry } from './engine/izn-gate.js';
export { IZN_MODE_ANGLES, IZN_MODE_DO, IZN_MODE_AVOID, IZN_MODE_TONE, } from './types/izn-types.js';
export { QURAN_GUIDED_AGENT_PROMPT, IZN_MODE_GUIDE_PROMPT, } from './prompts/index.js';
export { ayahGuidance } from './data/ayah-guidance.js';
export { situationAngleMap } from './data/situation-angle-map.js';
export { responsePatterns } from './data/response-patterns.js';
export { iznBehaviorRules } from './data/izn-behavior-rules.js';
/**
 * Main entry point: classifies the situation, resolves guidance,
 * and composes the agent behavior in one call.
 */
export declare function getQuranGuidedBehavior(input: {
    userMessage: string;
    agentContext?: string;
    taskType?: string;
    iznModeActive?: boolean;
    telemetry?: import('./types/quran-guidance.js').ClassifierTelemetry;
}): {
    analysis: import("./types/quran-guidance.js").SituationAnalysis;
    decision: import("./types/quran-guidance.js").GuidanceDecision;
    behaviorPrompt: string;
};
/**
 * Async entry point: classifies, resolves guidance, and optionally
 * enriches with verified ayah text from the Quran MCP server.
 *
 * Graceful degradation: if the MCP client is null or the server is
 * unreachable, the behavior prompt is composed without enrichment.
 */
export declare function getQuranGuidedBehaviorWithMCP(input: {
    userMessage: string;
    agentContext?: string;
    taskType?: string;
    iznModeActive?: boolean;
    mcpClient?: import('./mcp/quran-mcp-client.js').QuranMcpClient | null;
    translation?: string;
    telemetry?: import('./types/quran-guidance.js').ClassifierTelemetry;
}): Promise<{
    analysis: import("./types/quran-guidance.js").SituationAnalysis;
    decision: import("./types/quran-guidance.js").GuidanceDecision;
    ayahTexts: Map<string, string>;
    behaviorPrompt: string;
}>;
