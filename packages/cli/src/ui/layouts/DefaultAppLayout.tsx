/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import type React from 'react';
import { Box } from 'ink';
import { MainContent } from '../components/MainContent.js';
import { DialogManager } from '../components/DialogManager.js';
import { Composer } from '../components/Composer.js';
import { ExitWarning } from '../components/ExitWarning.js';
import { BtwMessage } from '../components/messages/BtwMessage.js';
import { AgentTabBar } from '../components/agent-view/AgentTabBar.js';
import { AgentChatView } from '../components/agent-view/AgentChatView.js';
import { AgentComposer } from '../components/agent-view/AgentComposer.js';
import { useUIState } from '../contexts/UIStateContext.js';
import { useAgentViewState } from '../contexts/AgentViewContext.js';
import { useTerminalSize } from '../hooks/useTerminalSize.js';

export const DefaultAppLayout: React.FC = () => {
  const uiState = useUIState();
  const { activeView, agents } = useAgentViewState();
  const { columns: terminalWidth } = useTerminalSize();
  const hasAgents = agents.size > 0;
  const isAgentTab = activeView !== 'main' && agents.has(activeView);

  // We intentionally do NOT clear the terminal on view switch.
  // The previous view's <Static> output remains as scrollback, which is
  // consistent with normal terminal expectations. A full screen clear on
  // every view switch was a major source of visible flicker and is no
  // longer necessary because Ink handles the dynamic/dynamic boundary
  // between views without corruption in practice.

  return (
    <Box flexDirection="column" width={terminalWidth}>
      {isAgentTab ? (
        <>
          {/* Agent view: chat history + agent-specific composer */}
          <AgentChatView agentId={activeView} />
          <Box flexDirection="column" ref={uiState.mainControlsRef}>
            <AgentComposer key={activeView} agentId={activeView} />
            <ExitWarning />
          </Box>
        </>
      ) : (
        <>
          {/* Main view: conversation history + main composer / dialogs */}
          <MainContent />
          <Box flexDirection="column" ref={uiState.mainControlsRef}>
            {uiState.dialogsVisible ? (
              <Box
                marginX={2}
                flexDirection="column"
                width={uiState.mainAreaWidth}
              >
                <DialogManager
                  terminalWidth={uiState.terminalWidth}
                  addItem={uiState.historyManager.addItem}
                />
              </Box>
            ) : (
              <>
                {uiState.btwItem && (
                  <Box marginX={2} width={uiState.mainAreaWidth}>
                    <BtwMessage
                      btw={uiState.btwItem.btw}
                      containerWidth={uiState.mainAreaWidth}
                    />
                  </Box>
                )}
                <Composer />
              </>
            )}
            <ExitWarning />
          </Box>
        </>
      )}

      {/* Tab bar: visible whenever in-process agents exist and input is active */}
      {hasAgents && !uiState.dialogsVisible && <AgentTabBar />}
    </Box>
  );
};
