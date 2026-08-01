/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type { LoadedSettings } from '../../config/settings.js';
import type { CliArgs } from '../../config/config.js';
/**
 * At startup, apply the active profile's provider/model configuration to
 * settings so the runtime picks them up.  This makes `hopcode profile use`
 * take effect without a manual `/provider` step on next launch.
 *
 * Skips application when the user explicitly passed `--model` on the CLI
 * (explicit args should always win).
 */
export declare function applyActiveProfile(settings: LoadedSettings, argv: CliArgs): Promise<void>;
