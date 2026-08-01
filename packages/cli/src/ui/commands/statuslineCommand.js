/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { CommandKind } from './types.js';
import { t } from '../../i18n/index.js';
export const statuslineCommand = {
    name: 'statusline',
    get description() {
        return t("Set up HopCode's status line UI");
    },
    kind: CommandKind.BUILT_IN,
    supportedModes: ['interactive'],
    action: (_context, args) => {
        const prompt = args.trim();
        if (!prompt) {
            return {
                type: 'dialog',
                dialog: 'statusline',
            };
        }
        return {
            type: 'submit_prompt',
            content: [
                {
                    text: `Use the Agent tool with subagent_type: "statusline-setup" and this prompt:\n\n${prompt}`,
                },
            ],
        };
    },
};
//# sourceMappingURL=statuslineCommand.js.map