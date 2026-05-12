import { readFileSync, writeFileSync } from 'fs';

let c = readFileSync('package-lock.json', 'utf8');

// Rebrand VS Code companion package
c = c.replace(/qwen-code-vscode-ide-companion/g, 'hopcode-vscode-ide-companion');

writeFileSync('package-lock.json', c, 'utf8');
console.log('Done');