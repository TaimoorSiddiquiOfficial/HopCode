#!/usr/bin/env node
// Fix copyright headers in cherry-picked auto-merged files
// Replaces "Copyright 2025 Google LLC" -> "Copyright 2025 HopCode Team"
// and "Copyright 2025 Qwen" / "Copyright 2025 Qwen Team" -> "Copyright 2025 HopCode Team"

import { readFileSync, writeFileSync } from 'fs';

const files = [
  'packages/cli/src/ui/AppContainer.tsx',
  'packages/cli/src/ui/commands/mcpCommand.ts',
  'packages/cli/src/ui/commands/memoryCommand.ts',
  'packages/cli/src/ui/commands/statsCommand.ts',
  'packages/cli/src/ui/components/Composer.tsx',
  'packages/cli/src/ui/components/DialogManager.tsx',
  'packages/cli/src/ui/components/InputPrompt.test.tsx',
  'packages/cli/src/ui/components/InputPrompt.tsx',
  'packages/cli/src/ui/components/SuggestionsDisplay.tsx',
  'packages/cli/src/ui/contexts/UIActionsContext.tsx',
  'packages/cli/src/ui/contexts/UIStateContext.tsx',
  'packages/cli/src/ui/hooks/slashCommandProcessor.ts',
  'packages/cli/src/ui/hooks/useCommandCompletion.test.ts',
  'packages/cli/src/ui/hooks/useDialogClose.ts',
  'packages/cli/src/ui/utils/commandUtils.ts',
  'packages/cli/src/ui/utils/commandUtils.test.ts',
  'packages/cli/src/ui/utils/highlight.ts',
  'packages/cli/src/ui/utils/highlight.test.ts',
];

let totalFixed = 0;

for (const file of files) {
  let content = readFileSync(file, 'utf8');
  const original = content;
  
  content = content.replace(/Copyright 2025 Google LLC/g, 'Copyright 2025 HopCode Team');
  content = content.replace(/Copyright 2025 Qwen Team/g, 'Copyright 2025 HopCode Team');
  content = content.replace(/Copyright 2025 Qwen\b/g, 'Copyright 2025 HopCode Team');
  
  if (content !== original) {
    writeFileSync(file, content, 'utf8');
    totalFixed++;
    console.log(`✓ Fixed ${file}`);
  } else {
    console.log(`  No changes needed: ${file}`);
  }
}

console.log(`\nFixed ${totalFixed} files`);