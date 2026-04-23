# GitHub Authentication Methods - Complete Guide

**Date**: 2026-04-24  
**Status**: ✅ All Methods Implemented

---

## Overview

HopCode supports **3 authentication methods** for GitHub integration:

1. **GitHub App JWT** (Recommended for production)
2. **OAuth Device Flow** (Best for CLI testing)
3. **Personal Access Token** (Legacy, not recommended)

---

## Method 1: GitHub App JWT Authentication ✅ (Recommended)

### Best For
- Production deployments
- Server-to-server communication
- Automated workflows
- CI/CD pipelines
- High-volume API usage

### How It Works

```
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│   HopCode    │         │   GitHub     │         │   GitHub     │
│              │         │    App       │         │    API       │
└──────┬───────┘         └──────┬───────┘         └──────┬───────┘
       │                        │                        │
       │── Generate JWT ──────>│                        │
       │   (Private Key)       │                        │
       │                        │                        │
       │<── JWT Validated ─────│                        │
       │                        │                        │
       │── Exchange for ──────>│                        │
       │   Installation Token  │                        │
       │                        │                        │
       │<── Installation ──────│                        │
       │   Token (1 hour)      │                        │
       │                        │                        │
       │── API Requests ──────────────────────────────>│
       │   (with Install Token)│                        │
       │                        │                        │
```

### Setup

```bash
# 1. Install GitHub App
# Visit: https://github.com/apps/hopcode-ai-agent

# 2. Configure credentials
export GITHUB_APP_ID=3424564
export GITHUB_APP_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\n..."

# 3. Use HopCode
hopcode /github issues list
```

### Pros

- ✅ Highest rate limit (15,000 requests/hour)
- ✅ No token expiry (auto-refreshes installation tokens)
- ✅ Most secure (private key never transmitted)
- ✅ Acts as app installation (not user)
- ✅ Fine-grained permissions per installation
- ✅ Works on all repos where app is installed

### Cons

- ❌ Requires GitHub App creation
- ❌ More complex setup
- ❌ Need to manage private key securely

### Configuration

```json
// ~/.hopcode/settings.json
{
  "github": {
    "appId": "3424564",
    "privateKey": "-----BEGIN RSA PRIVATE KEY-----\n..."
  }
}
```

---

## Method 2: OAuth Device Flow ✅ (Best for CLI)

### Best For
- CLI interactive authentication
- Quick testing
- Personal use
- Users without GitHub App setup

### How It Works

```
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│   HopCode    │         │   GitHub     │         │   Browser    │
│     CLI      │         │    OAuth     │         │              │
└──────┬───────┘         └──────┬───────┘         └──────┬───────┘
       │                        │                        │
       │── Request Code ──────>│                        │
       │                        │                        │
       │<── Device Code ───────│                        │
       │<── User Code ─────────│                        │
       │<── Verification URI ──│                        │
       │                        │                        │
       │── Show to User ──────────────────────────────>│
       │   "Enter CODE at URL" │                        │
       │                        │                        │
       │                        │◄── Enter Code ────────│
       │                        │◄── Authorize ─────────│
       │                        │                        │
       │<── Poll Token ────────│                        │
       │   (every 5s)          │                        │
       │                        │                        │
       │<── Access Token ──────│                        │
       │   (8 hours)           │                        │
       │                        │                        │
       │── Save Token ────────>│                        │
       │                        │                        │
```

### Setup

```bash
# 1. Run interactive auth
hopcode /github-device-auth

# 2. Follow prompts
# - Opens browser
# - Enter code
# - Authorize

# 3. Start using
hopcode /github issues list
```

### Pros

- ✅ No setup required (uses HopCode's OAuth app)
- ✅ Interactive and user-friendly
- ✅ Works on any device with CLI
- ✅ No private key management
- ✅ User sees exactly what permissions are granted

### Cons

- ❌ Token expires (8 hours)
- ❌ Lower rate limit (5,000 requests/hour)
- ❌ Acts as user (not app)
- ❌ Requires manual re-authentication
- ❌ Needs user interaction

### Configuration

```json
// ~/.hopcode/settings.json (auto-saved after auth)
{
  "github": {
    "oauthToken": "gho_abc123..."
  }
}
```

---

## Method 3: Personal Access Token (PAT) ⚠️ (Legacy)

### Best For
- Legacy systems
- Simple scripts
- Backward compatibility

### How It Works

```
┌──────────────┐         ┌──────────────┐
│   HopCode    │         │   GitHub     │
│              │         │    API       │
└──────┬───────┘         └──────┬───────┘
       │                        │
       │── API Request ───────>│
       │   Authorization: token│
       │   ghp_abc123...       │
       │                        │
       │<── Response ──────────│
       │                        │
```

### Setup

```bash
# 1. Create PAT in GitHub
# Settings > Developer settings > Personal access tokens

# 2. Configure
export GITHUB_TOKEN=ghp_abc123...

# 3. Use
hopcode /github issues list
```

### Pros

- ✅ Simple to create
- ✅ Easy to understand
- ✅ Works everywhere

### Cons

- ❌ Least secure (static token)
- ❌ Manual rotation required
- ❌ All-or-nothing permissions
- ❌ Can be revoked accidentally
- ❌ No expiration management
- ❌ Not recommended for production

### Configuration

```json
// ~/.hopcode/settings.json
{
  "github": {
    "token": "ghp_abc123..."
  }
}
```

---

## Comparison Table

| Feature | GitHub App JWT | OAuth Device Flow | Personal Access Token |
|---------|----------------|-------------------|----------------------|
| **Setup Complexity** | Medium | Easy | Easy |
| **Rate Limit** | 15,000/hr | 5,000/hr | 5,000/hr |
| **Token Expiry** | Auto-refresh | 8 hours | Never (manual) |
| **Security** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Best Use** | Production | CLI testing | Legacy |
| **Acts As** | App | User | User |
| **Permissions** | Fine-grained | User scopes | All-or-nothing |
| **Setup Time** | 10 minutes | 1 minute | 5 minutes |

---

## Which Method Should You Use?

### Use GitHub App JWT If:

- ✅ Building production application
- ✅ Need highest rate limits
- ✅ Running automated workflows
- ✅ Don't want token expiry issues
- ✅ Managing multiple repositories
- ✅ Want best security practices

### Use OAuth Device Flow If:

- ✅ Quick testing and development
- ✅ Personal CLI usage
- ✅ Don't want to manage private keys
- ✅ Okay with re-authenticating every 8 hours
- ✅ Want interactive authentication

### Use Personal Access Token If:

- ⚠️ Legacy system integration
- ⚠️ Simple one-off scripts
- ⚠️ Backward compatibility needed
- ⚠️ **Not recommended for new deployments**

---

## Implementation Status

| Method | Status | Command | Docs |
|--------|--------|---------|------|
| **GitHub App JWT** | ✅ Implemented | Configure in settings.json | `docs/users/github-integration.md` |
| **OAuth Device Flow** | ✅ Implemented | `/github-device-auth` | `docs/users/GITHUB_DEVICE_FLOW_GUIDE.md` |
| **Personal Access Token** | ⚠️ Legacy | Set `GITHUB_TOKEN` env | GitHub docs |

---

## Quick Start by Use Case

### Use Case: Production Server

```bash
# Use GitHub App JWT
export GITHUB_APP_ID=3424564
export GITHUB_APP_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\n..."

# Test
hopcode /github issues list
```

### Use Case: Local Development

```bash
# Use OAuth Device Flow
hopcode /github-device-auth

# Follow browser prompts
# Start using immediately
```

### Use Case: CI/CD Pipeline

```yaml
# GitHub Actions
- name: Setup HopCode
  uses: hoptrendy/setup-hopcode@v1
  with:
    github-app-id: ${{ secrets.GITHUB_APP_ID }}
    github-private-key: ${{ secrets.GITHUB_PRIVATE_KEY }}

- name: Run HopCode
  run: hopcode /github pr review --number ${{ github.event.pull_request.number }}
```

### Use Case: Quick Testing

```bash
# Use OAuth Device Flow (fastest)
hopcode /github-device-auth

# Or use PAT (if you have one)
export GITHUB_TOKEN=ghp_abc123...
hopcode /github issues list
```

---

## Security Best Practices

### For GitHub App JWT

```bash
# ✅ Store private key securely
chmod 600 ~/.hopcode/private-key.pem

# ✅ Use environment variables in CI
export GITHUB_APP_PRIVATE_KEY

# ✅ Never commit private key
echo "*.pem" >> .gitignore
```

### For OAuth Device Flow

```bash
# ✅ Token auto-saved to config
# ✅ Expires automatically (8 hours)
# ✅ Can be revoked in GitHub settings

# Visit: https://github.com/settings/applications
```

### For Personal Access Token

```bash
# ⚠️ Rotate regularly (every 90 days)
# ⚠️ Use minimum scopes needed
# ⚠️ Store in secure location
# ⚠️ Never commit to git
```

---

## Troubleshooting

### Issue: "Invalid private key"

**Solution**: Check PEM format
```bash
# Should include newlines
export GITHUB_APP_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----"
```

### Issue: "Token expired"

**Solution**: Re-authenticate
```bash
# Device Flow
hopcode /github-device-auth

# Or switch to GitHub App JWT (no expiry)
```

### Issue: "Rate limit exceeded"

**Solution**: Use GitHub App JWT (15k/hr vs 5k/hr)
```bash
# Switch from Device Flow/PAT to GitHub App
export GITHUB_APP_ID=3424564
export GITHUB_APP_PRIVATE_KEY="..."
```

---

## Resources

- **GitHub App Docs**: https://docs.github.com/en/developers/apps
- **OAuth Device Flow**: https://docs.github.com/en/developers/apps/building-oauth-apps/authorizing-oauth-apps
- **RFC 8628**: OAuth 2.0 Device Authorization Grant
- **HopCode Integration**: `docs/users/github-integration.md`

---

## Summary

| Method | Status | Recommendation |
|--------|--------|----------------|
| **GitHub App JWT** | ✅ Implemented | ⭐⭐⭐⭐⭐ Best for production |
| **OAuth Device Flow** | ✅ Implemented | ⭐⭐⭐⭐ Best for CLI testing |
| **Personal Access Token** | ⚠️ Legacy | ⭐⭐ Only for legacy systems |

**All three methods are fully implemented and working!** Choose based on your use case.

---

**Date**: 2026-04-24  
**App ID**: 3424564  
**OAuth Client ID**: Iv23livRiRBTa9cyBnk1  
**Status**: ✅ All Methods Operational
