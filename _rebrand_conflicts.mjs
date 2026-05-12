import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const baseDir = 'G:\\Hop Trendy\\HopCode';

const files = [
  'packages/core/src/utils/contextLengthError.test.ts',
  'packages/core/src/utils/contextLengthError.ts',
];

// Order matters — most specific first
const replacements = [
  ['@qwen-code/qwen-code-core', '@hoptrendy/hopcode-core'],
  ['@qwen-code/qwen-code-cli', '@hoptrendy/hopcode-cli'],
  ['@qwen-code/webui', '@hoptrendy/webui'],
  ['@qwen-code/qwen-code', '@hoptrendy/hopcode'],
  ['qwen-code', 'hopcode'],
  ['QwenCode', 'HopCode'],
  ['Qwen Code', 'HopCode'],
  ['QWEN_CODE_HOME', 'HOPCODE_HOME'],
  ['QWEN_HOME', 'HOPCODE_HOME'],
  ['.qwen/', '.hopcode/'],
  [/Copyright \d{4} Google LLC/g, 'Copyright 2025 HopCode Team'],
  [/Copyright \d{4} Qwen Team/g, 'Copyright 2025 HopCode Team'],
];

for (const relPath of files) {
  const absPath = join(baseDir, relPath);
  let content = readFileSync(absPath, 'utf8');
  for (const [pattern, replacement] of replacements) {
    if (pattern instanceof RegExp) {
      content = content.replaceAll(pattern, replacement);
    } else {
      content = content.replaceAll(pattern, replacement);
    }
  }
  writeFileSync(absPath, content, 'utf8');
  console.log(`Rebranded: ${relPath}`);
}