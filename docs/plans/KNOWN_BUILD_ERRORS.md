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

  Function task should contain `title` and `task` fields, where `title` should be a string and `task` should be a function.
```

### Location
- **File**: `package.json` → `lint-staged` configuration
- **Also affects**: Multiple cached package.json files in `.bun/`, `.vscode/extensions/`

### Root Cause
The lint-staged configuration uses the old format. Newer versions of lint-staged require tasks to be objects with `title` and `task` fields, or functions.

### Current Configuration (Broken)
```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "prettier --write",
      "eslint --fix --max-warnings 0 --no-warn-ignored"
    ],
    "*.{json,md}": [
      "prettier --write"
    ]
  }
}
```

### Fix
Update to new format:
```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      {
        "title": "Format with Prettier",
        "task": "prettier --write"
      },
      {
        "title": "Fix ESLint issues",
        "task": "eslint --fix --max-warnings 0 --no-warn-ignored"
      }
    ],
    "*.{json,md}": [
      {
        "title": "Format with Prettier",
        "task": "prettier --write"
      }
    ]
  }
}
```

### Priority
**Medium** - Blocks pre-commit hook but can be bypassed with `--no-verify`

### Files to Fix
- `package.json` (root)

---

## 2. ESLint: Windows System Directory Permission Errors

### Error Message
```
Error: EPERM: operation not permitted, scandir 'C:\Users\Taimoor\AppData\Local\ElevatedDiagnostics'
```

### Location
- **Command**: `npm run lint` (root)
- **OS**: Windows only

### Root Cause
ESLint v9's new flat config tries to scan directories that require elevated permissions on Windows.

### Workaround (Current)
```bash
# Lint specific directories instead of root
npx eslint packages/core/src packages/cli/src --ext .ts,.tsx
```

### Fix
Update `.eslintignore` to exclude Windows system directories:

```
# .eslintignore
**/node_modules/**
**/dist/**
**/build/**
**/.git/**
**/coverage/**

# Windows system directories
Application Data/
Cookies/
Local Settings/
My Documents/
NetHood/
PrintHood/
Recent/
SendTo/
Start Menu/
Templates/
Saved Games/
```

### Priority
**Low** - Has workaround, doesn't affect CI (Linux-based)

### Files to Fix
- `.eslintignore` (add Windows exclusions)
- `scripts/lint.js` (optional: add Windows-specific handling)

---

## 3. Pre-commit Hook: Failed to Read Extension package.json Files

### Error Message
```
✖ Failed to read config from file "C:/Users/Taimoor/.vscode/extensions/ms-vscode.cpptools-1.31.5-win32-x64/.yarn-bootstrap/package.json".
✖ Failed to read config from file "C:/Users/Taimoor/.vscode/extensions/wallabyjs.wallaby-vscode-1.0.495/wallaby409189/package.json".
... (100+ similar errors)
```

### Location
- **Script**: `scripts/pre-commit.js`
- **Affected**: VS Code extensions, temporary directories, backup directories

### Root Cause
The pre-commit script tries to validate all package.json files it can find, including:
- VS Code extension internals
- Temporary build artifacts
- Backup directories
- Cache directories

### Fix
Update `scripts/pre-commit.js` to exclude problematic directories:

```javascript
const EXCLUDE_DIRS = [
  'node_modules',
  '.vscode/extensions',
  '.bun',
  '.cache',
  'AppData',
  'Application Data',
  'Local Settings',
  '.hopcode-backup-*',
  '.wallaby',
  '.console-ninja',
  '.quokka',
  '.nsight-copilot',
  'ntuser.dat*',
  'NTUSER.DAT*',
];

// Add filtering logic to skip these directories
```

### Priority
**Medium** - Causes noise in pre-commit output, requires `--no-verify` workaround

### Files to Fix
- `scripts/pre-commit.js` (add directory filtering)

---

## 4. Pre-existing Test Failure: hopcode-server Package

### Error Message
```
FAIL  packages/cli/src/config/config.test.ts
Error: Failed to resolve entry for package "@hoptrendy/hopcode-server"
```

### Location
- **File**: `packages/cli/src/config/config.test.ts`
- **Package**: `@hoptrendy/hopcode-server`

### Root Cause
The `@hoptrendy/hopcode-server` package doesn't have a proper `exports` field in its package.json, or the main/module fields are incorrect.

### Investigation Steps
1. Check `packages/server/package.json` for correct `main` and `exports` fields
2. Verify the package is built correctly
3. Check if the package is published or workspace-only

### Fix (TBD)
Likely need to update `packages/server/package.json`:
```json
{
  "main": "./dist/index.js",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    }
  }
}
```

### Priority
**Medium** - Breaks CLI config tests, but core tests pass

### Files to Fix
- `packages/server/package.json` (add/fix exports)
- `packages/cli/src/config/config.test.ts` (update import if needed)

---

## 5. TypeScript Build Status File

### Observation
File `tsconfig.tsbuildinfo` is tracked in git but should be ignored.

### Fix
Add to `.gitignore`:
```
# TypeScript
**/*.tsbuildinfo
```

### Priority
**Low** - Cosmetic, doesn't affect builds

### Files to Fix
- `.gitignore` (add tsbuildinfo)

---

## Summary

| Issue | Priority | Workaround | Files to Fix |
|-------|----------|------------|--------------|
| 1. Lint-staged config | Medium | `--no-verify` | `package.json` |
| 2. ESLint Windows perms | Low | Lint specific dirs | `.eslintignore` |
| 3. Pre-commit validation | Medium | `--no-verify` | `scripts/pre-commit.js` |
| 4. hopcode-server test | Medium | Skip test file | `packages/server/package.json` |
| 5. tsbuildinfo in git | Low | None needed | `.gitignore` |

---

## Action Plan for Phase 4

### Week 9: Build System Fixes
1. ✅ Fix lint-staged configuration (Issue #1)
2. ✅ Update .eslintignore for Windows (Issue #2)
3. ✅ Fix pre-commit script filtering (Issue #3)
4. ✅ Add tsbuildinfo to .gitignore (Issue #5)

### Week 10: Test & Stability
1. ✅ Fix hopcode-server package exports (Issue #4)
2. ✅ Run full test suite
3. ✅ Verify all builds pass
4. ✅ Document remaining issues

---

**Last Updated**: 2026-04-24  
**Status**: Ready for Phase 4 implementation
