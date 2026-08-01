#!/usr/bin/env node
/**
 * Script to add .js extensions to relative imports in TypeScript files
 * Fixes ES module import requirements
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const PROVIDER_DIR = new URL('../src/provider', import.meta.url).pathname;

function addJsExtensions(filePath) {
  let content = readFileSync(filePath, 'utf-8');
  const original = content;

  // Add .js extensions to relative imports
  // Match: from "../something" or from './something'
  content = content.replace(/(from\s+['"]\.{1,2}\/[^'"]+)(['"])/g, '$1.js$2');

  // Match: import "..." for relative paths
  content = content.replace(/(import\s+['"]\.{1,2}\/[^'"]+)(['"])/g, '$1.js$2');

  if (content !== original) {
    writeFileSync(filePath, content, 'utf-8');
    console.log(`✓ Fixed: ${filePath}`);
  }
}

function walkDir(dir) {
  const files = readdirSync(dir);

  for (const file of files) {
    const filePath = join(dir, file);
    const stat = statSync(filePath);

    if (stat.isDirectory()) {
      walkDir(filePath);
    } else if (file.endsWith('.ts') && !file.endsWith('.d.ts')) {
      addJsExtensions(filePath);
    }
  }
}

console.log('Adding .js extensions to imports...');
walkDir(PROVIDER_DIR);
console.log('Done!');
