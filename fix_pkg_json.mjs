import { readFileSync, writeFileSync } from 'fs';

let c = readFileSync('package.json', 'utf8');

// Rebranding
c = c.replace(/"@qwen-code\/qwen-code"/g, '"@hoptrendy/hopcode"');
c = c.replace(/"qwen": "dist\/cli\.js"/g, '"hopcode": "dist/cli.js"');
c = c.replace(/QWEN_SANDBOX/g, 'HOPCODE_SANDBOX');
c = c.replace(/QwenLM\/qwen-code/g, 'Hoptrendy/hopcode');
c = c.replace(/ghcr\.io\/qwenlm\/qwen-code/g, 'ghcr.io/hoptrendy/hopcode');

// Upgrades: keep our newer versions
c = c.replace('"ink": "^6.2.3"', '"ink": "^6.8.0"');
c = c.replace('"simple-git": "^3.28.0"', '"simple-git": "^3.29.0"');
c = c.replace('"esbuild": "^0.25.0"', '"esbuild": "^0.25.5"');
c = c.replace('"eslint": "^9.24.0"', '"eslint": "^9.26.0"');
c = c.replace('"prettier": "^3.5.3"', '"prettier": "^3.6.0"');
c = c.replace('"semver": "^7.7.2"', '"semver": "^7.7.4"');
c = c.replace('"react-devtools-core": "^6.1.5"', '"react-devtools-core": "^7.0.1"');

// Add our local overrides
c = c.replace(
  '"normalize-package-data": "^7.0.1"\n  }',
  '"normalize-package-data": "^7.0.1",\n    "brace-expansion@<1.1.13": "^1.1.13",\n    "esbuild": "^0.25.5"\n  }'
);

// Add our local dependencies
c = c.replace(
  '"@testing-library/dom": "^10.4.1",\n    "ink": "^6.8.0",\n    "simple-git": "^3.29.0"',
  '"@testing-library/dom": "^10.4.1",\n    "fuzzysort": "^3.1.0",\n    "ink": "^6.8.0",\n    "remeda": "^2.33.7",\n    "simple-git": "^3.29.0"'
);

// Add ink devDep at 6.8.0 and fuzzysort/remeda to devDeps section since they were there
c = c.replace(
  /"glob": "\^10\.5\.0"/,
  '"fuzzysort": "^3.1.0"'
);
c = c.replace(
  /"glob": "\^10\.5\.0"/g,
  '"glob": "^11.0.0"'
);
// Add remeda after memfs
c = c.replace(
  '"memfs": "^4.42.0",',
  '"memfs": "^4.42.0",\n    "remeda": "^2.33.7",'
);

writeFileSync('package.json', c, 'utf8');
console.log('Done');