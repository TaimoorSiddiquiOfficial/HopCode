# Known Build Errors for Later Fix

**Date**: 2026-04-24  
**Priority**: Phase 4 (Bug Fixes & Stability)

---

## 1. Pre-commit Hook: Lint-staged Configuration Error

### Error Message
```
✖ Validation Error:

  Invalid value for 'linters': {
  '*.{js,json,ts}': [ 'prettier --write', 'git add' ],
  '*.md': [ 'markdown-toc -i', 'prettier --write', 'git add' ]
}

  Function task should contain `title` and `task` fields.
```

### Fix Applied
Updated `package.json` lint-staged config to use new format:
```json
{
  "*.{js,jsx,ts,tsx}": [
    { "title": "Format with Prettier", "task": "prettier --write" },
    { "title": "Fix ESLint issues", "task": "eslint --fix" }
  ]
}
```

---

## 2. ESLint: Windows System Directory Permission Errors

### Error Message
```
Error: EPERM: operation not permitted, scandir 'C:\Users\...\AppData\Local\ElevatedDiagnostics'
```

### Fix Applied
Created `.eslintignore` with Windows system directory exclusions.

### Workaround
```bash
npx eslint packages/core/src packages/cli/src --ext .ts,.tsx
```

---

## 3. Pre-commit Hook: Noisy Extension Validation

### Error Message
```
✖ Failed to read config from file "C:/Users/.../.vscode/extensions/.../package.json".
```

### Fix Applied
Updated `scripts/pre-commit.js` to filter out excluded directories.

---

## 4. Pre-existing Test Failure: hopcode-server Package

### Error Message
```
FAIL  packages/cli/src/config/config.test.ts
Error: Failed to resolve entry for package "@hoptrendy/hopcode-server"
```

### Status
Pre-existing issue, unrelated to Phase 1-3 updates.
Track separately for Phase 4 fix.

---

**Last Updated**: 2026-04-24  
**Status**: Fixes applied, ready for commit
