#!/usr/bin/env node
// Rebranding script for cherry-pick b55b52543 (slash command discovery)
// Takes upstream content and applies HopCode rebranding rules

import { readFileSync, writeFileSync } from 'fs';
import { globSync } from 'glob';

const REBRAND_RULES = [
  // Most specific first — scoped packages
  [/@qwen-code\/qwen-code-core/g, '@hoptrendy/hopcode-core'],
  [/@qwen-code\/qwen-code-cli/g, '@hoptrendy/hopcode-cli'],
  [/@qwen-code\/webui/g, '@hoptrendy/webui'],
  [/@qwen-code\/qwen-code/g, '@hoptrendy/hopcode'],
  // Environment variables
  [/QWEN_CODE_HOME/g, 'HOPCODE_HOME'],
  [/QWEN_HOME/g, 'HOPCODE_HOME'],
  // CLI/pkg/dir names
  [/qwen-code/g, 'hopcode'],
  // Class/User-Agent
  [/QwenCode/g, 'HopCode'],
  // Product name (with space)
  [/Qwen Code/g, 'HopCode'],
  // Config dirs
  [/\.qwen\//g, '.hopcode/'],
  [/\.qwen\\/g, '.hopcode\\'],
  // Model constants
  [/DEFAULT_QWEN_MODEL/g, 'DEFAULT_HOPCODE_MODEL'],
  // Log prefixes
  [/\[qwen-code\]/g, '[hopcode]'],
  // Agent manager / session names
  [/qwenAgentManager/g, 'hopcodeAgentManager'],
  [/QwenAgentManager/g, 'HopCodeAgentManager'],
  [/newQwenSession/g, 'newHopCodeSession'],
  [/switchQwenSession/g, 'switchHopCodeSession'],
  [/getQwenSessions/g, 'getHopCodeSessions'],
  [/deleteQwenSession/g, 'deleteHopCodeSession'],
  [/renameQwenSession/g, 'renameHopCodeSession'],
  [/qwenSessionSwitched/g, 'hopcodeSessionSwitched'],
  // CSS classes
  [/qwen-message/g, 'hopcode-message'],
  // Copyright
  [/Copyright 2025 Qwen Team/g, 'Copyright 2025 HopCode Team'],
  // Docs URL (but NOT GitHub issue URLs or VS Code marketplace IDs)
  [/qwenlm\.github\.io/g, 'hopcode.dev'],
  // Test paths
  [/qwen-cli-test/g, 'hopcode-cli-test'],
  [/qwen-slash-phase3/g, 'hopcode-slash-phase3'],
  // Config dir in tests
  [/qwen-config-dir/g, 'hopcode-config-dir'],
  // Source paths — only in code, not in docs/archive
  // DON'T rebrand: AI model names, GitHub issue URLs, VS Code marketplace IDs
];

// Files to process — the 12 conflicted files from cherry-pick
const files = [
  'docs/design/slash-command/phase3-technical-design.md',
  'docs/design/slash-command/roadmap.md',
  'packages/cli/src/acp-integration/session/Session.test.ts',
  'packages/cli/src/acp-integration/session/Session.ts',
  'packages/cli/src/services/commandMetadata.test.ts',
  'packages/cli/src/services/commandMetadata.ts',
  'packages/cli/src/ui/commands/helpCommand.test.ts',
  'packages/cli/src/ui/commands/helpCommand.ts',
  'packages/cli/src/ui/components/Help.test.tsx',
  'packages/cli/src/ui/components/Help.tsx',
  'packages/cli/src/ui/hooks/useCommandCompletion.tsx',
  'packages/cli/src/ui/hooks/useSlashCompletion.test.ts',
];

let totalReplacements = 0;

for (const file of files) {
  try {
    let content = readFileSync(file, 'utf8');
    let fileReplacements = 0;
    
    for (const [pattern, replacement] of REBRAND_RULES) {
      const matches = content.match(pattern);
      if (matches) {
        content = content.replace(pattern, replacement);
        fileReplacements += matches.length;
      }
    }
    
    if (fileReplacements > 0) {
      writeFileSync(file, content, 'utf8');
      console.log(`✓ ${file}: ${fileReplacements} replacements`);
      totalReplacements += fileReplacements;
    } else {
      console.log(`  ${file}: no changes needed`);
    }
  } catch (e) {
    console.error(`✗ ${file}: ${e.message}`);
  }
}

console.log(`\nTotal: ${totalReplacements} replacements across ${files.length} files`);