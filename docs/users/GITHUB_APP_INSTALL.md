# HopCode GitHub App Installation

**Welcome to HopCode!** 👋

To use GitHub integration features, you need to install the HopCode GitHub App on your repositories.

---

## 🚀 Quick Install (Recommended)

### Step 1: Install the App

Click the button below to install HopCode on your GitHub repositories:

👉 **[Install HopCode GitHub App](https://github.com/apps/hopcode-cli/installations/select_target)**

_(Button opens in new tab - come back here after installation)_

### Step 2: Select Repositories

1. Choose where to install (your account or organization)
2. **Select repositories** you want HopCode to access
3. Click **"Install"**

### Step 3: Configure Credentials

After installation, configure HopCode with your credentials:

#### Option A: Environment Variables (Recommended)

Add to your shell profile (`~/.bashrc`, `~/.zshrc`, or `~/.zprofile`):

```bash
# Replace the values below with YOUR GitHub App credentials
export GITHUB_APP_ID=YOUR_APP_ID
export GITHUB_APP_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----
YOUR_PRIVATE_KEY_HERE
-----END RSA PRIVATE KEY-----"
```

Then reload your shell:

```bash
source ~/.bashrc  # or source ~/.zshrc
```

#### Option B: Settings File

Add to `~/.hopcode/settings.json`:

```json
{
  "github": {
    "appId": "YOUR_APP_ID",
    "privateKey": "-----BEGIN RSA PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END RSA PRIVATE KEY-----"
  }
}
```

### Step 4: Verify Installation

Run this command to verify everything is working:

```bash
hopcode /github-auth
```

You should see: **✅ GitHub Authentication Successful**

---

## 🎯 What You Can Do After Installation

### Review Pull Requests

```bash
# Ask HopCode to review a PR
hopcode -p "/github pr review --number 123"

# Or use the reviewer subagent
hopcode -p "/agent github-reviewer Review PR #123 for security issues"
```

### Manage Issues

```bash
# List open issues
hopcode /github issues list --state open

# Triage a new issue
hopcode -p "/agent github-triager Triage issue #456"
```

### Check CI/CD Status

```bash
# Check CI status for a PR
hopcode /github ci status --pr 123

# Analyze failed builds
hopcode -p "/agent github-ci-monitor Check why CI failed on main"
```

### Trigger Workflows

```bash
# Trigger a workflow
hopcode /github workflow run Deploy --ref main
```

### Create Releases

```bash
# Create a new release
hopcode -p "/agent github-releaser Create v1.2.3 release with changelog"
```

### Security Scanning

```bash
# Scan for vulnerabilities
hopcode -p "/agent github-security-scanner Scan repository for security issues"
```

---

## 🔧 Advanced: Create Your Own GitHub App

If you prefer to create your own GitHub App instead of using the shared one:

### Step 1: Create App

1. Visit: **https://github.com/settings/apps/new**
2. Fill in:
   - **Name**: `HopCode (Your Name)`
   - **Homepage**: `https://hopcode.dev`
   - **Webhook**: Leave unchecked

### Step 2: Configure Permissions

**Repository Permissions:**

- Contents: **Read & Write**
- Issues: **Read & Write**
- Pull requests: **Read & Write**
- Workflows: **Read & Write**
- Actions: **Read & Write**
- Checks: **Read & Write**
- Commit statuses: **Read & Write**
- Metadata: **Read** (always on)

### Step 3: Generate Private Key

1. Scroll to **"Private keys"** section
2. Click **"Generate a private key"**
3. Save the `.pem` file securely

### Step 4: Copy App ID

1. Go to **"About"** section
2. Copy the **App ID** (e.g., `123456`)

### Step 5: Configure in HopCode

```bash
export GITHUB_APP_ID=YOUR_APP_ID
export GITHUB_APP_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----
... your private key ...
-----END RSA PRIVATE KEY-----"
```

---

## ❓ FAQ

### Is my code secure?

✅ **Yes!** HopCode only accesses repositories you explicitly install it on. Your private key is stored locally and never shared.

### Do I need to pay?

✅ **Free!** The HopCode GitHub App is free to install and use.

### Can I uninstall anytime?

✅ **Yes!** Visit https://github.com/settings/installations to uninstall anytime.

### What if I don't have a website?

✅ **No problem!** Webhook URL is optional. HopCode works without it.

### Can I use my own GitHub App?

✅ **Yes!** Follow the "Advanced" section above to create your own app.

---

## 📚 Additional Resources

- **Quick Start Guide**: [`docs/users/GITHUB_QUICK_START.md`](GITHUB_QUICK_START.md)
- **Full Integration Guide**: [`docs/users/github-integration.md`](github-integration.md)
- **Command Reference**: See `/github` command in HopCode

---

## 🆘 Need Help?

If you're having trouble:

1. **Check installation**: https://github.com/settings/installations
2. **Verify credentials**: Run `hopcode /github-auth`
3. **Review logs**: Check `~/.hopcode/hopcode.log`
4. **Get support**: Open an issue at https://github.com/TaimoorSiddiquiOfficial/HopCode/issues

---

**Ready?** 👉 **[Install HopCode GitHub App Now](https://github.com/apps/hopcode-ai-agent/installations/select_target)**
