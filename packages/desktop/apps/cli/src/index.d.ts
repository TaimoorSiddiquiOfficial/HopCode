#!/usr/bin/env bun
/**
 * craft-cli — Terminal client for HopCode server.
 *
 * Connects over WebSocket (ws:// or wss://) to a running HopCode server
 * and provides commands for listing resources, managing sessions, sending
 * messages with real-time streaming, and validating server health.
 */
import { CliRpcClient } from './client.ts';
export interface CliArgs {
    url: string;
    token: string;
    workspace?: string;
    timeout: number;
    json: boolean;
    tlsCa?: string;
    sendTimeout: number;
    command: string;
    rest: string[];
    sources: string[];
    mode: string;
    outputFormat: string;
    noCleanup: boolean;
    noSpinner: boolean;
    verbose: boolean;
    serverEntry?: string;
    workspaceDir?: string;
    provider: string;
    model: string;
    apiKey: string;
    baseUrl: string;
}
export declare function parseArgs(argv: string[]): CliArgs;
export declare function resolveApiKey(_provider: string, explicit: string): string;
export declare function shouldSetupLlmConnection(existingConnectionCount: number, _args: Pick<CliArgs, 'provider' | 'baseUrl'>): boolean;
export interface ValidateStep {
    name: string;
    fn: (client: CliRpcClient, ctx: ValidateContext) => Promise<string>;
}
export interface ValidateContext {
    /** Pre-existing workspace directory (from --workspace-dir) */
    workspaceDir?: string;
    /** Custom endpoint URL (from --base-url) */
    baseUrl?: string;
    /** API key override (from --api-key) */
    apiKey?: string;
    /** Provider hint (from --provider, default 'hopcode') */
    provider?: string;
    workspaceId?: string;
    workspaceRootPath?: string;
    createdWorkspace?: boolean;
    createdSessionId?: string;
    createdSourceSlug?: string;
    createdSkillSlug?: string;
    createdAutomation?: boolean;
    automationTestSessionId?: string;
    /** Session created by automation that should be blocked by failing condition (if bug occurs) */
    automationBlockedSessionId?: string;
    automationName?: string;
    automationBlockedName?: string;
    createdLabelId?: string;
    /** Backup of existing automations.json before overwrite (undefined = didn't exist) */
    automationsJsonBackup?: string | null;
    /** Backup of existing automations-history.jsonl before overwrite (undefined = didn't exist) */
    automationsHistoryBackup?: string | null;
    branchedSessionId?: string;
    /** Label ID for e2e-test label created for session tool validation */
    e2eTestLabelId?: string;
    onEvent?: (ev: {
        type: string;
        [key: string]: unknown;
    }) => void;
}
export declare function getValidateSteps(): ValidateStep[];
export declare function runValidation(client: CliRpcClient, jsonMode: boolean, noSpinner?: boolean, workspaceDir?: string, validateOptions?: {
    baseUrl?: string;
    apiKey?: string;
    provider?: string;
}): Promise<number>;
export declare function main(argv?: string[]): Promise<void>;
