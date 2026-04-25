// Script to fix TypeScript index signature access errors (code 4111)
// This fixes the pattern: obj.property → obj['property'] when obj has an index signature

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.dirname(fileURLToPath(import.meta.url));

// Files to process (from the diagnostics)
const filesToProcess = [
  'packages/cli/src/ui/commands/agentOwaspComplianceCommand.ts',
  'packages/cli/src/ui/commands/githubAuthCommand.ts',
  'packages/cli/src/ui/commands/githubCommand.ts',
  'packages/cli/src/ui/commands/githubDeviceAuthCommand.ts',
  'packages/cli/src/ui/commands/makeSkillTemplateCommand.ts',
  'packages/cli/src/ui/commands/mcpSecurityAuditCommand.ts',
  'packages/core/src/provider/auth.ts',
  'packages/core/src/provider/provider.ts',
  'packages/sdk-typescript/src/mcp/formatters.ts',
  'packages/sdk-typescript/src/transport/ProcessTransport.ts',
  'packages/server/src/session-manager.ts',
  'packages/server/src/in-process-session-manager.ts',
  'packages/vscode-ide-companion/src/extension.ts',
  'packages/vscode-ide-companion/src/services/acpConnection.ts',
  'packages/vscode-ide-companion/src/services/hopcodeAgentManager.ts',
  'packages/vscode-ide-companion/src/services/hopcodeSessionReader.ts',
  'packages/vscode-ide-companion/src/services/settingsWriter.ts',
  'packages/vscode-ide-companion/src/webview/App.tsx',
  'packages/vscode-ide-companion/src/webview/handlers/FileMessageHandler.ts',
  'packages/vscode-ide-companion/src/webview/handlers/SessionMessageHandler.ts',
  'packages/vscode-ide-companion/src/webview/hooks/session/useSessionManagement.ts',
  'packages/vscode-ide-companion/src/webview/hooks/useWebViewMessages.ts',
  'packages/vscode-ide-companion/src/webview/providers/WebViewProvider.ts',
];

// Pattern to match: process.env.PROPERTY_NAME or obj.property (when obj has index signature)
// For process.env accesses
const processEnvPattern = /process\.env\.([A-Z_]+)/g;

// For config, cfg, settings, etc. - needs context-aware fixing
// Let's focus on process.env first as it's the most common

let totalFixes = 0;

filesToProcess.forEach((relativePath) => {
  const fullPath = path.join(repoRoot, relativePath);
  if (!fs.existsSync(fullPath)) {
    console.log(`File not found: ${fullPath}`);
    return;
  }

  let content = fs.readFileSync(fullPath, 'utf8');
  let fileFixes = 0;

  // Fix process.env.PROPERTY → process.env['PROPERTY']
  content = content.replace(processEnvPattern, (_match, propName) => {
    fileFixes++;
    return `process.env['${propName}']`;
  });

  // Fix common patterns like config.mcpServers, cfg.image, etc.
  // These need more careful handling

  if (fileFixes > 0) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`Fixed ${fileFixes} occurrences in ${relativePath}`);
    totalFixes += fileFixes;
  }
});

console.log(`\nTotal fixes applied: ${totalFixes}`);

// Now let's also fix the config['mcpServers'] pattern and similar
// This is more complex and needs to be done carefully
