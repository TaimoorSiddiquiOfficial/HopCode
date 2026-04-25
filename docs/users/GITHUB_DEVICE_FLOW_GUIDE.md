# GitHub Device Flow Authentication Guide

**Status**: ✅ Implemented  
**Flow Type**: OAuth 2.0 Device Authorization Grant (RFC 8628)  
**Use Case**: CLI and device authentication

---

## Overview

Device Flow allows users to authenticate on devices with limited input capability (like CLI tools) by authorizing on a separate device (browser).

### Flow Diagram

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   HopCode   │         │   GitHub    │         │   Browser   │
│     CLI     │         │    OAuth    │         │             │
└──────┬──────┘         └──────┬──────┘         └──────┬──────┘
       │                       │                       │
       │── 1. Request Code ───>│                       │
       │                       │                       │
       │<── Device Code ───────│                       │
       │<── User Code ─────────│                       │
       │<── Verification URI ──│                       │
       │                       │                       │
       │── 2. Show to User ──────────────────────────>│
       │      "Enter CODE at URL"                     │
       │                       │                       │
       │                       │◄── 3. User Enters ───│
       │                       │    Code & Authorizes  │
       │                       │                       │
       │<── 4. Poll Token ─────│                       │
       │    (every 5-10s)      │                       │
       │                       │                       │
       │<── Access Token ──────│                       │
       │                       │                       │
       │── 5. Save Token ─────>│                       │
       │                       │                       │
```

---

## How to Use

### Method 1: Interactive Command

```bash
# Start Device Flow authentication
hopcode /github-device-auth
```

**What happens:**

1. HopCode requests a device code from GitHub
2. Displays a user code and verification URL
3. You enter the code in your browser
4. You authorize the application
5. HopCode receives and saves the access token

### Method 2: Manual Device Flow

```bash
# Step 1: Request device code
curl -X POST https://github.com/login/device/code \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{"client_id":"Iv23livRiRBTa9cyBnk1"}'

# Response:
{
  "device_code": "abc123...",
  "user_code": "ABCD-1234",
  "verification_uri": "https://github.com/login/device",
  "expires_in": 900,
  "interval": 5
}

# Step 2: Enter code in browser
# Visit: https://github.com/login/device
# Enter: ABCD-1234

# Step 3: Poll for token
curl -X POST https://github.com/login/oauth/access_token \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{
    "client_id": "Iv23livRiRBTa9cyBnk1",
    "device_code": "abc123...",
    "grant_type": "urn:ietf:params:oauth:grant-type:device_code"
  }'
```

---

## Testing Device Flow

### Test 1: Basic Authentication

```bash
# 1. Run authentication command
hopcode /github-device-auth

# 2. Note the user code (e.g., ABCD-1234)
# 3. Open browser to shown URL
# 4. Enter code and authorize
# 5. Wait for success message

# Expected output:
✅ GitHub Authentication Successful!
Authentication Method: Device Flow (OAuth 2.0)
Token Type: bearer
Scope: repo,workflow,read:org
```

### Test 2: Token Validation

```bash
# After authentication, test the token
curl -H "Authorization: token YOUR_ACCESS_TOKEN" \
  https://api.github.com/user

# Should return your user info:
{
  "login": "your-username",
  "id": 123456,
  "name": "Your Name",
  ...
}
```

### Test 3: API Access

```bash
# Test repository access
curl -H "Authorization: token YOUR_ACCESS_TOKEN" \
  https://api.github.com/user/repos

# Test workflow access
curl -H "Authorization: token YOUR_ACCESS_TOKEN" \
  https://api.github.com/repos/owner/repo/actions/workflows
```

---

## Error Handling

### Error: authorization_pending

```json
{
  "error": "authorization_pending"
}
```

**Meaning**: User hasn't authorized yet  
**Action**: Continue polling (this is normal)

---

### Error: slow_down

```json
{
  "error": "slow_down",
  "error_description": "Polling too fast"
}
```

**Meaning**: Polling interval too short  
**Action**: Increase interval by 5 seconds

---

### Error: expired_token

```json
{
  "error": "expired_token"
}
```

**Meaning**: Device code expired (15 min lifetime)  
**Action**: Start over with new device code

---

### Error: access_denied

```json
{
  "error": "access_denied"
}
```

**Meaning**: User denied authorization  
**Action**: User must restart and approve

---

## Comparison: Device Flow vs JWT Auth

| Feature         | Device Flow (OAuth)    | JWT (GitHub App)         |
| --------------- | ---------------------- | ------------------------ |
| **Use Case**    | User authentication    | App authentication       |
| **Token Type**  | OAuth access token     | JWT → Installation token |
| **Permissions** | User's permissions     | App's permissions        |
| **Expiry**      | 8 hours (configurable) | 1 hour (auto-refresh)    |
| **Best For**    | CLI, mobile apps       | Server-to-server         |
| **Setup**       | OAuth App required     | GitHub App required      |
| **Rate Limit**  | 5,000 requests/hour    | 15,000 requests/hour     |
| **Acts As**     | User                   | App installation         |

---

## When to Use Device Flow

### ✅ Good For:

- CLI tools requiring user authentication
- Mobile apps
- Devices with limited input
- When you need user's permissions
- Interactive authentication flows

### ❌ Not Ideal For:

- Server-to-server communication
- Automated workflows (use JWT)
- High-volume API calls (use GitHub App)
- Background services

---

## Security Considerations

### Token Storage

```json
// ~/.hopcode/settings.json
{
  "github": {
    "oauthToken": "gho_abc123..." // ← Device Flow token
  }
}
```

**Best Practices:**

- ✅ Store in user's home directory
- ✅ Set file permissions to 600 (owner read/write only)
- ✅ Never commit to git
- ✅ Rotate tokens periodically

### Token Scopes

Request only necessary scopes:

```
repo              - Full control of private repositories
workflow          - Update GitHub Action workflows
read:org          - Read org membership
read:user         - Read user profile
user:email        - Access user email addresses
```

---

## Implementation Code

### TypeScript Example

```typescript
import { GitHubDeviceFlowAuth } from '@hoptrendy/hopcode-core';

const deviceAuth = new GitHubDeviceFlowAuth(
  'Iv23livRiRBTa9cyBnk1', // Client ID
  'your_client_secret', // Client Secret (optional)
);

// Authenticate with progress
const token = await deviceAuth.authenticateWithProgress(
  // Show user code
  (response) => {
    console.log(`Enter ${response.user_code} at ${response.verification_uri}`);
  },

  // Save token
  (token) => {
    console.log(`Got token: ${token.access_token}`);
    saveToConfig(token.access_token);
  },

  // Handle errors
  (error) => {
    console.error(`Auth failed: ${error}`);
  },

  // Progress updates
  (message) => {
    console.log(`[Auth] ${message}`);
  },
);
```

### Node.js CLI Example

```javascript
#!/usr/bin/env node

import { GitHubDeviceFlowAuth } from '@hoptrendy/hopcode-core';

async function authenticate() {
  const auth = new GitHubDeviceFlowAuth(process.env.GITHUB_CLIENT_ID);

  console.log('Starting GitHub authentication...\n');

  try {
    const token = await auth.authenticateWithProgress(
      (response) => {
        console.log('\n' + '='.repeat(50));
        console.log('AUTHORIZATION REQUIRED');
        console.log('='.repeat(50));
        console.log(`1. Visit: ${response.verification_uri}`);
        console.log(`2. Enter code: ${response.user_code}`);
        console.log(`3. Authorize HopCode`);
        console.log('='.repeat(50) + '\n');
        console.log('Waiting for authorization...');
      },
      (token) => {
        console.log('\n✅ Authentication successful!');
        console.log(`Token: ${token.access_token.substring(0, 10)}...`);
        saveToken(token.access_token);
      },
      (error) => {
        console.error('\n❌ Authentication failed:', error);
        process.exit(1);
      },
      (message) => {
        console.log(`[Status] ${message}`);
      },
    );

    return token;
  } catch (error) {
    console.error('Fatal error:', error.message);
    process.exit(1);
  }
}

function saveToken(token) {
  // Save to config file
  const configPath = path.join(os.homedir(), '.hopcode', 'settings.json');
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  config.github.oauthToken = token;
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
}

authenticate();
```

---

## Troubleshooting

### Issue: Token not working

**Check:**

```bash
# Verify token is valid
curl -H "Authorization: token YOUR_TOKEN" https://api.github.com/user

# Check token scopes
curl -H "Authorization: token YOUR_TOKEN" https://api.github.com/user
# Look for "X-OAuth-Scopes" header
```

### Issue: Polling never completes

**Check:**

- User entered correct code
- User actually authorized (check email for confirmation)
- Device code hasn't expired (15 min limit)
- Network connection is stable

### Issue: Getting "slow_down" errors

**Solution:**

```typescript
// Increase polling interval
let interval = 5000; // Start at 5 seconds

// On slow_down error
interval += 5000; // Add 5 seconds
```

---

## Resources

- **RFC 8628**: OAuth 2.0 Device Flow specification
- **GitHub Docs**: https://docs.github.com/en/developers/apps/building-oauth-apps/authorizing-oauth-apps
- **Device Flow Endpoint**: https://github.com/login/device/code
- **Token Endpoint**: https://github.com/login/oauth/access_token

---

## Next Steps

1. **Test Device Flow**: Run `hopcode /github-device-auth`
2. **Verify Token**: Check token works with API
3. **Compare with JWT**: Try both auth methods
4. **Choose Method**: Use Device Flow for CLI, JWT for server

---

**Status**: ✅ Ready for testing  
**Client ID**: Iv23livRiRBTa9cyBnk1  
**Endpoint**: https://github.com/login/device
