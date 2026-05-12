import { readFileSync, writeFileSync } from 'fs';

const file = 'packages/core/src/utils/gitDiff.test.ts';

// Only replace temp dir prefixes (not model names)
const replacements = [
  [/qwen-gitdiff-test-/g, 'hop-gitdiff-test-'],
  [/qwen-plain-/g, 'hop-plain-'],
  [/qwen-gitdir-/g, 'hop-gitdir-'],
  [/qwen-gitmain-/g, 'hop-gitmain-'],
  [/qwen-gitdiff-tab-/g, 'hop-gitdiff-tab-'],
  [/qwen-gitdiff-mv-/g, 'hop-gitdiff-mv-'],
  [/qwen-gitdiff-nl-/g, 'hop-gitdiff-nl-'],
  [/qwen-gitdiff-sub-/g, 'hop-gitdiff-sub-'],
  [/qwen-gitdiff-fp-/g, 'hop-gitdiff-fp-'],
  [/qwen-gitdiff-ext-/g, 'hop-gitdiff-ext-'],
  [/qwen-gitdiff-tc-/g, 'hop-gitdiff-tc-'],
  [/qwen-gitdiff-lnk-/g, 'hop-gitdiff-lnk-'],
  [/qwen-ext-fired-/g, 'hop-ext-fired-'],
  [/qwen-tc-fired-/g, 'hop-tc-fired-'],
  [/qwen-outside-/g, 'hop-outside-'],
];

let content = readFileSync(file, 'utf8');
let totalChanges = 0;

for (const [pattern, replacement] of replacements) {
  const matches = content.match(pattern);
  if (matches) {
    totalChanges += matches.length;
    content = content.replace(pattern, replacement);
  }
}

writeFileSync(file, content, 'utf8');
console.log(`Test dir prefixes rebranded: ${totalChanges} changes`);