/**
 * Builds a Quran-guided system prompt for the HopCode agent.
 *
 * This injects the Quran-guidance behavior strategy into the
 * agent's prompt, ensuring the agent follows Quranic principles
 * for the current situation.
 */
export declare function buildQuranGuidedAgentPrompt(input: {
    userMessage: string;
    agentContext?: string;
    iznModeActive?: boolean;
}): string;
