import fs from 'fs';

function resolveConflictsTakeTheirsAndRebrand(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(/\r\n/g, '\n');
  
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
    if (inOurs) continue;
    if (inTheirs) {
      result.push(line);
      continue;
    }
    result.push(line);
  }
  
  content = result.join('\n');
  
  // Rebrand
  content = content.replace(/@qwen-code\/qwen-code-core/g, '@hoptrendy/hopcode-core');
  content = content.replace(/@qwen-code\/qwen-code-cli/g, '@hoptrendy/hopcode-cli');
  content = content.replace(/@qwen-code\/webui/g, '@hoptrendy/webui');  // Note this pattern
  content = content.replace(/qwenAgentManager/g, 'hopcodeAgentManager');
  content = content.replace(/QwenAgentManager/g, 'HopCodeAgentManager');
  content = content.replace(/newQwenSession/g, 'newHopCodeSession');
  content = content.replace(/switchQwenSession/g, 'switchHopCodeSession');
  content = content.replace(/getQwenSessions/g, 'getHopCodeSessions');
  content = content.replace(/deleteQwenSession/g, 'deleteHopCodeSession');
  content = content.replace(/renameQwenSession/g, 'renameHopCodeSession');
  content = content.replace(/qwenSessionSwitched/g, 'hopcodeSessionSwitched');
  content = content.replace(/Qwen Code/g, 'HopCode');
  content = content.replace(/qwen-code/g, 'hopcode');
  content = content.replace(/QwenCode/g, 'HopCode');
  
  // Remove BOM
  content = content.replace(/^\uFEFF/, '');
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Resolved: ${filePath}`);
}

// SessionMessageHandler.test.ts
resolveConflictsTakeTheirsAndRebrand('packages/vscode-ide-companion/src/webview/handlers/SessionMessageHandler.test.ts');

// SessionMessageHandler.ts
resolveConflictsTakeTheirsAndRebrand('packages/vscode-ide-companion/src/webview/handlers/SessionMessageHandler.ts');

// Verify no remaining conflicts
for (const f of [
  'packages/vscode-ide-companion/src/webview/handlers/SessionMessageHandler.test.ts',
  'packages/vscode-ide-companion/src/webview/handlers/SessionMessageHandler.ts',
]) {
  const content = fs.readFileSync(f, 'utf8');
  const conflictCount = (content.match(/<<<<<<< HEAD/g) || []).length;
  console.log(`${f}: ${conflictCount} conflicts remaining`);
}