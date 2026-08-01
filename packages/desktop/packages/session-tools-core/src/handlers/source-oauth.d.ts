/**
 * Source OAuth Handlers
 *
 * Handlers for triggering OAuth authentication flows.
 * Supports MCP OAuth, Google, Slack, and Microsoft OAuth.
 */
import type { SessionToolContext } from '../context.ts';
import type { ToolResult } from '../types.ts';
export interface SourceOAuthTriggerArgs {
    sourceSlug: string;
}
/**
 * Handle the source_oauth_trigger tool call.
 * Triggers OAuth 2.0 + PKCE flow for MCP sources.
 */
export declare function handleSourceOAuthTrigger(ctx: SessionToolContext, args: SourceOAuthTriggerArgs): Promise<ToolResult>;
export interface GoogleOAuthTriggerArgs {
    sourceSlug: string;
}
/**
 * Handle the source_google_oauth_trigger tool call.
 * Triggers Google OAuth for Gmail, Calendar, Drive, etc.
 */
export declare function handleGoogleOAuthTrigger(ctx: SessionToolContext, args: GoogleOAuthTriggerArgs): Promise<ToolResult>;
export interface SlackOAuthTriggerArgs {
    sourceSlug: string;
}
/**
 * Handle the source_slack_oauth_trigger tool call.
 * Triggers Slack OAuth for workspace access.
 */
export declare function handleSlackOAuthTrigger(ctx: SessionToolContext, args: SlackOAuthTriggerArgs): Promise<ToolResult>;
export interface MicrosoftOAuthTriggerArgs {
    sourceSlug: string;
}
/**
 * Handle the source_microsoft_oauth_trigger tool call.
 * Triggers Microsoft OAuth for Outlook, OneDrive, Teams, etc.
 */
export declare function handleMicrosoftOAuthTrigger(ctx: SessionToolContext, args: MicrosoftOAuthTriggerArgs): Promise<ToolResult>;
