# GitHub Integration - Quick Start

**Status**: ✅ Ready to Use  
**Authentication**: JWT (Private Key) - No Client Secret needed

---

## Your Credentials

| Credential      | Value                  | Location                                         |
| --------------- | ---------------------- | ------------------------------------------------ |
| **App ID**      | `3424564`              | Configured                                       |
| **Client ID**   | `Iv23livRiRBTa9cyBnk1` | Reference only                                   |
| **Private Key** | ✅ Available           | `.github/hopcode-cli.2026-04-23.private-key.pem` |

---

## Setup (2 Steps)

### Step 1: Install GitHub App on Repositories

1. Go to: https://github.com/settings/apps/3424564
2. Click **"Install App"** on left sidebar
3. Select repositories to grant access
4. Click **"Install"**

### Step 2: Configure HopCode

**Option A: Environment Variables** (Recommended for testing)

```bash
# Add to your ~/.bashrc or ~/.zshrc
export GITHUB_APP_ID=3424564
export GITHUB_APP_PRIVATE_KEY="$(cat D:/HopCode/.github/hopcode-cli.2026-04-23.private-key.pem)"
```

**Option B: Settings File** (Recommended for production)

Add to `~/.hopcode/settings.json`:

```json
{
  "github": {
    "appId": "3424564",
    "privateKey": "-----BEGIN RSA PRIVATE KEY-----\nMIIEowIBAAKCAQEAyZvuxE43qw5MObiSTRkXTTNPvPNiiCKMUlZW9grvTfZmE2kq\ncBdtctmurZ2xfEJNnaywpFDPVJ1hsB2SwfXGTqkw+0o9ubI76uvz2+T72Oh5to3l\nIHwRX8I6s24OJRxW9TUF6EqIhZly2V0TTOv9hgOABkNgYUItWDPPm6KEyO2Z7UZO\nIiq9lyhlIR5hbPBnPhSElEySEkR5Q1bqGtfLh286FNBLLkjCptU3KmX2gAF9FfFE\nvtWAdDVoTKtd+viJ3IJmP+YZwSZAoeJbn3RSxJq5Fl/Ly+m/nhyCwV1fnECwoWU1\n0PAnrt39scnD/xxO7eJ4g4D1LQWc49Bif/wywQIDAQABAoIBADRRadm5borOUAue\nkSC+xSQ8j5G6GzS2unFXhIOe/NDfg0fAP8oM2lM2mDTnujpDvn6PZNuPOO59VO9u\nDTqWPBsHnvVnI7N/xDrHdmX2+0AjvAoasn4GlD+kWLVddwA8ZXiGhPzt8pWw53Pu\nymZoy0auu9dkPquej8PW1iZOO2UkhaTFyk/Z2QWh1XQEeenFdGan4I8I8edLmyiZ\ndCwHe2G1kQjlOj34lFhq1BvZOPT1sfxcNjSXHgofFi07spBBhDE0ak442BYc3NG\nEBRNroAmkQZsmnPOCWogNENLyTUxLEouENyngF0vplNl1+cDcuc2dpv+fcS/tGBX\n8kwqO/0CgYEA5iEZ71VpSwOvWovAGJwhcPzegQyW+E6tq6IyrSOYPZ2FtAY36gcP\n04GcAMkssFW2fMHVvu/6nmD5RRMvDw/s3gNsy9t6NaVy8aBK3wqKf1t10zNKGvWx\nouroR6je0C8uGdrSVc2aeNcLUYxl6JF9ph1l+dOjGuAVJbKLfyOcErcCgYEA4EYM\nQwSg67Zd8gE4rxwNDSnFFfSypriAryE3EopNdPBD42/BiAQfUyuO2pvZRXhUvbwi\nG3L75ip1jxJhePX4+974LR/on4Zhh+ESAnv9Za36kT8L+9Kk9E+2P+PTErr+i/KR\nNB3C+tVapnC9r8r0r7qIuGRQ43LszlD66O27DkcCgYAnsJfPflSdmnIY1Ld5xxvB\nZ+tcKHa1NqSfUGcbE2ODZPKVXOkx1Kv3F4h3Xjr14qKJm8iomK0JucHkFu3r1BxP\nIhoWgrDuJa3QXIvtMd03H+gPV+40/iD37znGeiqLj0eNL/9MyxwUMUqDcwp0dPtN\ntg5LayPbU8Bx8vw6HkMhuwKBgQC78BdAZfWP8S/Cp+FfZGtPd4xPvNGkwoIbwALN\nh5YnA1xwj+sm1wWFBcBdUzJ8c7zXjnsqc23B0BzZevaxjbZLIurnrZCbddnvKt2T\ntWGAPo31/1ZEfZ17mfzIh1sOnCLJFck2WiZVWkrvpRRf5vyq8e62TmI2Z80ni1bn\nsKgK6wKBgFG0xBuqSJDHCMZGlmgd6nLW255ofY7skWOv1PWNuObE3jgaqibBt8Ar\nYOS8QKBoX+7/6mwOgK9bYnlLHsRXj4oc+oSyTl2DInXuQe1vvsd9rlmAdbANrLLA\n7mZTd7H1ctQNCylIsovwcgio5wbaJ2Sa30fX6eWCX2RNG7fcqfl/\n-----END RSA PRIVATE KEY-----"
  }
}
```

---

## Test Installation

```bash
# Test authentication
hopcode github auth

# List your issues
hopcode /github issues list --state open

# Review a PR
hopcode /github pr review --number 123

# Use GitHub subagents
hopcode -p "/agent github-reviewer Review PR #123"
hopcode -p "/agent github-triager Triage issue #456"
hopcode -p "/agent github-ci-monitor Check CI status"
```

---

## Available Commands

| Command            | Description           |
| ------------------ | --------------------- |
| `/github auth`     | Authentication status |
| `/github issues`   | Manage issues         |
| `/github pr`       | Review pull requests  |
| `/github ci`       | Check CI/CD           |
| `/github workflow` | Manage workflows      |
| `/github release`  | Create releases       |
| `/github security` | Security scanning     |

---

## Security Notes

✅ **Private key is protected**: `.gitignore` prevents `.pem` files from being committed  
✅ **No Client Secret in repo**: JWT auth doesn't require it  
✅ **Local-only config**: Credentials stored in `~/.hopcode/settings.json`, not in repo  
✅ **Each user creates their own**: When distributing, users create their own GitHub Apps

---

## Troubleshooting

**"Permission denied" errors:**

- Check app is installed on the repository
- Verify repository permissions in GitHub App settings

**"Invalid private key" errors:**

- Ensure PEM file content includes newlines (`\n`)
- Check file wasn't corrupted during copy

**"Rate limit exceeded":**

- Installation tokens are cached for 5 minutes
- GitHub App limits are much higher than OAuth

---

**Full Documentation**: `docs/users/github-integration.md`  
**Configuration Guide**: `.github-app-config.md`
