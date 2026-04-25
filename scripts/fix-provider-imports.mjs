#!/usr/bin/env node
/**
 * Quick fix script for remaining provider import issues
 * Fixes common TypeScript/ES module problems
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const PROVIDER_DIR = join(process.cwd(), 'packages', 'core', 'src', 'provider');

function fixFile(filePath) {
  let content = readFileSync(filePath, 'utf-8');
  const _original = content;
  let changed = false;

  // Fix @/ imports to relative paths
  if (content.includes('@/')) {
    content = content.replace(/@\/util\//g, '../util/');
    content = content.replace(/@\/flag\//g, '../flag/');
    content = content.replace(/@\/project\//g, '../project/');
    content = content.replace(/@\/auth/g, '../auth');
    changed = true;
  }

  // Fix missing .js extensions on relative imports
  const relativeImportRegex = /(from\s+['"]\.{1,2}\/[^'"]+)(['"])/g;
  if (relativeImportRegex.test(content)) {
    content = content.replace(relativeImportRegex, '$1.js$2');
    changed = true;
  }

  // Fix OpenCode-specific imports to HopCode
  if (content.includes('@opencode-ai/')) {
    content = content.replace(/@opencode-ai\/util\/error/g, '../util/error');
    content = content.replace(/@opencode-ai\/plugin/g, '../plugin');
    changed = true;
  }

  if (changed) {
    writeFileSync(filePath, content, 'utf-8');
    console.log(`✓ Fixed: ${filePath}`);
    return true;
  }
  return false;
}

function walkDir(dir) {
  const files = readdirSync(dir);
  let fixedCount = 0;

  for (const file of files) {
    const filePath = join(dir, file);
    const stat = statSync(filePath);

    if (stat.isDirectory()) {
      fixedCount += walkDir(filePath);
    } else if (
      file.endsWith('.ts') &&
      !file.endsWith('.d.ts') &&
      !file.endsWith('.test.ts')
    ) {
      if (fixFile(filePath)) fixedCount++;
    }
  }

  return fixedCount;
}

console.log('Fixing provider import issues...');
const fixed = walkDir(PROVIDER_DIR);
console.log(`Done! Fixed ${fixed} files.`);
