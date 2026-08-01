/**
 * @license
 * Copyright 2026 Qwen Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { buildLearnSkillPrompt } from '@hoptrendy/hopcode-core';
import { t } from '../../i18n/index.js';
import { CommandKind } from './types.js';
export const learnCommand = {
    name: 'learn',
    get description() {
        return t('Create a reusable skill from a knowledge source (file, URL, conversation, or text).');
    },
    kind: CommandKind.BUILT_IN,
    supportedModes: ['interactive', 'acp'],
    argumentHint: '<path|URL|text>',
    action: async (context, args) => {
        const rawInput = args.trim();
        if (!rawInput) {
            return {
                type: 'message',
                messageType: 'error',
                content: t('Usage: /learn <path|URL|text>\nExamples:\n  /learn https://docs.example.com/api\n  /learn ~/projects/acme-sdk\n  /learn Our deploy process: ssh to prod, run migrate, restart'),
            };
        }
        const config = context.services.config;
        if (!config) {
            return {
                type: 'message',
                messageType: 'error',
                content: t('Config not loaded.'),
            };
        }
        const projectRoot = config.getProjectRoot();
        return {
            type: 'submit_prompt',
            content: await buildLearnSkillPrompt(rawInput, projectRoot),
        };
    },
};
//# sourceMappingURL=learn-command.js.map