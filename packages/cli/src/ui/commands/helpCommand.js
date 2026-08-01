/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { CommandKind } from './types.js';
import { t } from '../../i18n/index.js';
export const helpCommand = {
    name: 'help',
    altNames: ['?'],
    kind: CommandKind.BUILT_IN,
    supportedModes: ['interactive'],
    get description() {
        return t('for help on HopCode');
    },
    action: async () => ({
        type: 'dialog',
        dialog: 'help',
    }),
};
//# sourceMappingURL=helpCommand.js.map