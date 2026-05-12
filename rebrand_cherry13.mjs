import { readFileSync, writeFileSync } from 'fs';

const files = [
  'packages/cli/src/ui/commands/diffCommand.test.ts',
  'packages/cli/src/ui/commands/diffCommand.ts',
  'packages/core/src/utils/gitDiff.test.ts',
  'packages/core/src/utils/gitDiff.ts',
];

// ORDER MATTERS — most specific first
const replacements = [
  [/@qwen-code\/qwen-code-core/g, '@hoptrendy/hopcode-core'],
  [/@qwen-code\/qwen-code-cli/g, '@hoptrendy/hopcode-cli'],
  [/@qwen-code\/webui/g, '@hoptrendy/webui'],
  [/@qwen-code\/qwen-code/g, '@hoptrendy/hopcode'],
  [/qwen-code/g, 'hopcode'],
  [/QwenCode/g, 'HopCode'],
  [/Qwen Code/g, 'HopCode'],
  [/QWEN_CODE_HOME/g, 'HOPCODE_HOME'],
  [/QWEN_HOME/g, 'HOPCODE_HOME'],
  [/\.qwen\//g, '.hopcode/'],
  [/Copyright 2025 Google LLC/g, 'Copyright 2025 HopCode Team'],
  [/Copyright 2025 Qwen Team/g, 'Copyright 2025 HopCode Team'],
  [/Copyright 2026 Qwen Team/g, 'Copyright 2025 HopCode Team'],
  [/\[qwen-code\]/g, '[hopcode]'],
];

let totalChanges = 0;

for (const file of files) {
  let content = readFileSync(file, 'utf8');
  let fileChanges = 0;
  for (const [pattern, replacement] of replacements) {
    const matches = content.match(pattern);
    if (matches) {
      fileChanges += matches.length;
      content = content.replace(pattern, replacement);
    }
  }
  if (fileChanges > 0) {
    writeFileSync(file, content, 'utf8');
    console.log(`${file}: ${fileChanges} changes`);
    totalChanges += fileChanges;
  } else {
    console.log(`${file}: no changes needed`);
  }
}

console.log(`\nTotal changes: ${totalChanges}`);