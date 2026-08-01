/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type React from 'react';
import type { LoadedSettings } from '../../config/settings.js';
import { SettingScope } from '../../config/settings.js';
import { type Config } from '@hoptrendy/hopcode-core';
interface SettingsDialogProps {
    settings: LoadedSettings;
    onSelect: (settingName: string | undefined, scope: SettingScope) => void;
    onRestartRequest?: () => void;
    availableTerminalHeight?: number;
    width?: number;
    config?: Config;
}
export declare function SettingsDialog({ settings, onSelect, onRestartRequest, availableTerminalHeight, width, config, }: SettingsDialogProps): React.JSX.Element;
export {};
