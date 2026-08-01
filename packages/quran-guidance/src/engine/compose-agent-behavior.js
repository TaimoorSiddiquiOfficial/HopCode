import { responsePatterns } from '../data/response-patterns.js';
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
export function composeAgentBehavior(decision, ayahTexts) {
    const patternKey = decision.responsePattern;
    const pattern = responsePatterns[patternKey] ?? responsePatterns.truthful_helpful_response;
    const refsLine = ayahTexts
        ? formatAyahRefsWithText(decision.ayahRefs, ayahTexts)
        : `Relevant curated ayah references: ${decision.ayahRefs.join(', ')}`;
    return [
        pattern.opening,
        '',
        pattern.body,
        '',
        'Apply these Quran-guided strategy rules:',
        ...decision.strategy.do.slice(0, 5).map((item) => `- ${item}`),
        '',
        'Avoid:',
        ...decision.strategy.avoid.slice(0, 3).map((item) => `- ${item}`),
        '',
        `Tone: ${decision.strategy.tone.join(', ')}`,
        '',
        refsLine,
    ].join('\n');
}
/**
 * Format ayah references with verified text when available.
 */
function formatAyahRefsWithText(refs, ayahTexts) {
    const lookup = ayahTexts instanceof Map
        ? (key) => ayahTexts.get(key)
        : (key) => ayahTexts[key];
    const lines = refs.map((ref) => {
        const text = lookup(ref);
        return text ? `${ref}: ${text}` : ref;
    });
    return `Relevant curated ayah references: ${lines.join('; ')}`;
}
//# sourceMappingURL=compose-agent-behavior.js.map