import { readFileSync, writeFileSync } from 'fs';

// Extended rebranding rules - SECOND PASS for patterns missed in first pass
// ORDER MATTERS: most specific first
const replacements = [
  // Environment variables missed
  [/QWEN_CODE_HOME/g, 'HOPCODE_HOME'],
  [/QWEN_CODE_SIMPLE_ENV_VAR/g, 'HOPCODE_SIMPLE_ENV_VAR'],
  [/QWEN_CODE_NO_RELAUNCH/g, 'HOPCODE_NO_RELAUNCH'],
  [/QWEN_CODE_ENABLE_CRON/g, 'HOPCODE_ENABLE_CRON'],
  [/QWEN_CODE_EMIT_TOOL_USE_SUMMARIES/g, 'HOPCODE_EMIT_TOOL_USE_SUMMARIES'],
  [/QWEN_CODE_FORCE_MCP_TOOL_CALLING/g, 'HOPCODE_FORCE_MCP_TOOL_CALLING'],
  [/QWEN_DEBUG_LOG_FILE/g, 'HOPCODE_DEBUG_LOG_FILE'],
  [/QWEN_DISABLED_SLASH_COMMANDS/g, 'HOPCODE_DISABLED_SLASH_COMMANDS'],

  // Auth types
  [/AuthType\.QWEN_OAUTH/g, 'AuthType.HOP_OAUTH'],
  [/AuthType\.QWEN_API_KEY/g, 'AuthType.HOP_API_KEY'],

  // Config field names (camelCase)
  [/respectQwenIgnore/g, 'respectHopIgnore'],

  // Model config references
  [/QWEN_OAUTH/g, 'HOP_OAUTH'],

  // CLI invocation
  [/\bqwen\s+-p\b/g, 'hopcode -p'],
  [/\bqwen\b/g, 'hopcode'],

  // Comments with QWEN_ env vars
  [/QWEN_/g, 'HOPCODE_'],

  // File path references in imports (qwen-logger.js etc.)
  [/qwen-logger\/qwen-logger\.js/g, 'hop-logger/hop-logger.js'],

  // Brand in comments/strings
  [/Qwen-Coder/g, 'HopCode-Coder'],
  [/Qwen OAuth/g, 'HopCode OAuth'],

  // .qwenignore file references
  [/\.qwenignore/g, '.hopignore'],
  [/qwenignore/gi, 'hopignore'],
];

// DO NOT rebrand: model names like qwen-max, qwen-plus, qwen-turbo, qwen3, etc.
// These are AI model identifiers, not brand references.
// Also DO NOT rebrand: GitHub URLs, VS Code marketplace IDs

const files = [
  'integration-tests/cli/json-schema.test.ts',
  'integration-tests/cli/tool-search.test.ts',
  'packages/cli/src/config/config.ts',
  'packages/cli/src/config/jsonSchemaArg.test.ts',
  'packages/cli/src/gemini.tsx',
  'packages/cli/src/nonInteractiveCli.test.ts',
  'packages/cli/src/nonInteractiveCli.ts',
  'packages/cli/src/ui/commands/contextCommand.test.ts',
  'packages/core/src/config/config.ts',
  'packages/core/src/core/prompts.test.ts',
  'packages/core/src/core/prompts.ts',
  'packages/core/src/index.ts',
  'packages/core/src/tools/askUserQuestion.ts',
  'packages/core/src/tools/syntheticOutput.test.ts',
  'packages/core/src/tools/syntheticOutput.ts',
  'packages/core/src/tools/tool-names.ts',
  'packages/core/src/tools/tool-search.test.ts',
  'packages/core/src/tools/tool-search.ts',
  'packages/core/src/utils/schemaValidator.ts',
];

// Model names to preserve - these should NOT be rebranded
const modelNames = [
  'qwen-max', 'qwen-plus', 'qwen-turbo', 'qwen3', 'qwen3.6-plus',
  'Qwen3-Coder', 'Qwen3', 'qwen-long', 'qwen-vl', 'qwen2',
];

function protectModelNames(content) {
  // Replace model names with placeholders before rebranding, restore after
  const placeholders = {};
  let i = 0;
  for (const model of modelNames) {
    const placeholder = `__MODEL_PLACEHOLDER_${i}__`;
    placeholders[placeholder] = model;
    content = content.replaceAll(model, placeholder);
    i++;
  }
  return { content, placeholders };
}

function restoreModelNames(content, placeholders) {
  for (const [placeholder, model] of Object.entries(placeholders)) {
    content = content.replaceAll(placeholder, model);
  }
  return content;
}

let totalChanges = 0;
for (const file of files) {
  let content = readFileSync(file, 'utf8');
  
  // Protect model names first
  const { content: protectedContent, placeholders } = protectModelNames(content);
  content = protectedContent;

  // Apply rebranding
  for (const [pattern, replacement] of replacements) {
    content = content.replace(pattern, replacement);
  }

  // Restore model names
  content = restoreModelNames(content, placeholders);

  // Compare
  const origContent = readFileSync(file, 'utf8');
  if (content !== origContent) {
    const origLines = origContent.split('\n');
    const newLines = content.split('\n');
    let lineChanges = 0;
    for (let i = 0; i < Math.max(origLines.length, newLines.length); i++) {
      if (origLines[i] !== newLines[i]) lineChanges++;
    }
    writeFileSync(file, content, 'utf8');
    console.log(`${file}: ${lineChanges} lines changed`);
    totalChanges += lineChanges;
  } else {
    console.log(`${file}: no changes`);
  }
}
console.log(`\nTotal: ${totalChanges} lines changed`);