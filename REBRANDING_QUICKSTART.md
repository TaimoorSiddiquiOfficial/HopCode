# HopCode Rebranding Quick-Start Guide

## Overview

This guide walks you through executing the complete rebranding from "Qwen Code" to "HopCode" using the automated scripts.

---

## Prerequisites

- **Git** installed and configured
- **Node.js** (v18+) and npm
- **PowerShell** (Windows) or **Bash** (macOS/Linux)
- Backup important data before proceeding

---

## Step 1: Review the Plan

Before executing, review the comprehensive rebranding plan:

```bash
# Open the plan document
# Windows
start D:\HopCode\REBRANDING_PLAN.md

# macOS/Linux
open D:\HopCode\REBRANDING_PLAN.md
# or
xdg-open D:\HopCode\REBRANDING_PLAN.md
```

---

## Step 2: Run in Dry-Run Mode (Recommended)

First, execute the script in dry-run mode to see what changes will be made:

### Windows (PowerShell)

```powershell
cd D:\HopCode\scripts
.\rebrand-to-hopcode.ps1 -DryRun
```

### macOS/Linux (Bash)

```bash
cd /d/HopCode/scripts
chmod +x rebrand-to-hopcode.sh
./rebrand-to-hopcode.sh --dry-run
```

**Review the output carefully** to understand what will be changed.

---

## Step 3: Execute the Rebranding

### Option A: Run All Phases (Complete Rebranding)

**Windows:**

```powershell
.\rebrand-to-hopcode.ps1
```

**macOS/Linux:**

```bash
./rebrand-to-hopcode.sh
```

### Option B: Run Specific Phases

If you want more control, run phases individually:

**Phase 1 - Core Identity:**

```bash
# Windows
.\rebrand-to-hopcode.ps1 -Phase 1

# macOS/Linux
./rebrand-to-hopcode.sh --phase 1
```

**Phase 2 - High Visibility:**

```bash
# Windows
.\rebrand-to-hopcode.ps1 -Phase 2

# macOS/Linux
./rebrand-to-hopcode.sh --phase 2
```

Continue with phases 3, 4, and 5 as needed.

---

## Step 4: Review Changes

After the script completes:

```bash
cd D:\HopCode

# Review all changes
git diff

# Check status
git status
```

**Important:** Carefully review the changes, especially:

- Package names in `package.json` files
- Command names in documentation
- Configuration directory paths
- Environment variable names

---

## Step 5: Manual Updates Required

Some items require manual attention:

### 5.1 Update Model Names (Keep as-is)

**DO NOT CHANGE** these actual Alibaba Cloud model names:

- `qwen3.5-plus` ✓ Keep
- `qwen3.6-plus` ✓ Keep

### 5.2 Update Visual Assets

Replace logo and icon files:

1. `packages/zed-extension/hopcode.svg` (design new logo)
2. `packages/vscode-ide-companion/assets/icon.png` (redesign)
3. `packages/vscode-ide-companion/assets/sidebar-icon.svg` (redesign)
4. `packages/web-templates/src/export-html/src/favicon.svg` (redesign)

### 5.3 Update URLs

Replace these URLs with actual HopCode URLs:

```
Old: https://qwenlm.github.io/qwen-code-docs/
New: [Your new docs URL]

Old: https://github.com/QwenLM/qwen-code
New: https://github.com/TaimoorSiddiquiOfficial/HopCode

Old: qwen-code-assets.oss-cn-hangzhou.aliyuncs.com
New: [Your new CDN/bucket]
```

### 5.4 Java Package Names

**Decision Required:** Update or keep `com.alibaba.qwen.code` package names for Maven compatibility.

---

## Step 6: Build and Test

### 6.1 Install Dependencies

```bash
cd D:\HopCode
npm install
```

### 6.2 Build All Packages

```bash
npm run build
```

### 6.3 Run Tests

```bash
npm test
```

### 6.4 Test Installation Script

```bash
# Test the renamed installation script
cd scripts/installation
# Windows
.\install-hopcode-with-source.bat

# macOS/Linux
./install-hopcode-with-source.sh
```

---

## Step 7: Update CI/CD

1. **GitHub Actions:**
   - Update workflow files in `.github/workflows/`
   - Update repository references
   - Update npm publishing configuration

2. **Docker:**
   - Update `Dockerfile` with new image names
   - Push new container images to registry

3. **NPM Publishing:**

   ```bash
   # Reserve @hopcode scope
   npm login

   # Publish packages (example)
   cd packages/core
   npm publish --access public

   cd ../cli
   npm publish --access public

   # Repeat for all packages
   ```

---

## Step 8: Migration Support

Create a migration script for existing users:

```bash
# Example migration command
hopcode migrate
```

This should:

- Move `~/.qwen/` → `~/.hopcode/`
- Update settings files
- Create backup
- Provide rollback option

---

## Troubleshooting

### Issue: Script fails on Windows

**Solution:** Run PowerShell as Administrator or adjust execution policy:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Issue: File permissions on macOS/Linux

**Solution:** Make scripts executable:

```bash
chmod +x scripts/*.sh
chmod +x scripts/installation/*.sh
```

### Issue: Build errors after rebranding

**Solution:** Check for missed references:

```bash
# Search for remaining Qwen references
grep -r "qwen-code" packages/ --include="*.json"
grep -r "@qwen-code" packages/ --include="*.ts"
```

### Issue: Import errors in TypeScript

**Solution:** Update `tsconfig.json` path mappings:

```json
{
  "compilerOptions": {
    "paths": {
      "@hopcode/*": ["packages/*/src"]
    }
  }
}
```

---

## Rollback Procedure

If you need to rollback:

```bash
cd D:\HopCode

# Find the backup directory
ls -la .hopcode-backup-*

# Restore from backup (example)
cp .hopcode-backup-20260418-120000/package.json .
cp -r .hopcode-backup-20260418-120000/packages/* packages/
cp -r .hopcode-backup-20260418-120000/scripts/* scripts/

# Or use git to revert
git reset --hard HEAD
git clean -fd
```

---

## Post-Rebranding Checklist

- [ ] All `@qwen-code/*` packages renamed to `@hopcode/*`
- [ ] CLI command changed from `qwen` to `hopcode`
- [ ] Config directory updated to `.hopcode/`
- [ ] Environment variables updated to `HOPCODE_*`
- [ ] README.md fully updated
- [ ] Installation scripts tested
- [ ] VS Code extension manifest updated
- [ ] Zed extension manifest updated
- [ ] All tests passing
- [ ] Documentation site updated
- [ ] NPM packages published under `@hopcode` scope
- [ ] Container images built and pushed
- [ ] GitHub workflows updated
- [ ] Migration script created
- [ ] Announcement prepared for users

---

## Need Help?

If you encounter issues:

1. Check the backup directory for original files
2. Review the full `REBRANDING_PLAN.md` for details
3. Run the script with `-DryRun` to preview changes
4. Execute phases individually for better control

---

**Good luck with the HopCode rebranding! 🚀**
