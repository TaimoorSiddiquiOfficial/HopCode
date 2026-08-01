/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
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
    error: 'authorization_pending' | 'slow_down' | 'expired_token' | 'access_denied' | string;
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
export declare class GitHubDeviceFlowAuth {
    private readonly clientId;
    private readonly clientSecret?;
    private readonly baseUrl;
    constructor(clientId: string, clientSecret?: string, hostname?: string);
    /**
     * Initiate device flow authentication
     *
     * @returns Device flow response with user_code and verification URI
     */
    initiateDeviceFlow(): Promise<DeviceFlowResponse>;
    /**
     * Poll for access token
     *
     * @param deviceCode - Device code from initiateDeviceFlow
     * @returns Access token when user authorizes, or error
     */
    pollForToken(deviceCode: string): Promise<DeviceFlowTokenResponse>;
    /**
     * Complete device flow with automatic polling
     *
     * @param onUserCode - Callback with user_code and verification URI (display to user)
     * @param onToken - Callback with access token (save for later use)
     * @param onError - Callback with error message
     * @param progressCallback - Optional callback for progress updates
     * @returns Access token when successful
     */
    authenticateWithProgress(onUserCode: (response: DeviceFlowResponse) => void, onToken: (token: DeviceFlowTokenResponse) => void, onError: (error: string) => void, progressCallback?: (message: string) => void): Promise<DeviceFlowTokenResponse>;
    /**
     * Simple sleep utility
     */
    private sleep;
    /**
     * Generate a short verification code for display
     */
    static generateUserCode(): string;
}
/**
 * Device Flow specific errors
 */
export declare class DeviceFlowPendingError extends Error {
    constructor(message: string);
}
export declare class DeviceFlowSlowDownError extends Error {
    constructor(message: string);
}
export declare class DeviceFlowExpiredError extends Error {
    constructor(message: string);
}
export declare class DeviceFlowAccessDeniedError extends Error {
    constructor(message: string);
}
/**
 * Create Device Flow auth instance
 */
export declare function createGitHubDeviceFlowAuth(clientId: string, clientSecret?: string, hostname?: string): GitHubDeviceFlowAuth;
