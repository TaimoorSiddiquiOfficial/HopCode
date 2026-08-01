/**
 * @license
 * Copyright 2026 HopCode Team Code
 * SPDX-License-Identifier: Apache-2.0
 */
import { type SessionListItem } from '@hoptrendy/hopcode-core';
/**
 * Shows an interactive session picker and returns the selected session ID.
 * Returns undefined if the user cancels or no sessions are available.
 */
export declare function showResumeSessionPicker(cwd?: string, initialSessions?: SessionListItem[]): Promise<string | undefined>;
