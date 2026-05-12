import { readFileSync, writeFileSync } from 'fs';

// Third pass: remaining patterns that need rebranding
// These are inside prompts, code variable names, and references
const replacements = [
  // Method names
  [/getQwenDir/g, 'getHopDir'],

  // Variable names for model-format tool call examples
  // These aren't model names themselves, they're variable names
  [/qwenCoderToolCallExamples/g, 'hopCoderToolCallExamples'],
  [/qwenVlToolCallExamples/g, 'hopVlToolCallExamples'],

  // Model family matchers in comments - these are describing patterns
  // e.g., "qwen3-coder" in comments describing model matching logic
  // Keep actual model names (qwen3-coder, qwen-vl, etc.) but rebrand brand references

  // QWEN.md → HOPCODE.md (the config file)
  [/QWEN\.md/g, 'HOPCODE.md'],

  // Personification: "Qwen" as the AI assistant
  [/Qwen's/g, "HopCode's"],
  [/Qwen decided/g, 'HopCode decided'],
  [/Qwen interpreted/g, 'HopCode interpreted'],
  [/Qwen spawns/g, 'HopCode spawns'],
  [/Qwen auto-invokes/g, 'HopCode auto-invokes'],
  [/Qwen to/g, 'HopCode to'],
  [/ask Qwen/g, 'ask HopCode'],
  [/ask "Qwen/g, 'ask "HopCode'],
  [/Connect Qwen/g, 'Connect HopCode'],
  [/Run Qwen/g, 'Run HopCode'],
  [/how Qwen/g, 'how HopCode'],
  [/work Qwen/g, 'work HopCode'],
  [/\bQwen\b/g, 'HopCode'],

  // Auth provider: qwen-oauth → hop-oauth
  [/qwen-oauth/g, 'hop-oauth'],

  // match qwen3-coder pattern comment - keep model name but clarify comment
  // (comments saying "same as qwen3-coder" are about model matching, keep model name)
  
  // "non-qwen providers" → "non-hop providers"
  [/Non-qwen/g, 'Non-hop'],
  [/non-qwen/g, 'non-hop'],
];

// Model names that MUST NOT be rebranded
const modelNames = [
  'qwen-max', 'qwen-plus', 'qwen-turbo', 'qwen3', 'qwen3.6-plus',
  'Qwen3-Coder', 'Qwen3', 'qwen-long', 'qwen-vl', 'qwen2',
  'qwen3-coder', 'qwen-vl-max', 'qwen-vl-plus',
  'qwen3-coder-7b', 'qwen3-coder-14b',
  // Also protect model references in pattern comments
  "qwen2.5-coder", "qwen2-vl", "qwen3-vl",
];

function protectModelNames(content) {
  const placeholders = {};
  let i = 0;
  for (const model of modelNames) {
    const placeholder = `__MODEL_PH_${i}__`;
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

const files = [
  'packages/cli/src/config/config.ts',
  'packages/core/src/core/prompts.test.ts',
  'packages/core/src/core/prompts.ts',
];

let totalChanges = 0;
for (const file of files) {
  let content = readFileSync(file, 'utf8');

  const { content: protectedContent, placeholders } = protectModelNames(content);
  content = protectedContent;

  for (const [pattern, replacement] of replacements) {
    content = content.replace(pattern, replacement);
  }

  content = restoreModelNames(content, placeholders);

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