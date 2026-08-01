/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
export declare const REDACTED_URL_CREDENTIAL = "***REDACTED***";
/**
 * Redacts userinfo credentials from URL-like extension sources for logs,
 * telemetry, and display. This also handles diagnostic messages that contain
 * credentialed URLs. The original source should still be preserved for
 * installation and update operations.
 */
export declare function redactUrlCredentials(source: string): string;
