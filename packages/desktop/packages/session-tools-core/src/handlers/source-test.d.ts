/**
 * Source Test Handler
 *
 * Validates and tests a source configuration comprehensively.
 * Performs schema validation, completeness checks, icon handling,
 * connection tests, and auth verification.
 */
import type { SessionToolContext } from '../context.ts';
import type { ToolResult } from '../types.ts';
export interface SourceTestArgs {
    sourceSlug: string;
    /**
     * Auto-enable the source on success (flip `enabled: true` if needed
     * and activate it in the running session).
     * Defaults to `true`. Pass `false` for pure validation behavior.
     */
    autoEnable?: boolean;
}
/**
 * Handle the source_test tool call.
 *
 * Performs:
 * 1. Schema validation - validates config.json structure
 * 2. Icon handling - checks/downloads icon
 * 3. Completeness check - warns about missing guide.md/icon/tagline
 * 4. Connection test - tests if source endpoint is reachable
 * 5. Auth status check - verifies authentication
 * 6. Metadata update - updates lastTestedAt, connectionStatus
 */
export declare function handleSourceTest(ctx: SessionToolContext, args: SourceTestArgs): Promise<ToolResult>;
