import { readFileSync } from 'fs';

const files = [
  'packages/cli/src/config/config.ts',
  'packages/core/src/core/prompts.test.ts',
  'packages/core/src/core/prompts.ts',
];

const modelNamesToKeep = [
  'qwen-max', 'qwen-plus', 'qwen-turbo', 'qwen3', 'qwen3.6-plus',
  'Qwen3-Coder', 'Qwen3', 'qwen-long', 'qwen-vl', 'qwen2',
  'qwen-oauth', // auth provider name - keep?
];

for (const file of files) {
  const content = readFileSync(file, 'utf8');
  const lines = content.split('\n');
  console.log(`\n=== ${file} ===`);
  lines.forEach((line, i) => {
    if (/qwen/i.test(line)) {
      console.log(`${i + 1}: ${line.trimEnd()}`);
    }
  });
}