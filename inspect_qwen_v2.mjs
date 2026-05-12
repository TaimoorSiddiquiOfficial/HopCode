import { readFileSync } from 'fs';

for (const f of ['packages/core/src/core/prompts.ts', 'packages/core/src/core/prompts.test.ts']) {
  const c = readFileSync(f, 'utf8');
  const lines = c.split('\n');
  console.log(`\n=== ${f} ===`);
  lines.forEach((line, i) => {
    if (/qwen/i.test(line)) {
      console.log(`${i + 1}: ${line.trimEnd()}`);
    }
  });
}