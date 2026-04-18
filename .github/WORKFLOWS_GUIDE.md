# 🚀 HopCode GitHub Actions Workflows Guide

**Location:** `.github/workflows/`  
**Updated:** 2026-04-18

---

## 📋 Available Workflows

### 1. **release.yml** - Main Release Workflow

**Purpose:** Automated releases (nightly, preview, stable) with npm publishing

**Triggers:**
- Schedule: Daily (nightly) and Weekly (preview)
- Manual: `workflow_dispatch`

**What it does:**
1. Calculates version numbers
2. Runs quality checks (lint, format, build, typecheck)
3. Runs integration tests (none + docker)
4. Creates GitHub release
5. Publishes to npm

**Manual Trigger Options:**
```yaml
version: 'v0.14.5'           # Optional version override
ref: 'main'                   # Branch to release from
dry_run: true                 # Dry-run mode
create_nightly_release: false # Create nightly release
create_preview_release: false # Create preview release
force_skip_tests: false       # Skip validation tests
```

**Secrets Required:**
- `NPM_TOKEN` - npm publishing token
- `GITHUB_TOKEN` - Auto-created
- `OPENAI_API_KEY` - For tests (optional)

---

### 2. **release-sdk.yml** - SDK TypeScript Release

**Purpose:** Release `@hopcode/sdk` package

**Triggers:**
- Manual: `workflow_dispatch`

**What it does:**
1. Builds SDK
2. Bundles CLI into SDK
3. Runs SDK tests
4. Publishes to npm
5. Creates GitHub release

**Manual Trigger Options:**
```yaml
version: 'v0.1.6'                    # Optional version
ref: 'main'                          # Branch to release from
cli_source: 'build_from_source'      # or 'npm_latest'
dry_run: true                        # Dry-run mode
create_nightly_release: false        # Nightly release
create_preview_release: false        # Preview release
force_skip_tests: false              # Skip tests
```

**Secrets Required:**
- `NPM_TOKEN` - npm publishing token
- `OPENAI_API_KEY` - For tests (optional)

---

### 3. **release-vscode-companion.yml** - VS Code Extension

**Purpose:** Release VS Code extension to marketplaces

**Triggers:**
- Manual: `workflow_dispatch`

**What it does:**
1. Builds extension for multiple platforms
2. Creates .vsix packages
3. Publishes to:
   - Microsoft Marketplace
   - OpenVSX Registry
4. Creates GitHub release

**Manual Trigger Options:**
```yaml
version: '0.14.5'           # Optional version
ref: 'main'                 # Branch to release from
dry_run: true               # Dry-run mode
create_preview_release: false
force_skip_tests: false
```

**Secrets Required:**
- `VSCE_PAT` - VS Code Marketplace token
- `OVSX_TOKEN` - OpenVSX token

---

### 4. **publish-npm.yml** - NPM Package Publisher ⭐ NEW

**Purpose:** Selective npm package publishing

**Triggers:**
- Manual: `workflow_dispatch`

**What it does:**
1. Determines packages to publish
2. Builds each package
3. Publishes to npm with provenance
4. Reports results

**Manual Trigger Options:**
```yaml
packages: 'all'             # or '@hopcode/core,@hopcode/sdk'
dry_run: true               # Dry-run mode
ref: 'main'                 # Branch to publish from
```

**Secrets Required:**
- `NPM_TOKEN` - npm publishing token

---

## 🔧 Setup Instructions

### 1. Configure NPM Token

**Step 1:** Get npm token
```bash
npm login
# Token is stored in ~/.npmrc
# Or create via: https://www.npmjs.com/settings/your-org/tokens
```

**Step 2:** Add to GitHub Secrets
```
Repository Settings → Secrets and variables → Actions → New repository secret

Name: NPM_TOKEN
Value: npm_xxxxxxxxxxxxxxxxxxxx
```

**Step 3:** Configure provenance (recommended)
```yaml
# In package.json
"publishConfig": {
  "provenance": true
}
```

---

### 2. Configure VS Code Marketplace Token

**Step 1:** Create Azure DevOps PAT
```
1. Go to https://dev.azure.com/
2. Create organization if needed
3. User Settings → Personal Access Tokens
4. Create token with "Marketplace (Publish)" scope
```

**Step 2:** Add to GitHub Secrets
```
Name: VSCE_PAT
Value: <your-pat-token>
```

---

### 3. Configure OpenVSX Token

**Step 1:** Create OpenVSX account
```
1. Go to https://open-vsx.org/
2. Sign in with GitHub
3. Access Tokens → Create token
```

**Step 2:** Add to GitHub Secrets
```
Name: OVSX_TOKEN
Value: <your-token>
```

---

## 📖 Usage Examples

### Example 1: Release Stable Version

```yaml
# Go to Actions → Release → Run workflow
# Fill in:
version: 'v0.15.0'
ref: 'main'
dry_run: false
create_nightly_release: false
create_preview_release: false
force_skip_tests: false
```

**Result:**
- Creates v0.15.0 release
- Publishes to npm with `latest` tag
- Creates GitHub release notes

---

### Example 2: Dry-Run Test

```yaml
# Go to Actions → Release → Run workflow
# Fill in:
version: 'v0.15.0'
ref: 'main'
dry_run: true  # ← Important!
```

**Result:**
- Runs all checks
- Simulates publish (no actual publish)
- Safe to test before real release

---

### Example 3: Nightly Release

```yaml
# Go to Actions → Release → Run workflow
# Fill in:
dry_run: false
create_nightly_release: true  # ← Creates nightly
```

**Result:**
- Creates nightly release
- Publishes with `nightly` tag
- Auto-applies nightly tag

---

### Example 4: Preview Release

```yaml
# Go to Actions → Release → Run workflow
# Fill in:
version: 'v0.15.0-preview.1'
dry_run: false
create_preview_release: true  # ← Creates preview
```

**Result:**
- Creates preview release
- Publishes with `preview` tag
- Marks as pre-release

---

### Example 5: Publish Specific Packages

```yaml
# Go to Actions → Publish NPM Packages → Run workflow
# Fill in:
packages: '@hopcore/core,@hopcode/sdk'  # ← Specific packages
dry_run: true
```

**Result:**
- Only publishes specified packages
- Other packages unchanged
- Safe for incremental releases

---

### Example 6: SDK Release with Latest CLI

```yaml
# Go to Actions → Release SDK → Run workflow
# Fill in:
cli_source: 'npm_latest'  # ← Use latest stable CLI
dry_run: false
```

**Result:**
- SDK bundles latest CLI from npm
- Faster build time
- Recommended for standalone SDK releases

---

### Example 7: SDK Release with Source CLI

```yaml
# Go to Actions → Release SDK → Run workflow
# Fill in:
cli_source: 'build_from_source'  # ← Build CLI from source
dry_run: false
```

**Result:**
- SDK bundles CLI from current branch
- Ensures version consistency
- Recommended when releasing CLI + SDK together

---

## 🔍 Monitoring & Debugging

### Check Workflow Status

```
1. Go to repository Actions tab
2. Select workflow (e.g., "Release")
3. Click on run to see details
4. Expand jobs to see step-by-step output
```

### Common Issues

#### Issue 1: npm publish fails with "E403 Forbidden"

**Cause:** NPM token invalid or missing

**Solution:**
```bash
# Verify token
echo $NPM_TOKEN

# Regenerate if needed
npm login
# Copy new token to GitHub secrets
```

---

#### Issue 2: VS Code extension rejected

**Cause:** Missing required fields in package.json

**Solution:**
```json
{
  "publisher": "hopcode",
  "engines": {
    "vscode": "^1.85.0"
  },
  "activationEvents": [...]
}
```

---

#### Issue 3: Tests failing in workflow

**Cause:** Missing environment variables

**Solution:**
```yaml
# Add to workflow env:
env:
  OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
  OPENAI_BASE_URL: ${{ secrets.OPENAI_BASE_URL }}
```

---

#### Issue 4: Version calculation wrong

**Cause:** Git tags not fetched

**Solution:**
```yaml
# Ensure checkout fetches all tags
- uses: actions/checkout@v4
  with:
    fetch-depth: 0  # ← Important!
```

---

## 📊 Workflow Status Badges

Add to README.md:

```markdown
<!-- Release Status -->
[![Release](https://github.com/TaimoorSiddiquiOfficial/HopCode/actions/workflows/release.yml/badge.svg)](https://github.com/TaimoorSiddiquiOfficial/HopCode/actions/workflows/release.yml)

<!-- SDK Status -->
[![Release SDK](https://github.com/TaimoorSiddiquiOfficial/HopCode/actions/workflows/release-sdk.yml/badge.svg)](https://github.com/TaimoorSiddiquiOfficial/HopCode/actions/workflows/release-sdk.yml)

<!-- VS Code Status -->
[![Release VSCode](https://github.com/TaimoorSiddiquiOfficial/HopCode/actions/workflows/release-vscode-companion.yml/badge.svg)](https://github.com/TaimoorSiddiquiOfficial/HopCode/actions/workflows/release-vscode-companion.yml)
```

---

## 🎯 Best Practices

### 1. Always Test with Dry-Run First

```yaml
# Before real release
dry_run: true

# Verify everything works
# Check logs for issues
# Then run with dry_run: false
```

---

### 2. Use Semantic Versioning

```
Major: Breaking changes (v1.0.0 → v2.0.0)
Minor: New features (v1.0.0 → v1.1.0)
Patch: Bug fixes (v1.0.0 → v1.0.1)
```

---

### 3. Run Tests Before Publishing

```yaml
# Don't skip tests for production releases
force_skip_tests: false

# Only skip for emergency hotfixes
force_skip_tests: true  # ← Use sparingly!
```

---

### 4. Use Provenance for Security

```yaml
# In publish step
run: npm publish --access public --provenance
```

**Benefits:**
- Verifies package origin
- Prevents supply chain attacks
- Builds trust with users

---

### 5. Monitor Failure Notifications

```yaml
# Workflow automatically creates issue on failure
# Check issues regularly
# Fix before next release
```

---

## 📝 Release Checklist

### Before Release

- [ ] All tests passing locally
- [ ] CHANGELOG.md updated
- [ ] Version numbers updated in package.json files
- [ ] Git tags up to date
- [ ] NPM token valid
- [ ] Dry-run test successful

### During Release

- [ ] Monitor workflow logs
- [ ] Check for errors in each job
- [ ] Verify npm publish success
- [ ] Verify GitHub release created

### After Release

- [ ] Verify package on npmjs.com
- [ ] Test installation: `npm install -g @hopcode/hopcode`
- [ ] Update documentation
- [ ] Announce release
- [ ] Monitor for issues

---

## 🔗 Related Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [npm Publishing Documentation](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)
- [VS Code Extension Publishing](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)
- [OpenVSX Publishing](https://github.com/eclipse/openvsx/wiki/Publishing-Extensions)

---

## 🆘 Troubleshooting

### Workflow Not Triggering

**Check:**
1. Workflow file syntax valid
2. Branch name correct
3. Permissions granted
4. No concurrency conflicts

### npm Publish Fails

**Check:**
1. NPM_TOKEN secret set
2. Package name unique
3. Version not already published
4. Network connectivity

### GitHub Release Not Created

**Check:**
1. GITHUB_TOKEN permissions
2. Git tags pushed
3. Release notes template valid
4. Repository permissions

---

**Last Updated:** 2026-04-18  
**Workflows:** 4 active  
**Status:** ✅ Ready for publishing
