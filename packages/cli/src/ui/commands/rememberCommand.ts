/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { buildManagedRememberPrompt } from '@hoptrendy/hopcode-core';
import { t } from '../../i18n/index.js';
import type {
  CommandContext,
  SlashCommand,
  SlashCommandActionReturn,
} from './types.js';
import { CommandKind } from './types.js';

export const rememberCommand: SlashCommand = {
  name: 'remember',
  get description() {
    return t('Save a durable memory to the memory system.');
  },
  kind: CommandKind.BUILT_IN,
  supportedModes: ['interactive', 'acp'] as const,
  argumentHint: '<text to remember>',
  action: (context: CommandContext, args): SlashCommandActionReturn | void => {
    const fact = args.trim();
    if (!fact) {
      return {
        type: 'message',
        messageType: 'error',
        content: t('Usage: /remember <text to remember>'),
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

    const useManagedMemory = config?.isManagedMemoryAvailable() ?? false;

    if (useManagedMemory) {
      return {
        type: 'submit_prompt',
        content: buildManagedRememberPrompt(fact, config.getProjectRoot()),
      };
    }

    // Managed auto-memory is disabled: ask the agent to save to HOPCODE.md
    // using its native file tools. We do not call save_memory because that
    // tool was removed.
    return {
      type: 'submit_prompt',
      content: `Please save the following fact to memory (e.g. append to HOPCODE.md in the project root):\n\n${fact}`,
    };
  },
};
