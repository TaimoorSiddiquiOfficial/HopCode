/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * `hopcode github auth`
 *
 * Authenticates with GitHub using the OAuth Device Flow (RFC 8628).
 * No browser redirect or callback URL needed — the user enters a short code
 * at https://github.com/login/device.
 *
 * Flow:
 * 1. POST /login/device/code → get device_code + user_code
 * 2. Show user_code + verification_uri to user
 * 3. Poll POST /login/oauth/access_token until user completes auth
 * 4. Save access_token + refresh_token to settings.env.GITHUB_TOKEN
 *
 * IMPORTANT: Replace HOPCODE_GITHUB_APP_CLIENT_ID below with the actual
 * Client ID obtained after registering the "HopCode CLI" GitHub App at:
 * https://github.com/settings/apps/new
 *
 * Required App settings:
 *   - Device flow: enabled
 *   - No callback URL needed
 *   - Permissions: Contents R/W, Issues R/W, Pull Requests R/W,
 *                  Metadata R, Workflows R/W
 */
import type { CommandModule } from 'yargs';
export declare const githubAuthCommand: CommandModule;
