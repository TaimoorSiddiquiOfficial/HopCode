/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { EditTool } from '../tools/edit.js';
import { GlobTool } from '../tools/glob.js';
import { ReadFileTool } from '../tools/read-file.js';
import { ToolNames } from '../tools/tool-names.js';
import { WriteFileTool, } from '../tools/write-file.js';
import { makeFakeConfig } from '../test-utils/config.js';
import { getCoreSystemPrompt } from './prompts.js';
function examplesFor(style) {
    vi.stubEnv('QWEN_CODE_TOOL_CALL_STYLE', style);
    const prompt = getCoreSystemPrompt();
    return prompt.slice(prompt.lastIndexOf('# Examples (Illustrating Tone'));
}
function parseValue(value) {
    const trimmed = value.trim();
    if (trimmed === 'true')
        return true;
    if (trimmed === 'false')
        return false;
    if (/^\d+$/.test(trimmed))
        return Number(trimmed);
    return trimmed;
}
function parseCoderCalls(prompt) {
    return Array.from(prompt.matchAll(/<tool_call>\s*<function=([^>]+)>\s*([\s\S]*?)<\/function>\s*<\/tool_call>/g), (match) => {
        const args = {};
        for (const param of match[2].matchAll(/<parameter=([^>]+)>\s*([\s\S]*?)\s*<\/parameter>/g)) {
            args[param[1]] = parseValue(param[2]);
        }
        return { name: match[1], arguments: args };
    });
}
function parseVlCalls(prompt) {
    return Array.from(prompt.matchAll(/<tool_call>\s*(\{[\s\S]*?\})\s*<\/tool_call>/g), (match) => JSON.parse(match[1]));
}
describe('prompt tool call examples', () => {
    afterEach(() => {
        vi.unstubAllEnvs();
    });
    it.each([
        ['qwen-coder', parseCoderCalls],
        ['qwen-vl', parseVlCalls],
    ])('keeps %s examples valid against current tool schemas', (style, parse) => {
        const config = makeFakeConfig();
        const validators = {
            [ToolNames.GLOB]: (args) => new GlobTool(config).validateToolParams(args),
            [ToolNames.READ_FILE]: (args) => new ReadFileTool(config).validateToolParams(args),
            [ToolNames.EDIT]: (args) => new EditTool(config).validateToolParams(args),
            [ToolNames.WRITE_FILE]: (args) => new WriteFileTool(config).validateToolParams(args),
        };
        const calls = parse(examplesFor(style)).filter((call) => validators[call.name]);
        expect(new Set(calls.map((call) => call.name))).toEqual(new Set(Object.keys(validators)));
        for (const call of calls) {
            expect(validators[call.name](call.arguments), `${call.name} example arguments: ${JSON.stringify(call.arguments)}`).toBeNull();
        }
    });
});
//# sourceMappingURL=prompt-tool-examples.test.js.map