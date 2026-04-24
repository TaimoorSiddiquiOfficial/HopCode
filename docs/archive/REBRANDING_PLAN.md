# HopCode Rebranding Plan

## From "Qwen Code" → "HopCode"

**Created:** 2026-04-18  
**Repository:** D:\HopCode  
**Status:** Planning Phase

---

## Executive Summary

This document outlines the complete rebranding strategy to transform "Qwen Code" into "HopCode" with a butterfly effect approach—where every change cascades systematically through the codebase, documentation, and ecosystem.

---

## Phase 1: Core Identity Changes (Breaking)

### 1.1 Package Naming (`@qwen-code/*` → `@hoptrendy/*`)

**Impact:** Critical - Affects all dependencies and imports

#### Files to Update:

- [ ] `package.json` (root)
  - `name`: `@hoptrendy/hopcode`
  - `repository.url`: Update to new GitHub repo
  - `sandboxImageUri`: `ghcr.io/hopcode/hopcode:0.14.5`
  - `bin`: `hopcode: 'cli.js'`

- [ ] `packages/cli/package.json`
  - `name`: `@hoptrendy/hopcode`
  - `description`: `HopCode`
  - `bin`: `{ "hopcode": "dist/index.js" }`
  - All `@qwen-code/*` dependencies → `@hoptrendy/*`

- [ ] All `packages/*/package.json` files
  - `@hoptrendy/sdk`, `@hoptrendy/webui`, `@hoptrendy/core`, etc.

### 1.2 CLI Command (`qwen` → `hopcode`)

**Impact:** User-facing breaking change

#### Changes:

- [ ] `packages/cli/package.json` → `bin.hopcode`
- [ ] `packages/cli/src/*` → Update command registration
- [ ] `README.md` → All `qwen` command examples → `hopcode`
- [ ] Installation scripts → Update command references
- [ ] Documentation → All command examples

### 1.3 Configuration Directory (`.qwen/` → `.hopcode/`)

**Impact:** User data migration required

#### Changes:

- [ ] `scripts/installation/install-qwen-with-source.sh`
  - `QWEN_DIR="${HOME}/.qwen"` → `HOPCODE_DIR="${HOME}/.hopcode"`
  - Update all path references

- [ ] `scripts/installation/install-qwen-with-source.bat`
  - `%USERPROFILE%\.qwen` → `%USERPROFILE%\.hopcode`

- [ ] `packages/core/src/utils/installationManager.ts`
- [ ] `packages/core/src/config/*`
- [ ] `.gitignore` → `.hopcode/` entry

### 1.4 Environment Variables (`QWEN_CODE_*` → `HOPCODE_*`)

**Impact:** Breaking change for users with custom env configs

| Old Variable                     | New Variable                   |
| -------------------------------- | ------------------------------ |
| `QWEN_CODE_*`                    | `HOPCODE_*`                    |
| `QWEN_SANDBOX`                   | `HOPCODE_SANDBOX`              |
| `QWEN_WORKING_DIR`               | `HOPCODE_WORKING_DIR`          |
| `QWEN_CODE_NO_RELAUNCH`          | `HOPCODE_NO_RELAUNCH`          |
| `QWEN_CODE_TRUSTED_FOLDERS_PATH` | `HOPCODE_TRUSTED_FOLDERS_PATH` |
| `QWEN_CODE_SYSTEM_SETTINGS_PATH` | `HOPCODE_SYSTEM_SETTINGS_PATH` |
| `QWEN_CODE_IDE_SERVER_PORT`      | `HOPCODE_IDE_SERVER_PORT`      |
| `QWEN_CODE_IDE_WORKSPACE_PATH`   | `HOPCODE_IDE_WORKSPACE_PATH`   |
| `QWEN_CODE_LANG`                 | `HOPCODE_LANG`                 |
| `QWEN_CODE_ENABLE_CRON`          | `HOPCODE_ENABLE_CRON`          |
| `QWEN_CODE_MAX_OUTPUT_TOKENS`    | `HOPCODE_MAX_OUTPUT_TOKENS`    |
| `QWEN_CODE_INTEGRATION_TEST`     | `HOPCODE_INTEGRATION_TEST`     |
| `QWEN_CODE_PROFILE_STARTUP`      | `HOPCODE_PROFILE_STARTUP`      |

---

## Phase 2: High Visibility Changes

### 2.1 README.md Transformation

**Location:** `README.md` (536 lines)

#### Key Changes:

- [ ] Badges: Update npm, license, trendshift URLs
- [ ] Documentation links: Migrate to new docs site
- [ ] Title & Introduction: "HopCode" branding
- [ ] Installation commands: `hopcode` instead of `qwen`
- [ ] Configuration examples: `~/.hopcode/settings.json`
- [ ] Model examples: Keep `qwen3.5-plus` (actual model names)
- [ ] "Why Qwen Code?" → "Why HopCode?"

### 2.2 Installation Scripts

#### Shell Script (`scripts/installation/install-qwen-with-source.sh`)

- [ ] Rename file → `install-hopcode-with-source.sh`
- [ ] Update all comments and echo messages
- [ ] `install_qwen_code()` → `install_hopcode()`
- [ ] Directory paths: `.qwen` → `.hopcode`
- [ ] npm package: `@hoptrendy/hopcode`

#### Batch Script (`scripts/installation/install-qwen-with-source.bat`)

- [ ] Rename file → `install-hopcode-with-source.bat`
- [ ] Update all REM comments and echo messages
- [ ] `:InstallQwenCode` label → `:InstallHopCode`
- [ ] Windows paths: `%USERPROFILE%\.hopcode`

#### Installation Guide (`scripts/installation/INSTALLATION_GUIDE.md`)

- [ ] Update all "Qwen Code" references → "HopCode"

### 2.3 VS Code Extension

**Location:** `packages/vscode-ide-companion/`

#### `package.json`:

- [ ] `name`: `hopcode-vscode-ide-companion`
- [ ] `displayName`: `HopCode Companion`
- [ ] `description`: `Enable HopCode...`
- [ ] `publisher`: Update to new publisher
- [ ] `repository.url`: New GitHub URL
- [ ] Keywords: `hopcode`, `hopcode code`
- [ ] Commands: `hopcode-code.*`, `hopcode.*`
- [ ] Views: `hopcode-sidebar`, `hopcode-secondary`
- [ ] `sandboxImageUri`: New container image

#### Assets:

- [ ] `assets/icon.png` → Redesign with HopCode branding
- [ ] `assets/sidebar-icon.svg` → Redesign

#### `README.md`:

- [ ] Update all branding references

#### Source Files:

- [ ] `qwenCode.*` commands → `hopcodeCode.*`
- [ ] `QWEN_CODE_*` env vars → `HOPCODE_*`

### 2.4 Zed Extension

**Location:** `packages/zed-extension/`

#### `extension.toml`:

```toml
# Old
id = "qwen-code"
name = "Qwen Code"
authors = ["Qwen Team"]
description = "Qwen Code Agent Server..."
repository = "https://github.com/QwenLM/qwen-code"

# New
id = "hopcode"
name = "HopCode"
authors = ["HopCode Team"]
description = "HopCode Agent Server..."
repository = "https://github.com/TaimoorSiddiquiOfficial/HopCode"
```

#### Assets:

- [ ] `qwen-code.svg` → `hopcode.svg` (redesign logo)

#### `README.md`:

- [ ] Update all branding (122+ lines)

#### `LICENSE`:

- [ ] Copyright holder: `Qwen Team` → `HopCode Team`

### 2.5 WebUI Package

**Location:** `packages/webui/`

#### Configuration Files:

- [ ] `vite.config.ts` → `name: 'HopCodeWebUI'`
- [ ] `tailwind.preset.cjs` → `@hoptrendy/webui`
- [ ] `tailwind.config.cjs` → Copyright update

#### Source Files (100+ files):

- [ ] Copyright headers: `Qwen Team` → `HopCode Team`
- [ ] `src/styles/variables.css`:
  - `--app-qwen-ivory` → `--app-hopcode-ivory`
  - `--qwen-corner-radius-*` → `--hopcode-corner-radius-*`

#### CSS Files:

- [ ] `src/styles/timeline.css`: `.qwen-message` → `.hopcode-message` (37+ occurrences)

#### `README.md`:

- [ ] `QwenCodeWebUI` global object → `HopCodeWebUI`

#### Examples:

- [ ] Demo HTML files with updated global object

---

## Phase 3: Source Code & Internal Identifiers

### 3.1 Copyright Headers (782+ files)

**Pattern:** `Copyright 2025 Qwen` → `Copyright 2026 HopCode Team`

#### Affected Directories:

- [ ] `packages/webui/src/` (all TypeScript/JavaScript files)
- [ ] `packages/sdk-java/` (all Java files)
- [ ] `scripts/` (all script files)
- [ ] Extension LICENSE files

### 3.2 Code Identifiers

**Note:** Use search-and-replace carefully to avoid breaking changes in public APIs

#### Patterns to Replace:

| Pattern     | Replacement    | Count |
| ----------- | -------------- | ----- |
| `QwenCode*` | `HopCode*`     | 332+  |
| `qwenCode*` | `hopcodeCode*` | 100+  |
| `qwen-*`    | `hopcode-*`    | 1854+ |
| `QWEN_*`    | `HOPCODE_*`    | 500+  |
| `qwenlm`    | `hopcode`      | 123+  |
| `QwenLM`    | `HopCode`      | 100+  |

#### Java Package Names:

**Decision Required:** Keep `com.alibaba.qwen.code` for Maven compatibility or migrate to new namespace

### 3.3 CSS Classes & Styling

| Old Class                | New Class                   |
| ------------------------ | --------------------------- |
| `.qwen-message`          | `.hopcode-message`          |
| `.qwen-webui-container`  | `.hopcode-webui-container`  |
| `--app-qwen-ivory`       | `--app-hopcode-ivory`       |
| `--qwen-corner-radius-*` | `--hopcode-corner-radius-*` |

---

## Phase 4: Documentation & Ecosystem

### 4.1 User Documentation (`docs/users/`)

- [ ] `overview.md` → Installation, branding
- [ ] `quickstart.md` → `hopcode` commands
- [ ] `integration-vscode.md`, `integration-zed.md`, `integration-jetbrains.md`
- [ ] `integration-github-action.md` → `hopcode-action`
- [ ] `configuration/` → Settings, auth, themes
- [ ] `features/` → Sandbox, MCP, skills
- [ ] `support/` → Troubleshooting, uninstall

### 4.2 Developer Documentation (`docs/developers/`)

- [ ] `contributing.md` → New repo URLs
- [ ] `development/` → npm publishing as `@hoptrendy/*`
- [ ] `tools/` → Tool documentation
- [ ] `sdk-typescript.md` → SDK docs

### 4.3 Documentation Site (`docs-site/`)

- [ ] `src/app/layout.jsx`: `docsRepositoryBase` URL
- [ ] Nextra configuration
- [ ] Site branding, logos, favicons

### 4.4 SDK Packages

#### TypeScript SDK (`packages/sdk-typescript/`):

- [ ] `package.json` → Repository, homepage
- [ ] `README.md` → `@hoptrendy/sdk`, `hopcode` preset
- [ ] `src/` → Type definitions

#### Java SDK (`packages/sdk-java/`):

- [ ] `qwencode/` → Package names (decision required)
- [ ] `QWEN.md` → `HOPCODE.md`
- [ ] `pom.xml` → Maven configuration
- [ ] `client/` → Client library

---

## Phase 5: Infrastructure & Deployment

### 5.1 Container Images

| Old                                | New                       |
| ---------------------------------- | ------------------------- |
| `ghcr.io/qwenlm/qwen-code`         | `ghcr.io/hopcode/hopcode` |
| `qwenlm.github.io/qwen-code-docs/` | New docs URL              |

### 5.2 Asset Hosting

| Old                                              | New            |
| ------------------------------------------------ | -------------- |
| `qwen-code-assets.oss-cn-hangzhou.aliyuncs.com/` | New CDN/bucket |

### 5.3 GitHub Repository

- [ ] Update all badge URLs to new repo
- [ ] Update workflow configurations
- [ ] Update issue/PR templates
- [ ] Update GitHub Actions integrations

### 5.4 NPM Publishing

- [ ] Reserve `@hopcode` scope on npm
- [ ] Publish all packages under new scope
- [ ] Deprecate old `@qwen-code/*` packages with migration notice

---

## Special Considerations

### Items to KEEP Unchanged

1. **Model Names** (Alibaba Cloud models):
   - `qwen3.5-plus` ✓ Keep
   - `qwen3.6-plus` ✓ Keep
   - These are actual model identifiers from Alibaba

2. **Gemini CLI Attribution**:
   - Keep acknowledgment of upstream Gemini CLI project
   - Required for license compliance

3. **Third-Party URLs** (where not controllable):
   - GitHub badges pointing to original repo (until migration)
   - External documentation links

### Migration Strategy for Users

1. **Backward Compatibility Layer** (Optional):
   - Support both `.qwen/` and `.hopcode/` directories temporarily
   - Auto-migrate settings on first run
   - Deprecation warnings for old env vars

2. **Migration Script**:

   ```bash
   # Example migration script
   hopcode migrate
   # Moves ~/.qwen → ~/.hopcode
   # Updates settings.json with new paths
   # Creates backup
   ```

3. **Deprecation Timeline**:
   - Month 1-2: Support both old and new
   - Month 3-4: Warnings for old config
   - Month 5+: Remove legacy support

---

## File Rename Checklist

### Scripts

- [ ] `scripts/installation/install-qwen-with-source.sh` → `install-hopcode-with-source.sh`
- [ ] `scripts/installation/install-qwen-with-source.bat` → `install-hopcode-with-source.bat`

### Assets

- [ ] `packages/zed-extension/qwen-code.svg` → `hopcode.svg`
- [ ] `packages/vscode-ide-companion/assets/icon.png` → redesign
- [ ] `packages/vscode-ide-companion/assets/sidebar-icon.svg` → redesign
- [ ] `packages/web-templates/src/export-html/src/favicon.svg` → redesign

### Configuration

- [ ] `packages/*/qwen-extension.json` → `hopcode-extension.json`
- [ ] `packages/sdk-java/QWEN.md` → `HOPCODE.md`

---

## Command & Alias Changes

### Primary Command

```bash
# Old
qwen

# New
hopcode
```

### Subcommands

| Old                | New                   |
| ------------------ | --------------------- |
| `qwen mcp`         | `hopcode mcp`         |
| `qwen extensions`  | `hopcode extensions`  |
| `qwen auth`        | `hopcode auth`        |
| `qwen diff.accept` | `hopcode diff.accept` |

### Slash Commands (in-chat)

| Old     | New        |
| ------- | ---------- |
| `/qwen` | `/hopcode` |

### Shell Aliases (for backward compatibility)

```bash
# Add to user's shell config
alias qwen='hopcode'  # Optional: temporary alias
```

---

## Testing Strategy

### 1. Unit Tests

- [ ] Update all test fixtures referencing `.qwen/`
- [ ] Update environment variable mocks
- [ ] Update package name assertions

### 2. Integration Tests

- [ ] `integration-tests/terminal-capture/` → Update terminal titles
- [ ] `integration-tests/terminal-bench/` → Update setup scripts
- [ ] `integration-tests/test-helper.ts` → Update directory creation

### 3. End-to-End Tests

- [ ] Installation flow testing
- [ ] Command execution testing
- [ ] Extension integration testing

### 4. Documentation Tests

- [ ] Verify all command examples work
- [ ] Test installation script paths
- [ ] Validate configuration examples

---

## Rollout Plan

### Week 1: Core Changes

- Package names and CLI command
- Configuration directory structure
- Environment variables

### Week 2: User-Facing Changes

- README and documentation
- Installation scripts
- Extension manifests

### Week 3: Source Code

- Copyright headers
- Internal identifiers
- CSS classes

### Week 4: Ecosystem

- Container images
- Asset hosting
- NPM publishing
- Documentation site

### Week 5: Testing & QA

- Full regression testing
- Migration script testing
- User acceptance testing

### Week 6: Launch

- Final review
- Publish all packages
- Announce rebranding

---

## Risk Assessment

| Risk                            | Impact | Mitigation                             |
| ------------------------------- | ------ | -------------------------------------- |
| Breaking user configs           | High   | Migration script, deprecation warnings |
| NPM scope availability          | High   | Reserve `@hopcode` before launch       |
| Extension marketplace conflicts | Medium | Coordinate with VS Code/Zed teams      |
| Documentation links breaking    | Medium | Redirects from old URLs                |
| Container image migration       | Medium | Parallel hosting during transition     |

---

## Success Metrics

- [ ] All 9000+ "Qwen" references replaced or intentionally kept
- [ ] All tests passing under new branding
- [ ] Installation scripts work correctly
- [ ] Extensions publish successfully to marketplaces
- [ ] Documentation site live with new branding
- [ ] NPM packages published under `@hoptrendy/*`
- [ ] Container images available in new registry
- [ ] User migration path validated

---

## Appendix: Quick Reference

### Naming Convention Summary

| Context      | Old                              | New                            |
| ------------ | -------------------------------- | ------------------------------ |
| Project Name | Qwen Code                        | HopCode                        |
| CLI Command  | `qwen`                           | `hopcode`                      |
| Config Dir   | `.qwen/`                         | `.hopcode/`                    |
| NPM Scope    | `@qwen-code/`                    | `@hoptrendy/`                  |
| Env Vars     | `QWEN_CODE_*`                    | `HOPCODE_*`                    |
| CSS Classes  | `.qwen-*`                        | `.hopcode-*`                   |
| VS Code Ext  | `qwen-code-vscode-ide-companion` | `hopcode-vscode-ide-companion` |
| Zed Ext      | `qwen-code`                      | `hopcode`                      |
| WebUI Global | `QwenCodeWebUI`                  | `HopCodeWebUI`                 |
| Java Package | `com.alibaba.qwen.code`          | _(TBD)_                        |

---

**End of Rebranding Plan**

_Last Updated: 2026-04-18_
