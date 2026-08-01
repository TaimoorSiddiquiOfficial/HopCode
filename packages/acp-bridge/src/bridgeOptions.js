/**
 * @license
 * Copyright 2025 hopcode Team
 * SPDX-License-Identifier: Apache-2.0
 */
/** Ceiling on a sub-session prompt arriving over `extMethod`. The child is a
 * separate process, so this is a trust boundary — mirrors the scheduled-task
 * REST route's `MAX_PROMPT_LENGTH` and the core tool's own client-side check. */
export const MAX_SUB_SESSION_PROMPT_CHARS = 100_000;
/** Ceiling on the sub-session display name. It is a label — the launcher
 * truncates it to 60 chars for display anyway. */
export const MAX_SUB_SESSION_NAME_CHARS = 200;
//# sourceMappingURL=bridgeOptions.js.map