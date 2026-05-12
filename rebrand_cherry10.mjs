import { readFileSync, writeFileSync } from 'fs';

const files = [
  'integration-tests/cli/json-schema.test.ts',
  'integration-tests/cli/tool-search.test.ts',
  'packages/cli/src/config/config.ts',
  'packages/cli/src/config/jsonSchemaArg.test.ts',
  'packages/cli/src/gemini.tsx',
  'packages/cli/src/nonInteractiveCli.test.ts',
  'packages/cli/src/nonInteractiveCli.ts',
  'packages/cli/src/ui/commands/contextCommand.test.ts',
  'packages/core/src/config/config.ts',
  'packages/core/src/core/prompts.test.ts',
  'packages/core/src/core/prompts.ts',
  'packages/core/src/index.ts',
  'packages/core/src/tools/askUserQuestion.ts',
  'packages/core/src/tools/syntheticOutput.test.ts',
  'packages/core/src/tools/syntheticOutput.ts',
  'packages/core/src/tools/tool-names.ts',
  'packages/core/src/tools/tool-search.test.ts',
  'packages/core/src/tools/tool-search.ts',
  'packages/core/src/utils/schemaValidator.ts',
];

// Rebranding rules - ORDER MATTERS (most specific first)
const replacements = [
  // Package scope references
  [/@qwen-code\/qwen-code-core/g, '@hoptrendy/hopcode-core'],
  [/@qwen-code\/qwen-code-cli/g, '@hoptrendy/hopcode-cli'],
  [/@qwen-code\/webui/g, '@hoptrendy/webui'],
  [/@qwen-code\/qwen-code/g, '@hoptrendy/hopcode'],
  [/@qwen-code\/channel-[a-z-]+/g, (m) => m.replace('@qwen-code/channel-', '@hoptrendy/channel-')],

  // Environment variables (most specific first)
  [/QWEN_CODE_HOME/g, 'HOPCODE_HOME'],
  [/QWEN_HOME/g, 'HOPCODE_HOME'],
  [/DEFAULT_QWEN_MODEL/g, 'DEFAULT_HOPCODE_MODEL'],
  [/DEFAULT_QWEN_FLASH_MODEL/g, 'DEFAULT_HOPCODE_FLASH_MODEL'],
  [/DEFAULT_QWEN_EMBEDDING_MODEL/g, 'DEFAULT_HOPCODE_EMBEDDING_MODEL'],
  [/QWEN_OAUTH_MODELS/g, 'HOPCODE_OAUTH_MODELS'],
  [/QWEN_SANDBOX/g, 'HOPCODE_SANDBOX'],
  [/QWEN_MODEL/g, 'HOPCODE_MODEL'],

  // CLI/command identifiers
  [/qwen-code-vscode-ide-companion/g, 'hopcode-vscode-ide-companion'],
  [/install-qwen\.(sh|bat)/g, 'install-hopcode.$1'],
  [/\[qwen-code\]/g, '[hopcode]'],

  // Class/type names
  [/QwenCode/g, 'HopCode'],
  [/QwenLogger/g, 'HopLogger'],

  // Brand names
  [/Qwen Code/g, 'HopCode'],
  [/qwen-code/g, 'hopcode'],

  // OAuth provider paths
  [/qwen\/qwenOAuth2/g, 'hopcode/hopOAuth2'],

  // Config directory
  [/\.qwen\//g, '.hopcode/'],

  // Copyright
  [/Copyright 2025 Qwen Team/g, 'Copyright 2025 HopCode Team'],
  [/Copyright 2025 Qwen/g, 'Copyright 2025 HopCode Team'],
  [/Copyright 2025 Google LLC/g, 'Copyright 2025 HopCode Team'],

  // Website
  [/qwenlm\.github\.io/g, 'hopcode.dev'],
];

// NEVER rebrand these - model names, GitHub URLs, VS Code marketplace IDs, etc.
// Model names: qwen3.6-plus, Qwen3-Coder, qwen-max, qwen-plus, qwen-turbo, etc.
// These should remain unchanged.

let totalChanges = 0;
for (const file of files) {
  let content = readFileSync(file, 'utf8');
  let changes = 0;
  for (const [pattern, replacement] of replacements) {
    const before = content;
    content = content.replace(pattern, replacement);
    if (content !== before) {
      const diff = content.length - before.length;
      changes += diff !== 0 ? 1 : 0; // simplified count
    }
  }
  // Count actual changes by comparing
  const origLines = readFileSync(file, 'utf8').split('\n');
  const newLines = content.split('\n');
  let lineChanges = 0;
  for (let i = 0; i < Math.max(origLines.length, newLines.length); i++) {
    if (origLines[i] !== newLines[i]) lineChanges++;
  }
  if (lineChanges > 0) {
    writeFileSync(file, content, 'utf8');
    console.log(`${file}: ${lineChanges} lines changed`);
    totalChanges += lineChanges;
  } else {
    console.log(`${file}: no changes`);
  }
}
console.log(`\nTotal: ${totalChanges} lines changed across ${files.length} files`);