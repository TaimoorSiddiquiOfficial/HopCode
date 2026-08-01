/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { Config } from '../config/config.js';
/**
 * Default parameters used for {@link FAKE_CONFIG}
 */
export const DEFAULT_CONFIG_PARAMETERS = {
    usageStatisticsEnabled: true,
    debugMode: false,
    proxy: undefined,
    model: 'hopcode-9001-super-duper',
    targetDir: process.cwd(),
    cwd: process.cwd(),
};
/**
 * Produces a config.  Default parameters are set to
 * {@link DEFAULT_CONFIG_PARAMETERS}, optionally, fields can be specified to
 * override those defaults.
 */
export function makeFakeConfig(config = {
    ...DEFAULT_CONFIG_PARAMETERS,
}) {
    return new Config({
        ...DEFAULT_CONFIG_PARAMETERS,
        ...config,
    });
}
//# sourceMappingURL=config.js.map