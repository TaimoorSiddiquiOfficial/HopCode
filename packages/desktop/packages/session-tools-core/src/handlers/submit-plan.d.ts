/**
 * SubmitPlan Handler
 *
 * Submits a plan file for user review. This triggers the plan display UI
 * and pauses agent execution until the user responds.
 */
import type { SessionToolContext } from '../context.ts';
import type { ToolResult } from '../types.ts';
export interface SubmitPlanArgs {
    planPath: string;
}
/**
 * Handle the SubmitPlan tool call.
 *
 * 1. Verifies the plan file exists
 * 2. Reads the file to verify it's valid
 * 3. Calls the onPlanSubmitted callback
 * 4. Returns success (agent execution will be paused by callback)
 */
export declare function handleSubmitPlan(ctx: SessionToolContext, args: SubmitPlanArgs): Promise<ToolResult>;
