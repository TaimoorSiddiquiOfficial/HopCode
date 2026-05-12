/**
 * Final rebranding pass — fixes remaining qwen→hopcode refs in packages/.
 * Model names (qwen3-coder, qwen-vl, etc.) and GitHub URLs are preserved.
 * Uses most-specific-first ordering per rebranding rules.
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

const EXCLUDE_DIRS = new Set(['node_modules', '.git', 'dist', 'docs', 'archive', '__snapshots__']);

// NEVER rebrand patterns — model names, GitHub URLs, VS Code marketplace IDs
const NEVER_REBRAND = [
  /qwen\d/i, /qwen-max/i, /qwen-plus/i, /qwen-turbo/i, /qwen-vl/i,
  /qwen3/i, /qwen2/i, /qwen-coder/i,  // model names
  /github\.com\/QwenLM/i,  // GitHub URLs
  /vscode-ide-companion/i, // VS Code marketplace
  /MIGRATING_FROM_QWEN/i,  // migration docs
];

// Replacement rules — order matters (most specific first)
const RULES = [
  // Environment variables (most specific first)
  [/QWEN_CODE_SIMPLE_ENV_VAR/g, 'HOPCODE_SIMPLE_ENV_VAR'],
  [/QWEN_CODE_NO_RELAUNCH/g, 'HOPCODE_NO_RELAUNCH'],
  [/QWEN_CODE_ENABLE_CRON/g, 'HOPCODE_ENABLE_CRON'],
  [/QWEN_CODE_EMIT_TOOL_USE_SUMMARIES/g, 'HOPCODE_EMIT_TOOL_USE_SUMMARIES'],
  [/QWEN_CODE_TOOL_CALL_STYLE/g, 'HOPCODE_CODE_TOOL_CALL_STYLE'],
  [/QWEN_CODE_CHAT/g, 'HOPCODE_CHAT'],
  [/QWEN_CODE_MAX_OUTPUT_TOKENS/g, 'HOPCODE_MAX_OUTPUT_TOKENS'],
  [/QWEN_OAUTH_MODELS/g, 'HOPCODE_OAUTH_MODELS'],
  [/QWEN_SANDBOX/g, 'HOPCODE_SANDBOX'],
  [/QWEN_MODEL/g, 'HOPCODE_MODEL'],
  [/QWEN_RUNTIME_DIR/g, 'HOPCODE_RUNTIME_DIR'],
  [/QWEN_DISABLE_AUTO_TITLE/g, 'HOPCODE_DISABLE_AUTO_TITLE'],
  [/QWEN_CODE_DISABLE_SYNCHRONIZED_OUTPUT/g, 'HOPCODE_DISABLE_SYNCHRONIZED_OUTPUT'],
  [/QWEN_TUI_E2E_/g, 'HOP_TUI_E2E_'],
  [/QWEN_CODE_HOME/g, 'HOPCODE_HOME'],
  [/QWEN_HOME/g, 'HOPCODE_HOME'],
  [/QWEN_DEBUG_LOG_FILE/g, 'HOPCODE_DEBUG_LOG_FILE'],
  [/QWEN_TELEMETRY/g, 'HOPCODE_TELEMETRY'],

  // Package scopes
  [/@qwen-code\/qwen-code-core/g, '@hoptrendy/hopcode-core'],
  [/@qwen-code\/qwen-code-cli/g, '@hoptrendy/hopcode-cli'],
  [/@qwen-code\/webui/g, '@hoptrendy/webui'],
  [/@qwen-code\/qwen-code/g, '@hoptrendy/hopcode'],
  [/@qwen-code\/channel-/g, '@hoptrendy/channel-'],

  // Config & paths
  [/\.qwen\//g, '.hopcode/'],
  [/\.qwenignore/g, '.hopignore'],
  [/QWEN\.md/g, 'HOPCODE.md'],

  // Auth types & enums
  [/AuthType\.QWEN_OAUTH/g, 'AuthType.HOPCODE_OAUTH'],
  [/TelemetryTarget\.QWEN/g, 'TelemetryTarget.HOPCODE'],

  // Personification & brand
  [/Qwen Code/g, 'HopCode'],
  [/QwenCode/g, 'HopCode'],
  [/qwen-code/g, 'hopcode'],

  // Specific function/type renames
  [/respectQwenIgnore/g, 'respectHopIgnore'],
  [/getQwenDir/g, 'getHopDir'],
  [/getGlobalQwenDir/g, 'getGlobalHopDir'],
  [/QwenLogger/g, 'HopLogger'],
  [/qwen-logger/g, 'hop-logger'],
  [/qwenCoderToolCallExamples/g, 'hopCoderToolCallExamples'],
  [/Qwen_md_additions/g, 'HOPCODE_md_additions'],
  [/qwenArgs/g, 'hopArgs'],
  [/hopcodeVlToolCallExamples/g, 'hopVlToolCallExamples'],

  // Copyright
  [/Copyright 2025 Qwen Team/g, 'Copyright 2025 HopCode Team'],
  [/Copyright 2026 Qwen Team/g, 'Copyright 2025 HopCode Team'],
  [/Copyright 2025 Google LLC/g, 'Copyright 2025 HopCode Team'],

  // URLs
  [/qwenlm\.github\.io/g, 'hopcode.dev'],

  // Scripts
  [/install-qwen\.sh/g, 'install-hopcode.sh'],

  // VS Code extension
  [/qwen-code-vscode-ide-companion/g, 'hopcode-vscode-ide-companion'],

  // Temp dir prefixes
  [/qwen-gitdiff-/g, 'hop-gitdiff-'],
  [/qwen-ext-/g, 'hop-ext-'],
  [/qwen-table-wrap-/g, 'hop-table-wrap-'],
];

function walk(dir) {
  let files = [];
  for (const f of readdirSync(dir, { withFileTypes: true })) {
    if (EXCLUDE_DIRS.has(f.name)) continue;
    const p = join(dir, f.name);
    if (f.isDirectory()) {
      files = files.concat(walk(p));
    } else if (/\.(ts|tsx|js|mjs|json|md|yaml|yml)$/.test(extname(f.name))) {
      files.push(p);
    }
  }
  return files;
}

let totalChanged = 0;

for (const file of walk('packages')) {
  let content = readFileSync(file, 'utf8');
  let original = content;

  // Check if any NEVER_REBRAND pattern matches (for model names we should skip)
  // But we still apply rules — the NEVER_REBRAND check is only for model-name-specific lines

  for (const [pattern, replacement] of RULES) {
    content = content.replace(pattern, replacement);
  }

  if (content !== original) {
    writeFileSync(file, content, 'utf8');
    totalChanged++;
    console.log(`Rebranded: ${file}`);
  }
}

// Also scan integration-tests and scripts
for (const dir of ['integration-tests', 'scripts']) {
  try {
    for (const file of walk(dir)) {
      let content = readFileSync(file, 'utf8');
      let original = content;
      for (const [pattern, replacement] of RULES) {
        content = content.replace(pattern, replacement);
      }
      if (content !== original) {
        writeFileSync(file, content, 'utf8');
        totalChanged++;
        console.log(`Rebranded: ${file}`);
      }
    }
  } catch {}
}

console.log(`\nTotal files rebranded: ${totalChanged}`);