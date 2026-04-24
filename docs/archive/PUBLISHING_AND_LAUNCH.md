# 🚀 HopCode - Publishing & Launch Checklist

**Status:** 📋 Ready for Launch Preparation  
**Updated:** 2026-04-18

---

## 📦 Pre-Publishing Requirements

### 1. Reserve NPM Scope

**Action:** Reserve `@hopcode` scope on npmjs.com

**Steps:**

1. Go to [npmjs.com](https://www.npmjs.com/)
2. Sign in / Create account
3. Go to Organizations
4. Create organization: `hopcode`
5. Verify ownership (email confirmation)

**URL:** https://www.npmjs.com/org/hopcode

---

### 2. Configure NPM Authentication

**Create `.npmrc` in project root:**

```ini
registry=https://registry.npmjs.org/
//registry.npmjs.org/:_authToken=${NPM_TOKEN}
@hopcode:registry=https://registry.npmjs.org/
```

**Set environment variable:**

```bash
# Windows (PowerShell)
$env:NPM_TOKEN="your-npm-token-here"

# Linux/macOS
export NPM_TOKEN="your-npm-token-here"
```

**Get token from:** https://www.npmjs.com/settings/your-username/tokens

---

## 📊 Package Publishing Order

Publish packages in this specific order to avoid dependency issues:

### Phase 1: Core Packages

```bash
# 1. Core package (no internal dependencies)
cd packages/core
npm publish --access public

# 2. SDK TypeScript
cd ../sdk-typescript
npm publish --access public

# 3. CLI Insight
cd ../cli-insight
npm publish --access public

# 4. Terminal Capture
cd ../terminal-capture
npm publish --access public
```

---

### Phase 2: Channel Packages

```bash
# Base channel
cd packages/channels/base
npm publish --access public

# DingTalk channel
cd ../dingtalk
npm publish --access public

# Telegram channel
cd ../telegram
npm publish --access public

# Weixin channel
cd ../weixin
npm publish --access public

# Plugin example
cd ../plugin-example
npm publish --access public
```

---

### Phase 3: Main Packages

```bash
# WebUI
cd packages/webui
npm publish --access public

# Web Templates
cd packages/web-templates
npm publish --access public

# VS Code Extension (also publish to marketplace)
cd packages/vscode-ide-companion
npm publish --access public
```

---

### Phase 4: CLI (Main Package)

```bash
# CLI (depends on all above)
cd packages/cli
npm publish --access public
```

---

## 🌐 Extension Marketplace Publishing

### VS Code Marketplace

**Step 1: Install VSCE**

```bash
npm install -g @vscode/vsce
```

**Step 2: Create Publisher Account**

1. Go to https://marketplace.visualstudio.com/manage
2. Create publisher ID: `hopcode`
3. Verify email

**Step 3: Package Extension**

```bash
cd packages/vscode-ide-companion
vsce package
```

**Step 4: Publish**

```bash
vsce publish
```

**Or with PAT (Personal Access Token):**

```bash
vsce publish -p YOUR_PERSONAL_ACCESS_TOKEN
```

**Get PAT from:** https://dev.azure.com/ → User Settings → Personal Access Tokens

---

### Open VSX Registry

**Step 1: Install OVSX**

```bash
npm install -g ovsx
```

**Step 2: Get Token**

1. Go to https://open-vsx.org/user-settings/tokens
2. Create access token

**Step 3: Publish**

```bash
ovsx publish -p YOUR_TOKEN
```

---

### Zed Extension

**Step 1: Update extension.toml**

```toml
id = "hopcode"
name = "HopCode"
authors = ["HopCode Team"]
```

**Step 2: Submit to Zed**

1. Go to https://zed.dev/extensions
2. Sign in with GitHub
3. Submit extension repository
4. Wait for review (1-2 days)

---

## 📊 Publishing Verification

### After Publishing Each Package

**Verify on npm:**

```bash
# Check package exists
npm view @hoptrendy/core
npm view @hoptrendy/hopcode
npm view @hoptrendy/sdk
# ... etc for all 14 packages
```

**Test installation:**

```bash
# Install globally to test
npm install -g @hoptrendy/hopcode

# Run CLI
hopcode --version
hopcode --help
```

---

## 🎉 Launch Preparation

### Documentation Updates

- [x] README.md updated ✅
- [x] Installation guides updated ✅
- [x] Quick start guide created ✅
- [x] Build guide created ✅
- [x] API documentation updated ✅

### Website / Documentation Site

```bash
# Update docs-site configuration
cd docs-site

# Update site title
# File: src/app/layout.jsx
# Change: <title>Qwen Code</title> → <title>HopCode</title>

# Update logo
# Replace logo component with HopCode logo

# Deploy
npm run build
npm run deploy
```

### GitHub Repository

- [x] Repository name/description updated ✅
- [x] README badges updated ✅
- [x] Topics/tags updated ✅
- [x] Website URL updated ✅

**Update repository settings:**

1. Go to Settings → General
2. Update description: "HopCode - AI-powered coding assistant"
3. Update website: https://hopcode.dev (if applicable)
4. Update topics: `hopcode`, `ai`, `coding-assistant`, `terminal`

---

## 📢 Launch Announcement

### Press Release Template

```
FOR IMMEDIATE RELEASE

HopCode: The Butterfly Effect of Intelligent Code

[CITY], [DATE] — Today marks the launch of HopCode, the rebranded
open-source AI coding assistant that's transforming how developers
work with large codebases.

Formerly known as "Qwen Code," HopCode represents a new chapter in
AI-assisted development, featuring:

- Enhanced terminal interface
- Support for Qwen series models
- VS Code and Zed editor integration
- Open-source SDK for extensibility
- Cross-platform compatibility

"HopCode embodies the butterfly effect - small changes create
massive impact," said [SPOKESPERSON NAME], [TITLE]. "We're excited
to empower developers with intelligent coding assistance."

Key Features:
✓ Optimized for Qwen3.5 and Qwen3.6 models
✓ Multi-IDE support (VS Code, Zed, JetBrains)
✓ Advanced approval modes for security
✓ MCP server integration
✓ Extensive hook system

HopCode is available now on npm as @hoptrendy/hopcode and as
extensions for VS Code and Zed.

Download: https://github.com/TaimoorSiddiquiOfficial/HopCode
Documentation: https://hopcode.dev/docs

About HopCode:
HopCode is an open-source AI agent for the terminal, optimized for
Qwen series models. It helps developers understand large codebases,
automate tedious work, and ship faster.

###
```

---

### Social Media Posts

**Twitter/X Thread:**

```
🦋 Introducing HopCode!

The butterfly effect of intelligent code is here. We've rebranded from
Qwen Code to HopCode, marking a new era of AI-assisted development.

Try it now:
npm install -g @hoptrendy/hopcode

#HopCode #AI #CodingAssistant #OpenSource #DeveloperTools
```

**LinkedIn Post:**

```
🚀 Exciting News! We're launching HopCode!

After successful development as "Qwen Code," we're rebranding to
HopCode - an AI-powered coding assistant optimized for Qwen series
models.

✨ What's new:
- Fresh brand identity
- Enhanced terminal experience
- Multi-IDE support
- Open-source SDK

Try it: npm install -g @hoptrendy/hopcode
Learn more: [documentation link]

#HopCode #AI #SoftwareDevelopment #OpenSource #Innovation
```

**Discord Announcement:**

```
@everyone 🦋 HopCode has landed!

We've rebranded from Qwen Code to HopCode! Here's what you need to know:

✅ Same great AI coding assistant
✅ Fresh new name and logo
✅ All packages now under @hoptrendy/*
✅ Enhanced documentation

Install: npm install -g @hoptrendy/hopcode
Docs: https://hopcode.dev/docs

Questions? Drop them below! 👇
```

---

## 📊 Launch Day Checklist

### Morning (9:00 AM)

- [ ] Final build verification
- [ ] All packages published
- [ ] Extensions live in marketplaces
- [ ] Documentation site deployed
- [ ] GitHub repository updated

### Mid-Day (12:00 PM)

- [ ] Press release distributed
- [ ] Social media posts scheduled
- [ ] Community announcements made
- [ ] Team notified and ready to support

### Afternoon (3:00 PM)

- [ ] Monitor npm downloads
- [ ] Watch GitHub stars/issues
- [ ] Respond to community questions
- [ ] Track social media engagement

### Evening (6:00 PM)

- [ ] Launch day metrics review
- [ ] Issue triage
- [ ] Community feedback summary
- [ ] Thank you message to contributors

---

## 📈 Success Metrics

### Week 1 Targets

| Metric              | Target | Actual |
| ------------------- | ------ | ------ |
| npm downloads       | 500+   | \_\_\_ |
| GitHub stars        | 100+   | \_\_\_ |
| Extension installs  | 200+   | \_\_\_ |
| Documentation views | 1000+  | \_\_\_ |
| Social media reach  | 5000+  | \_\_\_ |

### Month 1 Targets

| Metric                 | Target | Actual |
| ---------------------- | ------ | ------ |
| npm downloads          | 5000+  | \_\_\_ |
| GitHub stars           | 500+   | \_\_\_ |
| Extension installs     | 1000+  | \_\_\_ |
| Active users           | 100+   | \_\_\_ |
| Community contributors | 10+    | \_\_\_ |

---

## 🔄 Migration Support for Existing Users

### Migration Guide

Create a migration guide for users of "Qwen Code":

````markdown
# Migrating from Qwen Code to HopCode

Good news! Qwen Code is now HopCode. Here's how to upgrade:

## 1. Uninstall Old Version

```bash
npm uninstall -g @qwen-code/qwen-code
```
````

## 2. Install New Version

```bash
npm install -g @hoptrendy/hopcode
```

## 3. Migrate Configuration

Your settings are safe! HopCode will automatically migrate your
configuration from `~/.qwen/` to `~/.hopcode/` on first run.

## 4. Update Your Workflow

Update any scripts or documentation that reference:

- `qwen` command → `hopcode`
- `@qwen-code/*` packages → `@hoptrendy/*`
- `.qwen/` directory → `.hopcode/`

## Questions?

See our migration guide: [link]

````

---

## 🎯 Post-Launch Actions

### Week 1

- [ ] Daily issue triage
- [ ] Community support
- [ ] Bug fixes as needed
- [ ] Usage metrics review

### Week 2

- [ ] First stability update
- [ ] Documentation improvements
- [ ] Performance optimizations
- [ ] Community feedback integration

### Month 1

- [ ] First minor release (v0.15.0)
- [ ] Feature roadmap update
- [ ] Community call / AMA
- [ ] Launch retrospective

---

## 📞 Emergency Rollback Plan

If critical issues arise:

### Step 1: Deprecate Problematic Packages

```bash
npm deprecate @hoptrendy/hopcode@0.14.5 "Critical bug - please downgrade to 0.14.4"
````

### Step 2: Restore Previous Version

```bash
# Tag previous version
cd packages/cli
npm dist-tag add @hoptrendy/hopcode@0.14.4 latest
```

### Step 3: Communicate

Post announcement:

- GitHub Issues
- Discord/Community channels
- Twitter/X
- npm package deprecation notice

### Step 4: Fix and Republish

```bash
# Fix issues
# Test thoroughly
# Bump version
npm version patch  # 0.14.6
npm publish
```

---

## ✅ Final Pre-Launch Checklist

### Technical

- [x] All code rebranded ✅
- [x] All tests passing ✅
- [x] Build successful ✅
- [x] Documentation complete ✅
- [ ] NPM scope reserved ⏳
- [ ] Packages published ⏳
- [ ] Extensions published ⏳

### Marketing

- [ ] Press release written ⏳
- [ ] Social media graphics ready ⏳
- [ ] Launch announcement drafted ⏳
- [ ] Community managers briefed ⏳

### Support

- [ ] Issue templates updated ⏳
- [ ] FAQ prepared ⏳
- [ ] Support rotation scheduled ⏳
- [ ] Escalation process defined ⏳

---

## 🎉 Launch Command (When Ready)

```bash
# The moment of truth!
echo "🦋 Launching HopCode..."

# Publish all packages
./scripts/publish-all.sh

# Deploy documentation
cd docs-site && npm run deploy

# Post announcement
echo "HopCode is live! 🚀"
```

---

**Ready to launch HopCode to the world! 🦋**

_Good luck!_
