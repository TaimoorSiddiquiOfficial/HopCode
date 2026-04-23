/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { execSync } from 'node:child_process';
import lintStaged from 'lint-staged';

// Directories to exclude from pre-commit validation
const EXCLUDE_PATTERNS = [
  'node_modules',
  '.vscode/extensions',
  '.bun',
  '.cache',
  'AppData',
  'Application Data',
  'Local Settings',
  '.hopcode-backup-',
  '.wallaby',
  '.console-ninja',
  '.quokka',
  '.nsight-copilot',
  'ntuser.dat',
  'NTUSER.DAT',
  'OneDrive',
  '.npm',
  '.vscode-oss-dev',
  '.hopcoder-editor-dev',
  'integration-tests/concurrent-runner/examples',
  'integration-tests/terminal-capture',
  'docs-site',
];

try {
  // Get repository root
  const root = execSync('git rev-parse --show-toplevel').toString().trim();

  // Get staged files and filter out excluded patterns
  const stagedFiles = execSync('git diff --cached --name-only').toString().trim().split('\n').filter(Boolean);
  
  // Filter out files in excluded directories
  const filteredFiles = stagedFiles.filter(file => {
    return !EXCLUDE_PATTERNS.some(pattern => file.includes(pattern));
  });

  // If no files left after filtering, skip lint-staged
  if (filteredFiles.length === 0) {
    console.log('No files to lint after filtering excluded patterns.');
    process.exit(0);
  }

  // Run lint-staged with API directly
  const passed = await lintStaged({ 
    cwd: root,
    files: filteredFiles,
  });

  // Exit with appropriate code
  process.exit(passed ? 0 : 1);
} catch (error) {
  console.error('Pre-commit check failed:', error.message);
  process.exit(1);
}
