import { readFileSync, writeFileSync } from 'fs';

let c = readFileSync('packages/cli/src/ui/utils/TableRenderer.test.tsx', 'utf8');

// Rebrand test fixtures - but NOT "Claude Code" which is a different product
c = c.replace(/Qwen Code/g, 'HopCode');
// Rebrand [Qwen](...) link in test
c = c.replace(/\[Qwen\]\(/g, '[HopCode](');

writeFileSync('packages/cli/src/ui/utils/TableRenderer.test.tsx', c, 'utf8');
console.log('Done');