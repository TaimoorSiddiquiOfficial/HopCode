/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */

import { randomBytes } from 'node:crypto';

/**
 * GitHub Device Flow response
 */
export interface DeviceFlowResponse {
  /** Device verification code */
  device_code: string;
  /** User verification code (to enter on github.com) */
  user_code: string;
  /** Verification URI */
  verification_uri: string;
  /** Verification URI complete (with user_code) */
  verification_uri_complete: string;
  /** Polling interval in seconds */
  interval: number;
  /** Expiration in seconds */
  expires_in: number;
}

/**
 * Device Flow access token response
 */
export interface DeviceFlowTokenResponse {
  /** Access token */
  access_token: string;
  /** Token type */
  token_type: 'bearer';
  /** Token scope */
  scope: string;
}

/**
 * Device Flow error response
 */
export interface DeviceFlowErrorResponse {
  /** Error type */
  error:
    | 'authorization_pending'
    | 'slow_down'
    | 'expired_token'
    | 'access_denied'
    | string;
  /** Error description */
  error_description?: string;
  /** Error URI */
  error_uri?: string;
}

/**
 * GitHub Device Flow authentication manager
 *
 * Implements OAuth 2.0 Device Authorization Grant (RFC 8628)
 * Perfect for CLI and device authentication
 */
export class GitHubDeviceFlowAuth {
  private readonly clientId: string;
  private readonly clientSecret?: string;
  private readonly baseUrl: string;

  constructor(
    clientId: string,
    clientSecret?: string,
    hostname: string = 'github.com',
  ) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.baseUrl =
      hostname === 'github.com' ? 'https://github.com' : `https://${hostname}`;
  }

  /**
   * Initiate device flow authentication
   *
   * @returns Device flow response with user_code and verification URI
   */
  async initiateDeviceFlow(): Promise<DeviceFlowResponse> {
    const response = await fetch(`${this.baseUrl}/login/device/code`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'HopCode-Device-Flow',
      },
      body: JSON.stringify({
        client_id: this.clientId,
        ...(this.clientSecret && { client_secret: this.clientSecret }),
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(
        `Failed to initiate device flow: ${response.status} ${error}`,
      );
    }

    return (await response.json()) as DeviceFlowResponse;
  }

  /**
   * Poll for access token
   *
   * @param deviceCode - Device code from initiateDeviceFlow
   * @returns Access token when user authorizes, or error
   */
  async pollForToken(deviceCode: string): Promise<DeviceFlowTokenResponse> {
    const response = await fetch(`${this.baseUrl}/login/oauth/access_token`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'HopCode-Device-Flow',
      },
      body: JSON.stringify({
        client_id: this.clientId,
        device_code: deviceCode,
        grant_type: 'urn:ietf:params:oauth:grant-type:device_code',
        ...(this.clientSecret && { client_secret: this.clientSecret }),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorData = data as DeviceFlowErrorResponse;

      switch (errorData.error) {
        case 'authorization_pending':
          // User hasn't authorized yet - continue polling
          throw new DeviceFlowPendingError('Authorization pending');

        case 'slow_down':
          // Polling too fast - increase interval
          throw new DeviceFlowSlowDownError('Slow down polling');

        case 'expired_token':
          throw new DeviceFlowExpiredError('Device code expired');

        case 'access_denied':
          throw new DeviceFlowAccessDeniedError('User denied access');

        default:
          throw new Error(`Device flow error: ${errorData.error}`);
      }
    }

    return data as DeviceFlowTokenResponse;
  }

  /**
   * Complete device flow with automatic polling
   *
   * @param onUserCode - Callback with user_code and verification URI (display to user)
   * @param onToken - Callback with access token (save for later use)
   * @param onError - Callback with error message
   * @param progressCallback - Optional callback for progress updates
   * @returns Access token when successful
   */
  async authenticateWithProgress(
    onUserCode: (response: DeviceFlowResponse) => void,
    onToken: (token: DeviceFlowTokenResponse) => void,
    onError: (error: string) => void,
    progressCallback?: (message: string) => void,
  ): Promise<DeviceFlowTokenResponse> {
    try {
      // Step 1: Get device code
      if (progressCallback) {
        progressCallback('Requesting device code...');
      }

      const deviceResponse = await this.initiateDeviceFlow();

      // Step 2: Show user code to user
      onUserCode(deviceResponse);

      if (progressCallback) {
        progressCallback(
          `Enter code ${deviceResponse.user_code} at ${deviceResponse.verification_uri}`,
        );
      }

      // Step 3: Poll for token
      const expiresAt = Date.now() + deviceResponse.expires_in * 1000;
      let interval = deviceResponse.interval * 1000;

      while (Date.now() < expiresAt) {
        try {
          await this.sleep(interval);

          const tokenResponse = await this.pollForToken(
            deviceResponse.device_code,
          );

          // Success!
          onToken(tokenResponse);

          if (progressCallback) {
            progressCallback('✅ Authentication successful!');
          }

          return tokenResponse;
        } catch (error) {
          if (error instanceof DeviceFlowPendingError) {
            // Continue polling
            if (progressCallback) {
              progressCallback('Waiting for authorization...');
            }
            continue;
          }

          if (error instanceof DeviceFlowSlowDownError) {
            // Increase polling interval
            interval += 5000;
            if (progressCallback) {
              progressCallback(
                `Slowing down... (interval: ${interval / 1000}s)`,
              );
            }
            continue;
          }

          // Other errors - fail
          throw error;
        }
      }

      throw new DeviceFlowExpiredError('Device code expired');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      onError(errorMessage);
      throw error;
    }
  }

  /**
   * Simple sleep utility
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Generate a short verification code for display
   */
  static generateUserCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // No I, O, 0, 1
    const length = 8;
    const bytes = randomBytes(length);
    return Array.from(bytes)
      .map((b) => chars[b % chars.length])
      .join('-')
      .replace(/(.{4})/, '$1-');
  }
}

/**
 * Device Flow specific errors
 */
export class DeviceFlowPendingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DeviceFlowPendingError';
  }
}

export class DeviceFlowSlowDownError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DeviceFlowSlowDownError';
  }
}

export class DeviceFlowExpiredError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DeviceFlowExpiredError';
  }
}

export class DeviceFlowAccessDeniedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DeviceFlowAccessDeniedError';
  }
}

/**
 * Create Device Flow auth instance
 */
export function createGitHubDeviceFlowAuth(
  clientId: string,
  clientSecret?: string,
  hostname?: string,
): GitHubDeviceFlowAuth {
  return new GitHubDeviceFlowAuth(clientId, clientSecret, hostname);
}
