/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { Box, Text } from 'ink';
import { theme } from '../../../semantic-colors.js';
import { useKeypress } from '../../../hooks/useKeypress.js';
import { t } from '../../../../i18n/index.js';
import type { ToolListStepProps, MCPToolDisplayInfo } from '../types.js';
import { VISIBLE_TOOLS_COUNT } from '../constants.js';

export const ToolListStep: React.FC<ToolListStepProps> = ({
  tools,
  onSelect,
  onBack,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  // ??????????????(??????)
  const toolNameWidth = useMemo(() => {
    if (tools.length === 0) return 30;
    const maxLength = Math.max(...tools.map((t) => t.name.length));
    // ?? 30,?? 50,?????
    return Math.min(Math.max(maxLength + 2, 30), 50);
  }, [tools]);

  // ???????????(????)
  const scrollOffset = useMemo(() => {
    if (tools.length <= VISIBLE_TOOLS_COUNT) {
      return 0;
    }
    // ???????????
    if (selectedIndex < VISIBLE_TOOLS_COUNT - 1) {
      return 0;
    }
    return Math.min(
      selectedIndex - VISIBLE_TOOLS_COUNT + 1,
      tools.length - VISIBLE_TOOLS_COUNT,
    );
  }, [selectedIndex, tools.length]);

  // ?????????
  const displayTools = useMemo(
    () => tools.slice(scrollOffset, scrollOffset + VISIBLE_TOOLS_COUNT),
    [tools, scrollOffset],
  );

  useKeypress(
    (key) => {
      if (key.name === 'escape') {
        onBack();
      } else if (key.name === 'up') {
        setSelectedIndex((prev) => Math.max(0, prev - 1));
      } else if (key.name === 'down') {
        setSelectedIndex((prev) => Math.min(tools.length - 1, prev + 1));
      } else if (key.name === 'return') {
        if (tools[selectedIndex]) {
          onSelect(tools[selectedIndex]);
        }
      }
    },
    { isActive: true },
  );

  if (tools.length === 0) {
    return (
      <Box flexDirection="column">
        <Text color={theme.text.secondary}>
          {t('No tools available for this server.')}
        </Text>
      </Box>
    );
  }

  const getToolAnnotations = (tool: MCPToolDisplayInfo): string => {
    const hints: string[] = [];
    if (tool.annotations?.destructiveHint) hints.push('destructive');
    if (tool.annotations?.readOnlyHint) hints.push('read-only');
    if (tool.annotations?.openWorldHint) hints.push('open-world');
    if (tool.annotations?.idempotentHint) hints.push('idempotent');
    return hints.join(', ');
  };

  return (
    <Box flexDirection="column">
      {/* ???? */}
      <Box flexDirection="column">
        {displayTools.map((tool, index) => {
          const actualIndex = scrollOffset + index;
          const isSelected = actualIndex === selectedIndex;
          const annotations = getToolAnnotations(tool);

          return (
            <Box key={tool.name}>
              {/* ??? */}
              <Box minWidth={2}>
                <Text
                  color={isSelected ? theme.text.accent : theme.text.primary}
                >
                  {isSelected ? '?' : ' '}
                </Text>
              </Box>
              {/* ???? - ???? */}
              <Box width={toolNameWidth}>
                <Text
                  color={isSelected ? theme.text.accent : theme.text.primary}
                  wrap="truncate"
                >
                  {tool.name}
                </Text>
              </Box>
              {/* ???????? */}
              {!tool.isValid && (
                <Text color={theme.status.warning}>
                  {t('invalid: {{reason}}', {
                    reason: tool.invalidReason || t('unknown'),
                  })}
                </Text>
              )}
              {annotations && tool.isValid && (
                <Text color={theme.text.secondary}>{annotations}</Text>
              )}
            </Box>
          );
        })}
      </Box>

      {/* ???? */}
      {tools.length > VISIBLE_TOOLS_COUNT && (
        <Box marginTop={1}>
          <Text color={theme.text.secondary}>
            {scrollOffset > 0 ? '? ' : '  '}
            {t('{{current}}/{{total}}', {
              current: (selectedIndex + 1).toString(),
              total: tools.length.toString(),
            })}
            {scrollOffset + VISIBLE_TOOLS_COUNT < tools.length ? ' ?' : ''}
          </Text>
        </Box>
      )}
    </Box>
  );
};
