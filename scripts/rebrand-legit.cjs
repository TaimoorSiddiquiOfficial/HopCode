// Scope-limited rebrand on the CURRENT fork tree.
// Applies ONLY the package-name/scope rebrand (the user's actual complaint):
//   1. package scope  @qwen-code/ or @qwen-code\/  -> @hoptrendy/
//   2. package name   @hoptrendy/qwen-code-core     -> @hoptrendy/hopcode-core
//                  @hoptrendy/qwen-code         -> @hoptrendy/hopcode
//                  qwen-code-vscode-ide-companion -> hopcode-vscode-ide-companion
//   3. CLI bin        "qwen":                  -> "hopcode":  (package.json only)
// DELIBERATELY SKIPS internal-identifier renames (qwenCode->hopcodeCode, QwenCode->HopCode)
// and approval-mode renames (YOLO->IZN) which are out of scope / already partially committed.
const fs = require('fs');
const path = require('path');

const ROOT = 'D:\\HopCode';
const EXCLUDE_DIRS = new Set(['node_modules', 'dist', '.git', '.qwen', 'coverage']);
const SELF_SKIP = path.resolve(ROOT, 'scripts', 'rebrand-legit.cjs');
const BINARY_EXT = new Set([
  '.png', '.jpg', '.jpeg', '.gif', '.ico', '.woff', '.woff2', '.ttf',
  '.eot', '.mp4', '.webm', '.pdf', '.zip', '.gz', '.exe', '.dll', '.so', '.dylib',
]);

function walk(dir, out) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (EXCLUDE_DIRS.has(ent.name)) continue;
      walk(p, out);
    } else {
      if (p === SELF_SKIP) continue;
      const ext = path.extname(ent.name).toLowerCase();
      if (BINARY_EXT.has(ext)) continue;
      out.push(p);
    }
  }
  return out;
}

function applyLegit(file, text) {
  const isPkg = path.basename(file) === 'package.json';
  // Match @qwen-code/ (literal) and @qwen-code\/ (escaped, as in regex literals).
  let out = text.replace(/@qwen-code(?:\\\/|\/)/gu, '@hoptrendy/');
  out = out.replace(/@hoptrendy\/qwen-code-core/gu, '@hoptrendy/hopcode-core');
  out = out.replace(/@hoptrendy\/qwen-code\b/gu, '@hoptrendy/hopcode');
  out = out.replace(/qwen-code-vscode-ide-companion/gu, 'hopcode-vscode-ide-companion');
  if (isPkg) out = out.replace(/"qwen":/gu, '"hopcode":');
  return out;
}

const files = walk(ROOT, []);
let changed = 0;
for (const f of files) {
  let text;
  try { text = fs.readFileSync(f, 'utf8'); } catch { continue; }
  const next = applyLegit(f, text);
  if (next !== text) {
    fs.writeFileSync(f, next);
    changed++;
  }
}
console.log('Legit rebrand applied to', changed, 'files');
