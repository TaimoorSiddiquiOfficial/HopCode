/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */

import type React from 'react';
import { Box, Text } from 'ink';
import { theme } from '../semantic-colors.js';
import { ContextUsageDisplay } from './ContextUsageDisplay.js';
import { useTerminalSize } from '../hooks/useTerminalSize.js';
import { AutoAcceptIndicator } from './AutoAcceptIndicator.js';
import { ShellModeIndicator } from './ShellModeIndicator.js';
import { BackgroundTasksPill } from './background-view/BackgroundTasksPill.js';
import { MCPHealthPill } from './mcp/MCPHealthPill.js';
import { isNarrowWidth } from '../utils/isNarrowWidth.js';

import { useStatusLine } from '../hooks/useStatusLine.js';
import { useUIState } from '../contexts/UIStateContext.js';
import { useConfig } from '../contexts/ConfigContext.js';
import { useSettings } from '../contexts/SettingsContext.js';
import { useVimMode } from '../contexts/VimModeContext.js';
import { ApprovalMode } from '@hoptrendy/hopcode-core';
import { GoalPill, useFooterGoalState } from './GoalPill.js';
import { t } from '../../i18n/index.js';

export const Footer: React.FC = () => {
  const uiState = useUIState();
  const config = useConfig();
  const settings = useSettings();
  const { vimEnabled, vimMode } = useVimMode();
  const { lines: statusLineLines, useThemeColors } = useStatusLine();

  const { promptTokenCount, showAutoAcceptIndicator } = {
    promptTokenCount: uiState.sessionStats.lastPromptTokenCount,
    showAutoAcceptIndicator: uiState.showAutoAcceptIndicator,
  };

  const { columns: terminalWidth } = useTerminalSize();
  const isNarrow = isNarrowWidth(terminalWidth);

  // Determine sandbox info from environment
  const sandboxEnv = process.env['SANDBOX'];
  const sandboxInfo = sandboxEnv
    ? sandboxEnv === 'sandbox-exec'
      ? 'seatbelt'
      : sandboxEnv.startsWith('hopcode')
        ? 'docker'
        : sandboxEnv
    : null;

  // Check if debug mode is enabled
  const debugMode = config.getDebugMode();

  const contextWindowSize =
    config.getContentGeneratorConfig()?.contextWindowSize;

  // Determine if config is still initializing
  const isInitializing = uiState.isConfigInitialized === false;

  // Hide "? for shortcuts" when a custom status line is active (it already
  // occupies the footer, so the hint is redundant). Matches upstream behavior.
  const suppressHint = isInitializing || statusLineLines.length > 0;

  // Left bottom row: high-priority messages > approval mode > hint.
  const leftBottomContent = isInitializing ? (
    <Text color={theme.text.secondary} dimColor>
      {t('Initializing...')}
    </Text>
  ) : uiState.ctrlCPressedOnce ? (
    <Text color={theme.status.warning}>{t('Press Ctrl+C again to exit.')}</Text>
  ) : uiState.ctrlDPressedOnce ? (
    <Text color={theme.status.warning}>{t('Press Ctrl+D again to exit.')}</Text>
  ) : uiState.showEscapePrompt ? (
    <Text color={theme.text.secondary}>{t('Press Esc again to clear.')}</Text>
  ) : uiState.rewindEscPending ? (
    <Text color={theme.text.secondary}>
      {t('Press Esc again to rewind conversation.')}
    </Text>
  ) : vimEnabled && vimMode === 'INSERT' ? (
    <Text color={theme.text.secondary}>-- INSERT --</Text>
  ) : uiState.shellModeActive ? (
    <ShellModeIndicator />
  ) : showAutoAcceptIndicator !== undefined &&
    showAutoAcceptIndicator !== ApprovalMode.DEFAULT ? (
    <AutoAcceptIndicator approvalMode={showAutoAcceptIndicator} />
  ) : suppressHint ? null : (
    <Text color={theme.text.secondary}>{t('? for shortcuts')}</Text>
  );

  const rightItems: Array<{ key: string; node: React.ReactNode }> = [];
  if (sandboxInfo) {
    rightItems.push({
      key: 'sandbox',
      node: <Text color={theme.status.success}>🔒 {sandboxInfo}</Text>,
    });
  }
  if (debugMode) {
    rightItems.push({
      key: 'debug',
      node: <Text color={theme.status.warning}>Debug Mode</Text>,
    });
  }
  // Dream tasks now surface via the BackgroundTasksPill (e.g. "1 dream")
  // alongside the other background-task kinds. The previous `✦ dreaming`
  // right-column indicator was removed to avoid two simultaneous signals
  // for the same underlying state.
  if (promptTokenCount > 0 && contextWindowSize) {
    rightItems.push({
      key: 'context',
      node: (
        <Text color={theme.text.accent}>
          <ContextUsageDisplay
            promptTokenCount={promptTokenCount}
            terminalWidth={terminalWidth}
            contextWindowSize={contextWindowSize}
          />
        </Text>
      ),
    });
  }
  // Goal pill: only present in `rightItems` when a goal is active so the
  // divider chain stays tight; the pill itself does the live elapsed-time
  // refresh internally.
  const goalActive = useFooterGoalState() !== undefined;
  if (goalActive) {
    rightItems.push({ key: 'goal', node: <GoalPill /> });
  }

  // Layout matches upstream: left column has status line (top) + hints/mode
  // (bottom), right section has indicators. Status line and hints coexist.
  return (
    <Box
      flexDirection={isNarrow ? 'column' : 'row'}
      justifyContent={isNarrow ? 'flex-start' : 'space-between'}
      width="100%"
      paddingX={2}
      gap={isNarrow ? 0 : 1}
    >
      {/* Left column — status line on top, hints/mode on bottom */}
      <Box flexDirection="column" flexShrink={isNarrow ? 0 : 1}>
        {statusLineLines.length > 0 &&
          !uiState.ctrlCPressedOnce &&
          !uiState.ctrlDPressedOnce &&
          statusLineLines.map((line, i) => (
            <Text
              key={`status-line-${i}`}
              color={useThemeColors ? theme.text.accent : undefined}
              dimColor={!useThemeColors}
              wrap="truncate"
            >
              {line}
            </Text>
          ))}
        {/* Built-in worktree indicator. Shown by default whenever a
            worktree is active so the user always has a UI affordance,
            even when a custom statusline is configured — their script
            may not render `payload.worktree` (written before Phase C,
            ignored by choice, or only rendering some fields), and
            silently hiding the indicator could let the user operate
            in the wrong cwd. Users who want the suppression behaviour
            (e.g. their statusline already renders worktree) can opt
            in via the `ui.hideBuiltinWorktreeIndicator` setting.
            Hidden during ctrl-quit warnings so they take precedence.
            (PR #4174 review #3256241831.) */}
        {uiState.activeWorktree &&
          !settings.merged.ui?.hideBuiltinWorktreeIndicator &&
          !uiState.ctrlCPressedOnce &&
          !uiState.ctrlDPressedOnce && (
            <Text dimColor wrap="truncate">
              {`⎇ ${uiState.activeWorktree.branch} (${uiState.activeWorktree.slug})`}
            </Text>
          )}
        <Box flexDirection="row" flexShrink={1}>
          <Text wrap="truncate">{leftBottomContent}</Text>
          <BackgroundTasksPill />
          <MCPHealthPill />
        </Box>
      </Box>

      {/* Right Section — never compressed, aligns to top so multi-line
          status lines on the left don't push the indicators to the center. */}
      <Box flexShrink={0} gap={1} alignItems="flex-start">
        {rightItems.map(({ key, node }, index) => (
          <Box key={key} alignItems="center">
            {index > 0 && <Text color={theme.text.secondary}> | </Text>}
            {node}
          </Box>
        ))}
      </Box>
    </Box>
  );
};
