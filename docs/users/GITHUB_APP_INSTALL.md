# HopCode GitHub App Installation

**Welcome to HopCode!** 👋

To use GitHub integration features, you need to install the HopCode GitHub App on your repositories.

---

## 🚀 Quick Install (Recommended)

### Step 1: Install the App

Click the button below to install HopCode on your GitHub repositories:

👉 **[Install HopCode GitHub App](https://github.com/apps/hopcode-cli/installations/select_target)**

*(Button opens in new tab - come back here after installation)*

### Step 2: Select Repositories

1. Choose where to install (your account or organization)
2. **Select repositories** you want HopCode to access
3. Click **"Install"**

### Step 3: Configure Credentials

After installation, configure HopCode with your credentials:

#### Option A: Environment Variables (Recommended)

Add to your shell profile (`~/.bashrc`, `~/.zshrc`, or `~/.zprofile`):

```bash
export GITHUB_APP_ID=3424564
export GITHUB_APP_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEAyZvuxE43qw5MObiSTRkXTTNPvPNiiCKMUlZW9grvTfZmE2kq
cBdtctmurZ2xfEJNnaywpFDPVJ1hsB2SwfXGTqkw+0o9ubI76uvz2+T72Oh5to3l
IHwRX8I6s24OJRxW9TUF6EqIhZly2V0TTOv9hgOABkNgYUItWDPPm6KEyO2Z7UZO
Iiq9lyhlIR5hbPBnPhSElEySEkR5Q1bqGtfLh286FNBLLkjCptU3KmX2gAF9FfFE
vtWAdDVoTKtd+viJ3IJmP+YZwSZAoeJbn3RSxJq5Fl/Ly+m/nhyCwV1fnECwoWU1
0PAnrt39scnD/xxO7eJ4g4D1LQWc49Bif/wywQIDAQABAoIBADRRadm5borOUAue
kSC+xSQ8j5G6GzS2unFXhIOe/NDfg0fAP8oM2lM2mDTnujpDvn6PZNuPOO59VO9u
DTqWPBsHnvVnI7N/xDrHdmX2+0AjvAoasn4GlD+kWLVddwA8ZXiGhPzt8pWw53Pu
ymZoy0auu9dkPquej8PW1iZOO2UkhaTFyk/Z2QWh1XQEeenFdGan4I8I8edLmyiZ
dCwHe2G1kQjlOj34lFhq1BvZOPT1sfxcNjSXHgofFi07spBBhDE0ak442BYc3NG
EBRNroAmkQZsmnPOCWogNENLyTUxLEouENyngF0vplNl1+cDcuc2dpv+fcS/tGBX
8kwqO/0CgYEA5iEZ71VpSwOvWovAGJwhcPzegQyW+E6tq6IyrSOYPZ2FtAY36gcP
04GcAMkssFW2fMHVvu/6nmD5RRMvDw/s3gNsy9t6NaVy8aBK3wqKf1t10zNKGvWx
ouroR6je0C8uGdrSVc2aeNcLUYxl6JF9ph1l+dOjGuAVJbKLfyOcErcCgYEA4EYM
QwSg67Zd8gE4rxwNDSnFFfSypriAryE3EopNdPBD42/BiAQfUyuO2pvZRXhUvbwi
G3L75ip1jxJhePX4+974LR/on4Zhh+ESAnv9Za36kT8L+9Kk9E+2P+PTErr+i/KR
NB3C+tVapnC9r8r0r7qIuGRQ43LszlD66O27DkcCgYAnsJfPflSdmnIY1Ld5xxvB
Z+tcKHa1NqSfUGcbE2ODZPKVXOkx1Kv3F4h3Xjr14qKJm8iomK0JucHkFu3r1BxP
IhoWgrDuJa3QXIvtMd03H+gPV+40/iD37znGeiqLj0eNL/9MyxwUMUqDcwp0dPtN
tg5LayPbU8Bx8vw6HkMhuwKBgQC78BdAZfWP8S/Cp+FfZGtPd4xPvNGkwoIbwALN
h5YnA1xwj+sm1wWFBcBdUzJ8c7zXjnsqc23B0BzZevaxjbZLIurnrZCbddnvKt2T
tWGAPo31/1ZEfZ17mfzIh1sOnCLJFck2WiZVWkrvpRRf5vyq8e62TmI2Z80ni1bn
sKgK6wKBgFG0xBuqSJDHCMZGlmgd6nLW255ofY7skWOv1PWNuObE3jgaqibBt8Ar
YOS8QKBoX+7/6mwOgK9bYnlLHsRXj4oc+oSyTl2DInXuQe1vvsd9rlmAdbANrLLA
7mZTd7H1ctQNCylIsovwcgio5wbaJ2Sa30fX6eWCX2RNG7fcqfl/
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
    "appId": "3424564",
    "privateKey": "-----BEGIN RSA PRIVATE KEY-----\nMIIEowIBAAKCAQEAyZvuxE43qw5MObiSTRkXTTNPvPNiiCKMUlZW9grvTfZmE2kq\ncBdtctmurZ2xfEJNnaywpFDPVJ1hsB2SwfXGTqkw+0o9ubI76uvz2+T72Oh5to3l\nIHwRX8I6s24OJRxW9TUF6EqIhZly2V0TTOv9hgOABkNgYUItWDPPm6KEyO2Z7UZO\nIiq9lyhlIR5hbPBnPhSElEySEkR5Q1bqGtfLh286FNBLLkjCptU3KmX2gAF9FfFE\nvtWAdDVoTKtd+viJ3IJmP+YZwSZAoeJbn3RSxJq5Fl/Ly+m/nhyCwV1fnECwoWU1\n0PAnrt39scnD/xxO7eJ4g4D1LQWc49Bif/wywQIDAQABAoIBADRRadm5borOUAue\nkSC+xSQ8j5G6GzS2unFXhIOe/NDfg0fAP8oM2lM2mDTnujpDvn6PZNuPOO59VO9u\nDTqWPBsHnvVnI7N/xDrHdmX2+0AjvAoasn4GlD+kWLVddwA8ZXiGhPzt8pWw53Pu\nymZoy0auu9dkPquej8PW1iZOO2UkhaTFyk/Z2QWh1XQEeenFdGan4I8I8edLmyiZ\ndCwHe2G1kQjlOj34lFhq1BvZOPT1sfxcNjSXHgofFi07spBBhDE0ak442BYc3NG\nEBRNroAmkQZsmnPOCWogNENLyTUxLEouENyngF0vplNl1+cDcuc2dpv+fcS/tGBX\n8kwqO/0CgYEA5iEZ71VpSwOvWovAGJwhcPzegQyW+E6tq6IyrSOYPZ2FtAY36gcP\n04GcAMkssFW2fMHVvu/6nmD5RRMvDw/s3gNsy9t6NaVy8aBK3wqKf1t10zNKGvWx\nouroR6je0C8uGdrSVc2aeNcLUYxl6JF9ph1l+dOjGuAVJbKLfyOcErcCgYEA4EYM\nQwSg67Zd8gE4rxwNDSnFFfSypriAryE3EopNdPBD42/BiAQfUyuO2pvZRXhUvbwi\nG3L75ip1jxJhePX4+974LR/on4Zhh+ESAnv9Za36kT8L+9Kk9E+2P+PTErr+i/KR\nNB3C+tVapnC9r8r0r7qIuGRQ43LszlD66O27DkcCgYAnsJfPflSdmnIY1Ld5xxvB\nZ+tcKHa1NqSfUGcbE2ODZPKVXOkx1Kv3F4h3Xjr14qKJm8iomK0JucHkFu3r1BxP\nIhoWgrDuJa3QXIvtMd03H+gPV+40/iD37znGeiqLj0eNL/9MyxwUMUqDcwp0dPtN\ntg5LayPbU8Bx8vw6HkMhuwKBgQC78BdAZfWP8S/Cp+FfZGtPd4xPvNGkwoIbwALN\nh5YnA1xwj+sm1wWFBcBdUzJ8c7zXjnsqc23B0BzZevaxjbZLIurnrZCbddnvKt2T\ntWGAPo31/1ZEfZ17mfzIh1sOnCLJFck2WiZVWkrvpRRf5vyq8e62TmI2Z80ni1bn\nsKgK6wKBgFG0xBuqSJDHCMZGlmgd6nLW255ofY7skWOv1PWNuObE3jgaqibBt8Ar\nYOS8QKBoX+7/6mwOgK9bYnlLHsRXj4oc+oSyTl2DInXuQe1vvsd9rlmAdbANrLLA\n7mZTd7H1ctQNCylIsovwcgio5wbaJ2Sa30fX6eWCX2RNG7fcqfl/\n-----END RSA PRIVATE KEY-----"
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
