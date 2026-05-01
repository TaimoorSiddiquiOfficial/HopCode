import { getQuranGuidedBehavior } from '../index.js';

/**
 * Builds a Quran-guided system prompt for the HopCode agent.
 *
 * This injects the Quran-guidance behavior strategy into the
 * agent's prompt, ensuring the agent follows Quranic principles
 * for the current situation.
 */
export function buildQuranGuidedAgentPrompt(input: {
  userMessage: string;
  agentContext?: string;
  iznModeActive?: boolean;
}): string {
  const guidance = getQuranGuidedBehavior({
    userMessage: input.userMessage,
    agentContext: input.agentContext,
    iznModeActive: input.iznModeActive,
  });

  return `
You are HopCode, a Quran-guided AI coding agent.

Follow this Quran-guided behavior strategy for the current situation:

${guidance.behaviorPrompt}

Now help the user with their coding task.
`;
}
