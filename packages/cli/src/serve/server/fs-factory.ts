/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */

import { writeStderrLine } from '../../utils/stdioHelpers.js';
import type { BridgeEvent } from '@hoptrendy/acp-bridge/eventBus';
import {
  createWorkspaceFileSystemFactory,
  type WorkspaceFileSystemFactory,
} from '../fs/index.js';

/**
 * Build a no-op fs-audit emitter that logs a warning every
 * `WARN_EVERY` dropped events. The default factory uses this so a
 * regression that silently strips audit events shows up in operator
 * logs instead of disappearing. `runHopCodeServe` replaces this with a
 * real per-session emit, so legitimate production traffic never hits
 * the warning.
 */
export function createDefaultFsAuditEmit(): (event: BridgeEvent) => void {
  const WARN_EVERY = 100;
  let droppedCount = 0;
  return (event: BridgeEvent) => {
    droppedCount += 1;
    if (droppedCount === 1 || droppedCount % WARN_EVERY === 0) {
      const data = event.data as
        | { errorKind?: string; pathHash?: string; intent?: string }
        | undefined;
      const ctx: string[] = [];
      if (data?.errorKind) ctx.push(`errorKind=${data.errorKind}`);
      if (data?.intent) ctx.push(`intent=${data.intent}`);
      if (data?.pathHash) ctx.push(`pathHash=${data.pathHash}`);
      const ctxStr = ctx.length > 0 ? ` (${ctx.join(' ')})` : '';
      writeStderrLine(
        `hopcode serve: fs audit emit is the default no-op — ${droppedCount} event(s) dropped so far. ` +
          `Latest type=${event.type}${ctxStr}. ` +
          `Inject deps.fsFactory in createServeApp to wire audit into the EventBus.`,
      );
    }
  };
}

/**
 * Shared `WorkspaceFileSystemFactory` construction used by both
 * `runHopCodeServe` and `createServeApp`'s default bridge wiring.
 * Centralizes the "use the injected factory if provided, otherwise
 * build one with the given trust + audit-emit posture" logic.
 *
 * Trust is intentionally a **required** parameter — the two call
 * sites have different correct defaults:
 *   - `runHopCodeServe` defaults to `trusted: true`
 *   - `createServeApp` defaults to `trusted: false` (test-safe)
 */
export function resolveBridgeFsFactory(input: {
  boundWorkspace: string;
  injected?: WorkspaceFileSystemFactory;
  trusted: boolean;
  emit?: (event: BridgeEvent) => void;
  customIgnoreFiles?: string[];
}): WorkspaceFileSystemFactory {
  if (input.injected) return input.injected;
  return createWorkspaceFileSystemFactory({
    boundWorkspace: input.boundWorkspace,
    trusted: input.trusted,
    emit: input.emit ?? createDefaultFsAuditEmit(),
    ...(input.customIgnoreFiles !== undefined
      ? { customIgnoreFiles: input.customIgnoreFiles }
      : {}),
  });
}
