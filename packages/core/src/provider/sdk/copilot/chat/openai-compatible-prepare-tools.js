import { UnsupportedFunctionalityError, } from '@ai-sdk/provider';
export function prepareTools({ tools, toolChoice, }) {
    // when the tools array is empty, change it to undefined to prevent errors:
    tools = tools?.length ? tools : undefined;
    const toolWarnings = [];
    if (tools == null) {
        return { tools: undefined, toolChoice: undefined, toolWarnings };
    }
    const openaiCompatTools = [];
    for (const tool of tools) {
        if (tool.type === 'provider-defined') {
            toolWarnings.push({ type: 'unsupported-tool', tool });
        }
        else {
            openaiCompatTools.push({
                type: 'function',
                function: {
                    name: tool.name,
                    description: tool.description,
                    parameters: tool.inputSchema,
                },
            });
        }
    }
    if (toolChoice == null) {
        return { tools: openaiCompatTools, toolChoice: undefined, toolWarnings };
    }
    const type = toolChoice.type;
    switch (type) {
        case 'auto':
        case 'none':
        case 'required':
            return { tools: openaiCompatTools, toolChoice: type, toolWarnings };
        case 'tool':
            return {
                tools: openaiCompatTools,
                toolChoice: {
                    type: 'function',
                    function: { name: toolChoice.toolName },
                },
                toolWarnings,
            };
        default: {
            const _exhaustiveCheck = type;
            throw new UnsupportedFunctionalityError({
                functionality: `tool choice type: ${_exhaustiveCheck}`,
            });
        }
    }
}
//# sourceMappingURL=openai-compatible-prepare-tools.js.map