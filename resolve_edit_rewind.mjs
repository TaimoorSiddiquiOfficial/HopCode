import fs from 'fs';

// These files have conflicts that are purely rebranding (qwen → hopcode).
// Strategy: take theirs (upstream content) and rebrand.
const rebrandFiles = [
  'packages/cli/src/acp-integration/session/Session.test.ts',
  'packages/cli/src/ui/utils/historyMapping.ts',
  'packages/vscode-ide-companion/src/services/conversationStore.test.ts',
  'packages/vscode-ide-companion/src/webview/App.tsx',
  'packages/vscode-ide-companion/src/webview/hooks/useMessageSubmit.test.ts',
  'packages/vscode-ide-companion/src/webview/hooks/useWebViewMessages.test.tsx',
  'packages/vscode-ide-companion/src/webview/providers/WebViewProvider.test.ts',
  'packages/webui/src/components/messages/Assistant/AssistantMessage.tsx',
  'packages/webui/src/components/messages/MessageMeta.test.tsx',
  'packages/webui/src/components/messages/MessageMeta.tsx',
  'packages/webui/src/components/messages/UserMessage.tsx',
];

for (const file of rebrandFiles) {
  try {
    let content = fs.readFileSync(file, 'utf8');
    
    // Remove conflict markers, always taking theirs (the upstream version)
    // Pattern: <<<<<<< HEAD\n...ours...\n=======\n...theirs...\n>>>>>>> sha
    content = content.replace(/\r\n/g, '\n');
    
    // Process line by line: keep theirs, discard ours
    const lines = content.split('\n');
    const result = [];
    let inOurs = false;
    let inTheirs = false;
    
    for (const line of lines) {
      if (line.startsWith('<<<<<<< HEAD')) {
        inOurs = true;
        continue;
      }
      if (line.startsWith('=======') && inOurs) {
        inOurs = false;
        inTheirs = true;
        continue;
      }
      if (line.startsWith('>>>>>>> ')) {
        inTheirs = false;
        continue;
      }
      if (inOurs) continue; // skip ours
      if (inTheirs) {
        result.push(line); // keep theirs
        continue;
      }
      result.push(line);
    }
    
    content = result.join('\n');
    
    // Now rebrand: qwen-code → hopcode patterns
    content = content.replace(/@qwen-code\/qwen-code-core/g, '@hoptrendy/hopcode-core');
    content = content.replace(/@qwen-code\/qwen-code-cli/g, '@hoptrendy/hopcode-cli');
    content = content.replace(/@qwen-code\/qwen-code/g, '@hoptrendy/hopcode');
    content = content.replace(/qwen-code/g, 'hopcode'); // CLI/pkg/dir name
    content = content.replace(/QwenCode/g, 'HopCode'); // class/User-Agent
    content = content.replace(/Qwen Code/g, 'HopCode'); // product
    content = content.replace(/\.qwen\//g, '.hopcode/'); // paths
    content = content.replace(/qwen-agent-manager/g, 'hopcode-agent-manager'); // URLs
    content = content.replace(/qwenAgentManager/g, 'hopcodeAgentManager'); // JS vars
    content = content.replace(/QwenAgentManager/g, 'HopCodeAgentManager'); // class
    content = content.replace(/qwenSessionSwitched/g, 'hopcodeSessionSwitched'); // event types
    content = content.replace(/newQwenSession/g, 'newHopCodeSession'); // message types
    content = content.replace(/switchQwenSession/g, 'switchHopCodeSession');
    content = content.replace(/getQwenSessions/g, 'getHopCodeSessions');
    content = content.replace(/deleteQwenSession/g, 'deleteHopCodeSession');
    content = content.replace(/renameQwenSession/g, 'renameHopCodeSession');
    content = content.replace(/qwen-message/g, 'hopcode-message'); // CSS
    content = content.replace(/Copyright 2025 Qwen Team/g, 'Copyright 2025 HopCode Team');
    content = content.replace(/Copyright 2025 Google LLC/g, 'Copyright 2025 HopCode Team');
    
    // Remove BOM if present
    content = content.replace(/^\uFEFF/, '');
    
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Resolved and rebranded: ${file}`);
  } catch (e) {
    console.error(`Error processing ${file}: ${e.message}`);
  }
}

console.log('Done processing rebrand files');