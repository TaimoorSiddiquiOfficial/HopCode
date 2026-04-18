# 🚀 HopCode - Build & Test Guide

**Status:** ✅ Ready to Build  
**Updated:** 2026-04-18

---

## ✅ Pre-Build Checklist

Before building, verify the rebranding was successful:

- [x] Package name: `@hopcode/hopcode` ✅
- [x] Repository URL: `TaimoorSiddiquiOfficial/HopCode` ✅
- [x] Sandbox image: `ghcr.io/TaimoorSiddiquiOfficial/HopCode` ✅
- [x] All workspaces configured ✅

---

## 🛠️ Build Commands

### Quick Start (Recommended)

```bash
cd D:\HopCode

# Install dependencies
npm install

# Build all components
npm run build:all

# Or build step by step (see below)
```

---

### Step-by-Step Build

#### 1. Install Dependencies

```bash
cd D:\HopCode
npm install
```

**What this does:**
- Installs all dependencies for root package
- Installs dependencies for all 14 workspaces
- Creates `node_modules/` directory

**Expected output:**
```
added XXX packages in XXs
```

---

#### 2. Generate Git Commit Info

```bash
npm run generate
```

**What this does:**
- Generates commit hash and build info
- Creates version files for branding

---

#### 3. Generate Settings Schema

```bash
npm run generate:settings-schema
```

**What this does:**
- Generates TypeScript types from settings
- Updates `settingsSchema.ts` with HopCode branding

---

#### 4. Build Core Packages

```bash
npm run build
```

**What this builds:**
- CLI package (`packages/cli/`)
- Core package (`packages/core/`)
- All channel packages
- SDK packages

**Expected output:**
```
Building @hopcode/hopcode...
Build complete! ✅
```

---

#### 5. Build VS Code Extension (Optional)

```bash
npm run build:vscode
```

**What this does:**
- Builds VS Code IDE companion
- Creates `.vsix` package for marketplace

**Requirements:**
- Node.js 20+
- VS Code extension tools

---

#### 6. Build Sandbox (Optional)

```bash
npm run build:sandbox
```

**What this does:**
- Builds Docker sandbox image
- Prepares containerized execution environment

---

#### 7. Build All (Complete)

```bash
npm run build:all
```

**What this does:**
- Runs `npm run build`
- Runs `npm run build:sandbox`
- Runs `npm run build:vscode`

---

## 🧪 Test Commands

### Run All Tests

```bash
npm test
```

**What this does:**
- Runs unit tests across all workspaces
- Runs in parallel for speed

---

### Test Categories

#### 1. Unit Tests

```bash
npm run test --workspaces --if-present
```

Tests individual packages and components.

---

#### 2. Integration Tests (No Sandbox)

```bash
npm run test:integration:sandbox:none
```

Runs integration tests without container isolation.

**Best for:** Quick testing during development

---

#### 3. Integration Tests (Docker)

```bash
npm run build:sandbox
npm run test:integration:sandbox:docker
```

Runs integration tests in Docker containers.

**Best for:** Production-like testing

---

#### 4. Integration Tests (Podman)

```bash
npm run test:integration:sandbox:podman
```

Runs integration tests in Podman containers.

**Best for:** Systems without Docker

---

#### 5. SDK Tests

```bash
# Without sandbox
npm run test:integration:sdk:sandbox:none

# With Docker
npm run test:integration:sdk:sandbox:docker
```

Tests the TypeScript SDK specifically.

---

#### 6. CLI Tests

```bash
# Without sandbox
npm run test:integration:cli:sandbox:none

# With Docker
npm run test:integration:cli:sandbox:docker
```

Tests CLI commands and functionality.

---

#### 7. Interactive Tests

```bash
npm run test:integration:interactive:sandbox:none
npm run test:integration:interactive:sandbox:docker
```

Tests interactive mode features.

---

#### 8. Terminal Bench Tests

```bash
npm run test:terminal-bench
```

Benchmark tests for terminal performance.

---

#### 9. Script Tests

```bash
npm run test:scripts
```

Tests build and utility scripts.

---

### End-to-End Tests

```bash
npm run test:e2e
```

Full end-to-end testing with verbose output.

---

## 📊 Build & Test Workflow

### Recommended Workflow

```bash
# 1. Install dependencies
npm install

# 2. Generate build info
npm run generate

# 3. Build core
npm run build

# 4. Run quick tests
npm test

# 5. If tests pass, run integration tests
npm run test:integration:sandbox:none

# 6. For production, run full test suite
npm run build:all
npm run test:ci
```

---

## 🔍 Verification Steps

After building, verify the HopCode branding:

### 1. Check Built Files

```bash
# Check CLI dist directory
dir packages\cli\dist

# Look for "HopCode" references
findstr /S /I "HopCode" packages\cli\dist\*.js
```

### 2. Check Version Info

```bash
# Run CLI version command
node packages\cli\dist\index.js --version

# Should show HopCode version
```

### 3. Check Package Names

```bash
# List all workspace packages
npm ls --depth=0

# All should show @hopcode/* prefix
```

---

## ⚠️ Common Issues & Solutions

### Issue 1: Build Fails with "Module not found"

**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules
npm cache clean --force
npm install
npm run build
```

---

### Issue 2: Tests Fail After Rebranding

**Possible causes:**
- Old cached test files
- Missed rebranding references

**Solution:**
```bash
# Clear test cache
npm run test -- --clearCache

# Re-run tests
npm test
```

---

### Issue 3: VS Code Build Fails

**Solution:**
```bash
# Install VS Code extension dependencies
npm install -g @vscode/vsce

# Then rebuild
npm run build:vscode
```

---

### Issue 4: Docker Sandbox Build Fails

**Solution:**
```bash
# Ensure Docker is running
docker --version

# Check Docker daemon
docker info

# Rebuild sandbox
npm run build:sandbox
```

---

## 📈 Build Performance

### Expected Build Times

| Component | Time |
|-----------|------|
| Core build | 2-5 min |
| VS Code extension | 1-2 min |
| Sandbox image | 5-10 min |
| All packages | 10-15 min |
| Full test suite | 15-30 min |

---

## 🎯 Post-Build Actions

### After Successful Build

1. **Verify branding in built files**
   ```bash
   findstr /S "HopCode" packages\cli\dist\*.js
   ```

2. **Test CLI command**
   ```bash
   node packages\cli\dist\index.js --help
   ```

3. **Check package sizes**
   ```bash
   dir /S packages\*\dist
   ```

4. **Prepare for publishing**
   - Reserve `@hopcode` scope on npm
   - Update `.npmrc` with authentication

---

## 🚀 Publishing Preparation

### Before Publishing

1. **Build everything**
   ```bash
   npm run build:all
   ```

2. **Run full test suite**
   ```bash
   npm run test:ci
   ```

3. **Verify all packages**
   ```bash
   npm ls --depth=0
   ```

4. **Check package.json files**
   - All should have `@hopcode/*` names
   - Repository URLs updated
   - Version numbers consistent

---

## 📊 Success Criteria

### Build Success ✅

- [ ] No compilation errors
- [ ] All dist/ directories created
- [ ] All assets bundled
- [ ] Version info generated
- [ ] HopCode branding present

### Test Success ✅

- [ ] All unit tests pass
- [ ] Integration tests pass
- [ ] No critical warnings
- [ ] Code coverage acceptable (>80%)

### Branding Success ✅

- [ ] All "Qwen Code" → "HopCode"
- [ ] All "@qwen-code/*" → "@hopcode/*"
- [ ] All "qwen" commands → "hopcode"
- [ ] Visual assets updated

---

## 📞 Quick Reference

### Most Common Commands

```bash
# Full build
npm install && npm run build:all

# Quick test
npm test

# Integration tests (no sandbox)
npm run test:integration:sandbox:none

# Build and test
npm run build && npm test

# Clean build
rm -rf node_modules dist
npm install
npm run build
```

---

## 🎉 Ready to Build!

Your HopCode rebranding is complete and ready for building!

**Next steps:**
1. Run `npm install`
2. Run `npm run build`
3. Run `npm test`
4. Verify branding
5. Prepare for publishing

---

**Good luck! 🦋**

*For questions, see REBRANDING_EXECUTION_COMPLETE.md*
