/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { resolveAcpHttpEnabled } from './acp-http-enabled.js';
/** Stdio MCP adapter command used by the optional CDP browser automation bridge. */
export const HOPCODE_CDP_MCP_COMMAND_ENV = 'HOPCODE_CDP_MCP_COMMAND';
export function resolveCdpMcpCommand(env) {
    const command = env[HOPCODE_CDP_MCP_COMMAND_ENV]?.trim();
    return command ? command : undefined;
}
export function isBrowserAutomationMcpAvailable(opts, env) {
    return (opts.cdpTunnelOverWs === true &&
        !opts.token &&
        resolveAcpHttpEnabled(env) &&
        resolveCdpMcpCommand(env) !== undefined);
}
//# sourceMappingURL=cdp-mcp-command.js.map