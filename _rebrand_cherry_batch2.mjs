#!/usr/bin/env node
/**
 * Rebrand cherry-picked files for batch 2 (model stats, narrow terminals, table ANSI, tilde expansion)
 * Handles qwen → hopcode rebranding in the newly added files.
 */
import { readFileSync, writeFileSync, renameSync, mkdirSync, existsSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';

const REBRAND_RULES = [
  // Most specific first
  [/\bQWEN_CODE_DISABLE_SYNCHRONIZED_OUTPUT\b/g, 'HOPCODE_DISABLE_SYNCHRONIZED_OUTPUT'],
  [/\bQWEN_CODE_NO_RELAUNCH\b/g, 'HOPCODE_NO_RELAUNCH'],
  [/\bQWEN_SANDBOX\b/g, 'HOPCODE_SANDBOX'],
  [/\bQWEN_CODE_SIMPLE_ENV_VAR\b/g, 'HOPCODE_SIMPLE_ENV_VAR'],
  [/\bQWEN_CODE_SIMPLE\b/g, 'HOPCODE_SIMPLE'],
  [/Copyright 2026 Qwen Team/g, 'Copyright 2025 HopCode Team'],
  [/qwenArgs/g, 'hopArgs'],
  [/qwen-table-wrap-ansi/g, 'hop-table-wrap-ansi'],
  [/QWEN_TUI_E2E_REPO/g, 'HOP_TUI_E2E_REPO'],
  [/QWEN_TUI_E2E_OUT/g, 'HOP_TUI_E2E_OUT'],
  [/QWEN_TUI_E2E_EXPECT_PASS/g, 'HOP_TUI_E2E_EXPECT_PASS'],
  [/@qwen-code\//g, '@hoptrendy/'],
  [/qwen-code/g, 'hopcode'],
  [/QwenCode/g, 'HopCode'],
];

const filesToRebrand = [
  'integration-tests/terminal-capture/table-inline-code-wrap-regression.ts',
];

for (const file of filesToRebrand) {
  try {
    let content = readFileSync(file, 'utf8');
    let changed = false;
    for (const [pattern, replacement] of REBRAND_RULES) {
      const before = content;
      content = content.replace(pattern, replacement);
      if (content !== before) changed = true;
    }
    if (changed) {
      writeFileSync(file, content, 'utf8');
      console.log(`Rebranded: ${file}`);
    } else {
      console.log(`No changes: ${file}`);
    }
  } catch (e) {
    console.error(`Error processing ${file}: ${e.message}`);
  }
}

// Move .qwen/e2e-tests/ → .hopcode/e2e-tests/
const srcDir = '.qwen/e2e-tests';
const dstDir = '.hopcode/e2e-tests';
const mdFile = 'table-wrap-ansi-highlight.md';

if (existsSync(join(srcDir, mdFile))) {
  if (!existsSync(dstDir)) {
    mkdirSync(dstDir, { recursive: true });
  }
  // Read, potentially rebrand, and write to new location
  let content = readFileSync(join(srcDir, mdFile), 'utf8');
  // Check for qwen refs in md file
  if (/qwen/i.test(content) && !/qwen3|qwen-vl|QwenLM/.test(content)) {
    for (const [pattern, replacement] of REBRAND_RULES) {
      content = content.replace(pattern, replacement);
    }
  }
  writeFileSync(join(dstDir, mdFile), content, 'utf8');
  console.log(`Moved and rebranded: ${srcDir}/${mdFile} → ${dstDir}/${mdFile}`);
  
  // Remove old file from staging and disk
  try { rmSync(join(srcDir, mdFile)); } catch {}
  // Try to remove empty parent dirs
  try { rmSync(srcDir, { recursive: true }); } catch {}
  try { rmSync('.qwen', { recursive: true }); } catch {}
}

console.log('Done.');