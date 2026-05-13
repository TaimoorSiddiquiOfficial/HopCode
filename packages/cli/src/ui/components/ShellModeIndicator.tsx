/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */

import type React from 'react';
import { Text } from 'ink';
import { theme } from '../semantic-colors.js';

export const ShellModeIndicator: React.FC = () => (
  <Text color={theme.ui.symbol}>
    shell mode enabled
    <Text color={theme.text.secondary}> (esc to disable)</Text>
  </Text>
);
