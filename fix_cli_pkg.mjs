import { readFileSync, writeFileSync } from 'fs';

let c = readFileSync('packages/cli/package.json', 'utf8');

// Rebranding
c = c.replace(/"@qwen-code\/qwen-code"/g, '"@hoptrendy/hopcode-cli"');
c = c.replace(/"Qwen Code"/g, '"HopCode"');
c = c.replace(/QwenLM\/qwen-code/g, 'Hoptrendy/hopcode');
c = c.replace(/ghcr\.io\/qwenlm\/qwen-code/g, 'ghcr.io/hoptrendy/hopcode');
c = c.replace(/"qwen": "dist\/index\.js"/g, '"hopcode": "dist/index.js"');
c = c.replace(/"@qwen-code\/channel-base"/g, '"@hoptrendy/channel-base"');
c = c.replace(/"@qwen-code\/channel-dingtalk"/g, '"@hoptrendy/channel-dingtalk"');
c = c.replace(/"@qwen-code\/channel-telegram"/g, '"@hoptrendy/channel-telegram"');
c = c.replace(/"@qwen-code\/channel-weixin"/g, '"@hoptrendy/channel-weixin"');
c = c.replace(/"@qwen-code\/qwen-code-core"/g, '"@hoptrendy/hopcode-core"');
c = c.replace(/"@qwen-code\/web-templates"/g, '"@hoptrendy/web-templates"');

// Keep our newer @modelcontextprotocol/sdk
c = c.replace(/"@modelcontextprotocol\/sdk": "\^1\.25\.1"/g, '"@modelcontextprotocol/sdk": "^1.29.0"');

// Keep ink^6.8.0 not ^6.2.3 (our fork uses 6.8.x)
c = c.replace('"ink": "^6.2.3"', '"ink": "^6.8.0"');

// Keep our newer simple-git
c = c.replace('"simple-git": "^3.28.0"', '"simple-git": "^3.29.0"');

// Keep our newer typescript/vitest
c = c.replace('"typescript": "^5.3.3"', '"typescript": "^5.8.2"');
c = c.replace('"vitest": "^3.1.1"', '"vitest": "^3.2.4"');

// Keep our newer react types
c = c.replace('"@types/react": "^19.1.8"', '"@types/react": "^19.2.14"');
c = c.replace('"@types/react-dom": "^19.1.6"', '"@types/react-dom": "^19.2.3"');
c = c.replace('"@types/semver": "^7.7.0"', '"@types/semver": "^7.7.1"');
c = c.replace('"@types/yargs": "^17.0.32"', '"@types/yargs": "^17.0.33"');

// Keep react-dom ^19.1.0 (from revert, not pinned 19.2.4)
// This is fine for ink 6 compat

// Fix glob version
c = c.replace('"glob": "^10.5.0"', '"glob": "^11.0.0"');

writeFileSync('packages/cli/package.json', c, 'utf8');
console.log('Done');